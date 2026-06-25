import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/section";
import { CtaSection } from "@/components/cta-section";
import { MediaFrame } from "@/components/media-frame";
import { cn } from "@/lib/utils";
import { CONCEPTS } from "@/lib/concepts";

export const metadata: Metadata = {
  title: "컨셉 제안",
  description:
    "“이런 브랜드를 하고 싶다”가 공간으로 어떻게 풀리는지 보여주는 업종별 컨셉 제안.",
};

export default function ConceptsPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Concepts</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
            당신의 생각과 가치가, 공간이 되는 방식
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-foreground/70">
            대표자의 철학과 사업 의도가 입구·동선·조명·집기로 어떻게 번역되는지를
            업종별 컨셉으로 정리했습니다.
          </p>
          <p className="mt-3 inline-block rounded-full bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
            ※ 실제 시공 사례가 아닌 컨셉 제안 예시입니다.
          </p>
        </div>
      </Section>

      {CONCEPTS.map((c, i) => (
        <section
          key={c.slug}
          id={c.slug}
          className={cn(
            "scroll-mt-24 border-t border-border py-16 md:py-24",
            i % 2 === 1 && "bg-secondary/40"
          )}
        >
          <div className="container">
            <div
              className={cn(
                "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
                i % 2 === 1 && "lg:[&>*:first-child]:order-2"
              )}
            >
              <MediaFrame
                src={c.image}
                ratio="aspect-[4/3]"
                alt={`${c.name} 컨셉 이미지`}
                caption={c.name}
                label={`이미지 자리 · /concepts/${c.slug}.jpg`}
              />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {c.type}
                </p>
                <h2 className="mt-3 font-serif text-3xl font-semibold uppercase tracking-wide md:text-4xl">
                  {c.name}
                </h2>

                <div className="mt-6 space-y-5 text-foreground/75">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      브랜드 방향성
                    </h3>
                    <p className="mt-1.5 leading-relaxed">{c.direction}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      공간디자인 전략
                    </h3>
                    <p className="mt-1.5 leading-relaxed">{c.strategy}</p>
                  </div>
                  {c.intent && (
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        사업적 의도
                      </h3>
                      <p className="mt-1.5 leading-relaxed">{c.intent}</p>
                    </div>
                  )}
                </div>

                <p className="mt-6 border-l-2 border-primary pl-4 font-medium text-foreground">
                  {c.oneLiner}
                </p>
              </div>
            </div>
          </div>
        </section>
      ))}

      <CtaSection />
    </>
  );
}
