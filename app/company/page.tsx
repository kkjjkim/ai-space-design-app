import type { Metadata } from "next";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "회사·신뢰",
  description: "공간 너머 브랜드 가치를 디자인한다.",
};

// 핵심 지표 — 지어내지 않은 사실만. (업계 경력 10년+ / 소셜벤처 확인 / 시공 이력)
const FACTS = [
  { value: "10년+", label: "디자인드비 업계 경력" },
  { value: "소셜벤처", label: "확인 기업" },
  { value: "백화점·명품", label: "매장 시공 팀" },
];

// 신뢰 근거 — PRD 회사·신뢰
const TRUST = [
  {
    title: "공간 최적화 시스템 특허 출원",
    desc: "고객 동선·체류시간을 데이터로 설계합니다.",
  },
  {
    title: "정부 인정 R&D 전담부서",
    desc: "감(感)이 아니라 연구로 공간을 검증합니다.",
  },
  {
    title: "실내건축공사업 면허",
    desc: "정식 면허를 갖춘 팀이 직접 시공합니다.",
  },
  {
    title: "사업자·납세 투명성",
    desc: "믿고 맡길 수 있게, 투명하게 운영합니다.",
  },
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
        {/* 핵심 지표 — 말보다 사실로 */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold leading-snug md:text-4xl">
            말보다, 쌓아온 것으로 증명합니다.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/70">
            공간 브랜딩·시공을 맡는 (주)디자인드비는 업계 경력 10년 이상.
            <br />
            거기에 국가공인 경영지도사의 사업 전략이 한 팀으로 더해집니다.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {FACTS.map((f, i) => (
            <Reveal
              key={f.label}
              delay={i * 80}
              className="rounded-2xl border border-border bg-card p-7 text-center shadow-sm"
            >
              <div className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
                {f.value}
              </div>
              <div className="mt-2 text-sm leading-snug text-muted-foreground">
                {f.label}
              </div>
            </Reveal>
          ))}
        </div>

        {/* 신뢰 근거 — 얇은 구분선의 에디토리얼 그리드 */}
        <Reveal className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-2xl border border-border bg-border">
          <div className="grid gap-px sm:grid-cols-2">
            {TRUST.map((t, i) => (
              <div
                key={t.title}
                className="group bg-card p-8 transition-colors hover:bg-secondary/30"
              >
                <span className="text-sm font-semibold tracking-[0.2em] text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground">
                  {t.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* 대표·팀 — 사실 기반, 프리미엄 블록 */}
        <Reveal className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-2xl border border-border">
          <div className="grid md:grid-cols-5">
            <div className="relative min-h-[280px] md:col-span-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/concepts/ember.jpg"
                alt="대표 · 팀"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r"
              />
            </div>
            <div className="bg-foreground p-8 text-background md:col-span-3 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                People
              </p>
              <h2 className="mt-4 text-2xl font-bold md:text-[1.75rem]">
                검증된 사람들이 만듭니다.
              </h2>
              <p className="mt-5 leading-relaxed text-background/85">
                팀에는 디자인 전공자와 업계 경력 10년 이상의 설계·시공 전문가가
                다수 함께합니다. 백화점·명품 매장을 만들던 실력을, 이제 당신의
                매장에 씁니다.
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      <CtaSection />
    </>
  );
}
