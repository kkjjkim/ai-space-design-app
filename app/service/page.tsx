import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { TwoExperts } from "@/components/home/two-experts";
import { ProcessFlow } from "@/components/home/process-flow";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd } from "@/lib/seo";
import { INDUSTRIES } from "@/lib/industries";

export const metadata: Metadata = {
  title: "서비스 — 창업 컨설팅·브랜드 컨설팅·공간 설계와 시공",
  description:
    "국가공인 경영지도사의 창업·브랜드 컨설팅과, 백화점·대형 쇼핑몰 브랜드 매장을 시공해 온 팀의 공간 설계·시공. 창업 첫걸음부터 오픈까지 한 테이블에서.",
  alternates: { canonical: "/service" },
};

// 세 가지 일 — 무엇을 해주는지 구체적으로(범위). 오픈 후 운영 컨설팅은 별도 계약이라 여기 넣지 않는다.
const SERVICES = [
  {
    n: "01",
    name: "창업 컨설팅",
    who: "국가공인 경영지도사",
    lead: "되는 장사인지부터 숫자로 봅니다.",
    items: ["상권·자리 타당성 검토", "권리금·임대 조건 판단", "예산 배분과 자금 계획 (정책자금 포함)", "사업계획서"],
    image: "/hero/stage-sketch-1280.webp",
  },
  {
    n: "02",
    name: "브랜드 컨설팅",
    who: "국가공인 경영지도사",
    lead: "손님이 찾아올 이유를 한 문장으로 잡습니다.",
    items: ["브랜드 컨셉 한 문장", "이름·상품 구성·가격대", "컨셉 보드 (키워드·색·재료)", "오픈 전 홍보 방향"],
    image: "/concepts/board-select-960.webp",
  },
  {
    n: "03",
    name: "공간 설계·시공",
    who: "백화점·대형 쇼핑몰 브랜드 매장 시공팀",
    lead: "컨셉을 재료와 동선으로 옮겨 짓습니다.",
    items: ["평면·동선·도면 설계", "서면 견적과 공정표", "설비·인허가 협의", "브랜드 매장 기준의 공정·마감 관리"],
    image: "/hero/stage-day-1280.webp",
  },
];

export default function ServicePage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "서비스", path: "/service" }])} />

      <PageHero
        image="/hero/stage-night-1920.webp"
        eyebrow="서비스"
        title="사업과 공간을, 한 테이블에서."
        subtitle="창업 컨설팅과 브랜드 컨설팅은 국가공인 경영지도사가, 공간 설계와 시공은 백화점·대형 쇼핑몰 브랜드 매장을 시공해 온 팀이 맡습니다."
        note="컨셉 분위기 예시입니다."
      />

      <Section>
        <SectionHeading
          eyebrow="하는 일"
          title="세 가지 일을, 끊기지 않게 잇습니다."
          lead="따로 맡기면 기획 의도가 현장에서 바뀝니다. 필요한 것만 맡기셔도 되고, 처음부터 끝까지 맡기셔도 됩니다."
        />
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.name} delay={i * 90} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="flex flex-1 flex-col p-7 md:p-8">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl font-semibold">{s.name}</h3>
                  <span className="text-xs tabular-nums text-primary">{s.n}</span>
                </div>
                <p className="mt-2 text-sm text-foreground/55">{s.who}</p>
                <p className="mt-5 text-foreground/80">{s.lead}</p>
                <ul className="mt-6 space-y-2.5 border-t border-border pt-5">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-center gap-3 text-[0.9375rem] text-foreground/75">
                      <span aria-hidden className="h-1 w-1 rounded-full bg-primary" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <TwoExperts />
      <ProcessFlow />

      {/* 업종별 상세 — "미용실 인테리어"처럼 좁은 검색어로 들어온 사람이 자기 업종으로 바로 가게 한다. */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="업종별로"
          title="업종마다, 공간이 하는 일이 다릅니다."
          lead="준비 중인 업종을 골라보세요. 업종별로 먼저 따져야 할 것과 자주 나오는 실수를 정리했습니다."
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((i) => (
            <li key={i.slug} className="bg-background">
              <Link href={`/interior/${i.slug}`} className="group flex h-full flex-col justify-between p-7 transition-colors hover:bg-secondary/40">
                <span className="font-display text-xl font-semibold">{i.keyword}</span>
                <span className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/65">{i.headline}</span>
                <span className="mt-6 text-sm text-primary transition-transform group-hover:translate-x-1">자세히 →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaSection />
    </>
  );
}
