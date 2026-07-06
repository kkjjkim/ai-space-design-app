import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 최근 상담 신청(익명·마스킹) 목록 — 방문자 소셜 프루프 토스트용.
// 민감 정보는 DB 함수(recent_leads_masked)가 애초에 반환하지 않는다.
export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ items: [] });

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.rpc("recent_leads_masked", {
      max_rows: 12,
    });
    if (error || !Array.isArray(data)) return NextResponse.json({ items: [] });

    const items = data.map((r: Record<string, unknown>) => ({
      name: String(r.masked_name ?? "고객님"),
      industry: r.industry ? String(r.industry) : "",
      at: String(r.created_at ?? ""),
    }));
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
