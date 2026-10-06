import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { QUESTIONS } from "@/lib/diagnosis";

// 인사이트 글 본문 중간에 끼우는 진단 진입점.
// 검색으로 들어온 사람은 글 끝까지 안 읽고 나간다 — 맨 끝 CTA 하나로는 신청이 안 나왔다.
// 문구는 /diagnosis 페이지 것을 그대로 쓴다.
export function InsightDiagnosisCard() {
  return (
    <aside className="mx-auto my-12 max-w-2xl rounded-lg border border-border bg-secondary/40 p-6 md:p-8">
      <p className="text-lg font-semibold leading-snug">
        지금 뭐부터 해야 하는지 알려드립니다
      </p>
      <p className="mt-2 text-sm text-foreground/70">
        {QUESTIONS.length}가지만 고르면 됩니다. 1분이면 끝납니다.
      </p>
      <Link
        href="/diagnosis"
        className={buttonVariants({ className: "mt-5" })}
        data-cta="insight_mid_diagnosis"
      >
        내 가게 컨셉 진단
      </Link>
    </aside>
  );
}
