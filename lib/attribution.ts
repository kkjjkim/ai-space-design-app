// 방문자의 "유입 출처"를 첫 방문 기준으로 잡아 문자열로 만든다.
// 광고 링크의 UTM 파라미터, 유입 리퍼러(어느 사이트에서 왔는지), 랜딩 경로를 기록해
// 각 상담 신청이 "어디서 왔는지"를 Supabase leads.source 에 남긴다.
const KEY = "lead_source";

export function captureSource() {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(KEY)) return; // 첫 방문(첫 터치)만 저장

    const p = new URLSearchParams(window.location.search);
    const parts: string[] = [];

    for (const k of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ]) {
      const v = p.get(k);
      if (v) parts.push(`${k.replace("utm_", "")}=${v}`);
    }
    if (p.get("gclid")) parts.push("google_ads");
    if (p.get("fbclid")) parts.push("meta_ads");

    if (parts.length === 0) {
      const ref = document.referrer;
      if (ref) {
        try {
          parts.push(`ref=${new URL(ref).hostname}`);
        } catch {
          /* ignore */
        }
      } else {
        parts.push("direct");
      }
    }
    parts.push(`landing=${window.location.pathname}`);
    sessionStorage.setItem(KEY, parts.join(" | ").slice(0, 200));
  } catch {
    /* sessionStorage 불가 환경은 조용히 무시 */
  }
}

export function readSource(): string {
  if (typeof window === "undefined") return "";
  try {
    return (
      sessionStorage.getItem(KEY) || window.location.search.slice(0, 200) || ""
    );
  } catch {
    return "";
  }
}
