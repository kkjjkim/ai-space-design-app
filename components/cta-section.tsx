import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

// 서브 페이지 끝마다 두는 신청 진입점 (모든 페이지에 "무료 상담" 진입점).
// 전환 핵심이라 모션으로 숨기지 않고 항상 노출한다.
export function CtaSection() {
  return (
    <section className="border-t border-border bg-foreground text-background">
      <div className="container py-20 text-center md:py-24">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-snug md:text-4xl">
          머릿속 구상만 들고 오세요.
        </h2>
        <p className="mt-5 text-background/70">
          무료고, 1분이면 됩니다. 영업 전화 없음 · 상담 후 결정은 자유.
        </p>
        <Link
          href="/#apply"
          className={buttonVariants({ size: "lg", className: "mt-8" })}
        >
          무료 컨셉 상담받기 · 1분
        </Link>
      </div>
    </section>
  );
}
