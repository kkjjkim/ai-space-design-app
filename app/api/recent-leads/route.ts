import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";
// 모든 페이지 방문마다 불리므로 캐시 없이 두면 방문 수만큼 함수 실행·DB 조회가 쌓인다.
// 10분 캐시 — 새 신청은 최대 10분 늦게 보일 뿐이다.
export const revalidate = 600;

function json(items: unknown[]) {
  return NextResponse.json({ items });
}

// 업종은 손님이 직접 적는 자유 입력이라 테스트·스팸으로 엉뚱한 값이 섞인다
// (예: 인테리어 상담에 "Technology"). 한글이 없는 값은 라벨로 쓰지 않고 비운다.
// 신청 건 자체는 그대로 노출한다 — "OO님이 상담을 신청했어요"로 표시된다.
const HAS_KOREAN = /[가-힣]/;
// 점검용 신청(이름·업종에 "테스트"/"test", 이름이 "["로 시작)은 손님에게 보이지 않게 뺀다.
// 운영 폼을 실제로 눌러 점검하는 일이 있어서다(10/8 Aside 점검 신청).
const TEST_MARK = /테스트|test/i;
function isTestLead(r: Record<string, unknown>): boolean {
  const name = String(r.masked_name ?? "");
  return TEST_MARK.test(name) || name.startsWith("[") || TEST_MARK.test(String(r.industry ?? ""));
}

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

    // 최근 30일 안의 신청만 쓴다. 오래된 신청을 날짜 없이 돌리면 "지금 신청이 들어오는 중"처럼 보여
    // 사실과 다른 소셜 프루프가 된다(10/6 확인: 7월의 테스트·스팸 4건이 석 달째 돌고 있었다).
    const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const items = data
      .filter((r: Record<string, unknown>) => Date.parse(String(r.created_at ?? "")) >= since)
      .filter((r: Record<string, unknown>) => !isTestLead(r))
      .map((r: Record<string, unknown>) => ({
      name: String(r.masked_name ?? "고객님"),
      industry: industryLabel(r.industry),
      at: String(r.created_at ?? ""),
    }));
    return json(items);
  } catch {
    return json([]);
  }
}
