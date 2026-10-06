// GA4 이벤트 한 줄 헬퍼. gtag 가 없으면(측정 ID 없음·차단) 조용히 넘어간다.
// 개인정보(이름·연락처)는 절대 넣지 않는다 — 업종·단계 같은 선택값만.
//
// 고객 여정 이벤트 (GA4 탐색 '퍼널'에서 이 순서로 본다):
//   cta_click → diagnosis_start → diagnosis_step → diagnosis_complete
//   → form_start → form_submit → (form_error) → generate_lead(/complete)
type Params = Record<string, string | number | undefined>;

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", event, { page_path: window.location.pathname, ...params });
}
