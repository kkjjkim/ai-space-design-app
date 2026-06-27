import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/page-hero";
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
      <PageHero
        image="/concepts/sodam.jpg"
        eyebrow="Company"
        title="왜 믿을 수 있나요?"
        subtitle="“공간 너머 브랜드 가치를 디자인한다.”"
      />

      <Section>
        <Reveal className="mx-auto mt-2 grid max-w-4xl gap-4 sm:grid-cols-2">
          {TRUST.map((t) => (
            <div
              key={t}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <ShieldCheck className="h-6 w-6 shrink-0 text-primary" />
              <p className="font-medium text-foreground">{t}</p>
            </div>
          ))}
        </Reveal>

        {/* 대표·팀 — 상세는 운영자가 채움 */}
        <Reveal className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-xl border border-border">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-[240px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/concepts/ember.jpg"
                alt="대표·팀"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="bg-secondary/40 p-8">
              <h2 className="text-2xl font-bold">대표 · 팀</h2>
              <p className="mt-4 leading-relaxed text-foreground/75">
                디자인 전공 출신, 업계 경력 {site.stats.years}년.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                대표·팀 상세 소개는 운영자가 입력합니다.
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      <CtaSection />
    </>
  );
}
