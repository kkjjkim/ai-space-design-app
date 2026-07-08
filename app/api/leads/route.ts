import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/leads";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";
import { site } from "@/lib/site";

export const runtime = "nodejs";

// ── 간단 레이트리밋 (인스턴스 메모리, 베스트에포트) ─────────────
// 서버리스라 인스턴스별로만 유효하지만, 같은 인스턴스로 몰리는 봇 버스트를 잡는다.
const HITS = new Map<string, number[]>();
const RL_WINDOW_MS = 10 * 60 * 1000; // 10분
const RL_MAX = 4; // 10분 내 4건 초과 → 의심

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (HITS.get(ip) || []).filter((t) => now - t < RL_WINDOW_MS);
  arr.push(now);
  HITS.set(ip, arr);
  return arr.length > RL_MAX;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : "").trim() || "unknown";
}

// 한국 휴대폰: 숫자만 10~11자리, 01x 시작
function isKoreanMobile(phone: string): boolean {
  const d = phone.replace(/\D/g, "");
  return /^01[016789]\d{7,8}$/.test(d);
}

// Cloudflare Turnstile 검증. 시크릿 미설정 시 캡차 단계 건너뜀.
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      }
    );
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

// 운영자에게 신규 상담 알림 메일 발송. 실패해도 신청 저장은 성공 처리.
async function notifyOwner(lead: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  if (!apiKey || !to) return;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const from =
      process.env.LEAD_NOTIFY_FROM || "상담신청 <onboarding@resend.dev>";

    const rows = [
      ["이름", lead.name],
      ["연락처", lead.phone],
      ["업종", lead.industry],
      ["위치·평수", lead.location],
      ["예산대", lead.budget],
      ["하고 싶은 가게", lead.message],
      ["유입", lead.source],
    ]
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${v}</td></tr>`)
      .join("");

    await resend.emails.send({
      from,
      to: to.split(",").map((s) => s.trim()),
      subject: `[${site.mailTag} · 새 상담 신청] ${lead.name} (${lead.phone})`,
      html: `<h2>[${site.mailTag}] 새 무료 컨셉 상담 신청</h2><table cellpadding="6">${rows}</table>`,
    });
  } catch (err) {
    console.error("알림 메일 발송 실패:", err);
  }
}

// leads insert. status 컬럼이 아직 없으면(마이그레이션 전) 컬럼 없이 재시도.
async function insertLead(row: Record<string, unknown>, status: string) {
  const supabase = getSupabaseServerClient();
  let res = await supabase.from("leads").insert({ ...row, status });
  const msg = res.error?.message || "";
  if (res.error && /status/i.test(msg) && /(column|schema cache|find|exist)/i.test(msg)) {
    res = await supabase.from("leads").insert(row);
  }
  return res;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  // 1) 허니팟 — 사람 눈에 안 보이는 칸이 채워지면 봇 → 조용히 폐기(성공처럼 응답)
  if (
    typeof body.company_website === "string" &&
    body.company_website.trim() !== ""
  ) {
    return NextResponse.json({ ok: true });
  }

  // 2) 캡차(Turnstile) 실패 → 조용히 폐기
  const ip = clientIp(req);
  const captchaOk = await verifyTurnstile(String(body.captchaToken || ""), ip);
  if (!captchaOk) {
    return NextResponse.json({ ok: true });
  }

  // 3) 스키마 검증
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
  const data = parsed.data;

  // 4) 연락처가 한국 휴대폰 형식이 아니면 거부 (실제 사용자에게 안내)
  if (!isKoreanMobile(data.phone)) {
    return NextResponse.json(
      { error: "휴대폰 번호를 정확히 입력해주세요. (예: 010-1234-5678)" },
      { status: 422 }
    );
  }

  // 5) 의심 플래그 (거부는 아님 → 저장하되 알림 메일은 보내지 않음)
  const flags: string[] = [];
  const msg = data.message || "";
  if (/https?:\/\/|www\./i.test(msg)) flags.push("link");

  const vals = [data.name, data.phone, data.industry, data.location, data.message]
    .map((v) => (v || "").trim())
    .filter(Boolean);
  const counts = new Map<string, number>();
  for (const v of vals) counts.set(v, (counts.get(v) || 0) + 1);
  if ([...counts.values()].some((c) => c >= 2)) flags.push("repeat");

  if (rateLimited(ip)) flags.push("rate");

  const status = flags.length > 0 ? "의심" : "정상";

  // 키 미설정(데모 모드): 저장·메일 건너뜀
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, demo: true });
  }

  // 6) 저장 (의심 건도 기록은 남김)
  try {
    const { error } = await insertLead(
      {
        name: data.name,
        phone: data.phone,
        industry: data.industry || null,
        location: data.location || null,
        budget: data.budget || null,
        message: data.message || null,
        source: data.source || null,
      },
      status
    );

    if (error) {
      console.error("Supabase insert 실패:", error);
      return NextResponse.json(
        { error: "저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "서버 설정 오류입니다. 운영자에게 문의해주세요." },
      { status: 500 }
    );
  }

  // 7) 정상 건만 알림 메일 (의심 건은 저장만, 알림 없음)
  if (status === "정상") {
    await notifyOwner(data);
  }

  return NextResponse.json({ ok: true });
}
