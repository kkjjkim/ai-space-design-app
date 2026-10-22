// 글 머리 "핵심 정리" 상자. 질문에 바로 답하는 3~4줄을 글 맨 앞에 두면
// 검색엔진·AI 답변엔진이 이 부분을 그대로 인용하기 쉽고, 바쁜 손님도 답부터 본다.
export function InsightKeyPoints({ points }: { points: string[] }) {
  if (points.length === 0) return null;
  return (
    <aside
      aria-label="핵심 정리"
      className="mx-auto mb-10 max-w-2xl rounded-xl border border-primary/30 bg-secondary/40 px-6 py-5"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        핵심 정리
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[1.0625rem] leading-relaxed text-foreground/85">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </aside>
  );
}
