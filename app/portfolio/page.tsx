import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/section";
import { CtaSection } from "@/components/cta-section";
import { MediaFrame } from "@/components/media-frame";
import { PROJECTS } from "@/lib/portfolio";

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
          {PROJECTS.map((p, i) => (
            <div key={i} className="group">
              <MediaFrame
                src={p.image}
                kind="real"
                ratio="aspect-[4/3]"
                alt={p.name}
                label="실사진 자리 — 운영자가 넣습니다 (로고 없는 컷)"
              />
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <p className="truncate text-sm font-medium text-foreground">
                  {p.name}
                </p>
                {p.category && (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {p.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
