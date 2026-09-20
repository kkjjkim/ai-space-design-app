import type { AnswerBlock } from "@/lib/answers";

// 질문·답 페이지의 본문 블록 렌더러.
// 표·번호 목록처럼 구조가 뚜렷한 형식만 쓴다 — 사람도 훑기 쉽고,
// 답변 엔진도 이런 형식을 잘라서 인용한다.
// 표는 2열로 고정한다. 모바일에서 3열 이상은 깨진다.
export function AnswerBlocks({ blocks }: { blocks: AnswerBlock[] }) {
  return (
    <div className="mt-6 grid gap-6">
      {blocks.map((block, i) => {
        if (block.type === "text") {
          return (
            <p key={i} className="leading-[1.85] text-foreground/80">
              {block.body}
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={i} className="grid gap-3">
              {block.items.map((item, n) => (
                <li key={n} className="flex gap-3 leading-relaxed">
                  <span
                    aria-hidden
                    className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  />
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "steps") {
          return (
            <ol key={i} className="grid gap-4">
              {block.items.map((item, n) => (
                <li key={n} className="flex gap-4 leading-relaxed">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/50 text-xs font-semibold text-primary">
                    {n + 1}
                  </span>
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  {block.head.map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-sm font-semibold sm:px-5"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map(([k, v]) => (
                  <tr key={k} className="border-b border-border last:border-0">
                    <th
                      scope="row"
                      className="w-[30%] px-4 py-4 align-top text-sm font-medium sm:px-5"
                    >
                      {k}
                    </th>
                    <td className="px-4 py-4 align-top text-sm leading-relaxed text-foreground/80 sm:px-5">
                      {v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
