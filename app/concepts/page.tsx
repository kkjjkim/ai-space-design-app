import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { ConceptBoardSpread } from "@/components/concept-board-spread";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd } from "@/lib/seo";
import { CONCEPT_BOARDS } from "@/lib/concept-boards";
import { CONCEPTS } from "@/lib/concepts";

export const metadata: Metadata = {
  title: "업종별 컨셉 보드 — 카페·베이커리·레스토랑·미용실·편집숍·와인바",
  description:
    "사장님의 고민을 한 문장의 컨셉으로 정리하고, 그 문장을 재료와 동선으로 옮기는 방법을 업종별 컨셉 보드로 보여드립니다.",
  alternates: { canonical: "/concepts" },
};

// 2026-10 개편: 새 컨셉 보드 6개(고민 → 컨셉 문장 → 공간으로 푸는 법 → 키워드·색·재료)를 앞세우고,
// 예전 컨셉 10개는 아래 "더 많은 컨셉"으로 짧게 남긴다(옛 링크 /concepts#slug 가 계속 닿도록 id 유지).
export default function ConceptsPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "컨셉 보드", path: "/concepts" }])} />

      <PageHero
        eyebrow="업종별 컨셉 보드"
        title="같은 고민도, 업종마다 답이 다릅니다."
        subtitle="상담에서는 사장님의 고민을 한 문장의 컨셉으로 정리하고, 그 문장을 재료와 동선으로 옮깁니다. 그 과정을 업종별로 펼쳐 보았습니다."
      />

      <section className="bg-background pb-24 md:pb-32">
        <div className="container space-y-24 md:space-y-32">
          <p className="-mt-6 text-sm text-foreground/50">컨셉 분위기 예시입니다.</p>
          {CONCEPT_BOARDS.map((b, i) => (
            <ConceptBoardSpread key={b.slug} board={b} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="더 많은 컨셉"
          title="그 밖의 컨셉 예시"
          lead="브랜드 철학이 입구·동선·조명·집기로 어떻게 옮겨지는지 짧게 정리했습니다."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CONCEPTS.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 70}>
              <article id={c.slug} className="h-full scroll-mt-28 overflow-hidden rounded-2xl border border-border bg-background">
                {c.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image} alt={`${c.type} 컨셉 분위기 예시`} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                )}
                <div className="p-6">
                  <span className="text-[0.8125rem] text-primary">{c.type}</span>
                  <h3 className="mt-2 font-display text-lg font-semibold">{c.name}</h3>
                  <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-foreground/70">{c.direction}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
