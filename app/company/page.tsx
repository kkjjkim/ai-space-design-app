import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/section";
import { CtaSection } from "@/components/cta-section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "회사·신뢰",
  description: "공간 너머 브랜드 가치를 디자인한다.",
};

// 신뢰 카드 — PRD 회사·신뢰
const TRUST = [
  "공간 최적화 시스템 특허 출원",
  "정부 인정 R&D 전담부서",
  "실내건축공사업 면허",
  "사업자·납세 투명성",
];

export default function CompanyPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Company</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
            왜 믿을 수 있나요?
          </h1>
          <blockquote className="mt-8 text-2xl font-semibold leading-snug text-foreground md:text-3xl">
            “공간 너머 브랜드 가치를 디자인한다.”
          </blockquote>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-2">
          {TRUST.map((t) => (
            <div
              key={t}
              className="rounded-lg border border-border bg-card p-6 text-center shadow-sm"
            >
              <p className="font-medium text-foreground">{t}</p>
            </div>
          ))}
        </div>

        {/* 대표·팀 — 상세는 운영자가 채움 */}
        <div className="mx-auto mt-12 max-w-3xl rounded-lg border border-border bg-secondary/40 p-8 text-center">
          <h2 className="text-xl font-semibold">대표 · 팀</h2>
          <p className="mt-3 text-foreground/70">
            디자인 전공 출신, 업계 경력 {site.stats.years}년.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            대표·팀 상세 소개는 운영자가 입력합니다.
          </p>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
