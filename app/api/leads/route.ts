import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/leads";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

// 운영자에게 신규 상담 알림 메일 발송. 실패해도 신청 자체는 성공 처리한다.
async function notifyOwner(lead: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  if (!apiKey || !to) return; // 미설정 시 조용히 건너뜀

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
      subject: `[새 상담 신청] ${lead.name} (${lead.phone})`,
      html: `<h2>새 무료 컨셉 상담 신청</h2><table cellpadding="6">${rows}</table>`,
    });
  } catch (err) {
    console.error("알림 메일 발송 실패:", err);
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.";
    return NextResponse.json({ error: message }, { status: 422 });
  }

  const data = parsed.data;

  // 키가 아직 없으면(데모 모드) 저장은 건너뛰고 흐름만 보여준다.
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("leads").insert({
      name: data.name,
      phone: data.phone,
      industry: data.industry || null,
      location: data.location || null,
      budget: data.budget || null,
      message: data.message || null,
      source: data.source || null,
    });

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

  // 저장 성공 후 알림 (대기하지만 실패해도 무시)
  await notifyOwner(data);

  return NextResponse.json({ ok: true });
}
