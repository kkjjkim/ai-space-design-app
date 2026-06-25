import type { Metadata } from "next";
import { ImageIcon } from "lucide-react";
import { Section, Eyebrow } from "@/components/section";
import { CtaSection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "포트폴리오",
  description: "대형 백화점과 글로벌 명품 매장을 시공한 실력입니다.",
};

// 업종 필터 — PRD: 리테일 / F&B / 명품·뷰티
const FILTERS = ["전체", "리테일", "F&B", "명품·뷰티"] as const;

export default function PortfolioPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Portfolio</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">우리가 만든 공간</h1>
          <p className="mt-5 text-lg text-foreground/70">
            대형 백화점과 글로벌 명품 매장을 시공한 실력입니다.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            공개 가능 여부 확인 전까지 “글로벌 명품 매장”, “대형 백화점”으로 표기합니다.
          </p>
        </div>

        {/* 업종 필터 (사진·내용은 운영자가 넣음) */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f, i) => (
            <span
              key={f}
              className={
                "rounded-full border px-4 py-2 text-sm " +
                (i === 0
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground/70")
              }
            >
              {f}
            </span>
          ))}
        </div>

        {/* 프로젝트 카드 그리드 — 실사진 자리 */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <div className="flex aspect-[4/3] items-center justify-center bg-muted text-muted-foreground">
                <ImageIcon className="h-8 w-8" />
              </div>
              <div className="p-5">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="mt-2 h-3 w-1/3 rounded bg-muted" />
                <p className="mt-3 text-xs text-muted-foreground">
                  프로젝트 사진·내용은 운영자가 입력합니다.
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
