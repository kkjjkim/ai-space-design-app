import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Supabase 무료 플랜은 7일간 DB 활동이 없으면 프로젝트를 자동 정지한다.
// 그러면 상담 폼 저장이 전부 실패한다(가치잇다가 7월에 이걸로 전면 다운됐다).
// vercel.json 크론이 매일 이 주소를 불러 가벼운 조회를 한 번 일으킨다.
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, reason: "supabase-env-missing" });
  }
  try {
    const { error } = await getSupabaseServerClient().rpc("recent_leads_masked", {
      max_rows: 1,
    });
    return NextResponse.json(
      { ok: !error },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
