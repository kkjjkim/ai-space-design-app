import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// 캐시 없이 항상 최신을 반환 (새 신청이 바로 반영되도록)
function json(items: unknown[]) {
  return NextResponse.json(
    { items },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

// 업종은 손님이 직접 적는 자유 입력이라 테스트·스팸으로 엉뚱한 값이 섞인다
// (예: 인테리어 상담에 "Technology"). 한글이 없는 값은 라벨로 쓰지 않고 비운다.
// 신청 건 자체는 그대로 노출한다 — "OO님이 상담을 신청했어요"로 표시된다.
const HAS_KOREAN = /[가-힣]/;
function industryLabel(v: unknown): string {
  const s = v ? String(v).trim() : "";
  return HAS_KOREAN.test(s) ? s : "";
}

// 최근 상담 신청(익명·마스킹) 목록 — 방문자 소셜 프루프 토스트용.
// 민감 정보는 DB 함수(recent_leads_masked)가 애초에 반환하지 않는다.
export async function GET() {
  if (!isSupabaseConfigured()) return json([]);

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.rpc("recent_leads_masked", {
      max_rows: 12,
    });
    if (error || !Array.isArray(data)) return json([]);

    const items = data.map((r: Record<string, unknown>) => ({
      name: String(r.masked_name ?? "고객님"),
      industry: industryLabel(r.industry),
      at: String(r.created_at ?? ""),
    }));
    return json(items);
  } catch {
    return json([]);
  }
}
