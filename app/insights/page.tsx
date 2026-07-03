import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { getAllInsights } from "@/lib/insights";

export const metadata: Metadata = {
  title: "인사이트",
  description:
    "창업·브랜드·공간 디자인·인테리어에 관한 실전 인사이트. 매장·카페·레스토랑 창업을 준비하는 사장님을 위한 가이드.",
};

export default function InsightsPage() {
  const posts = getAllInsights();

  return (
    <>
      <PageHero
        image="/concepts/mellow.jpg"
        eyebrow="Insights"
        title="장사가 되는 공간의 원리"
        subtitle="창업·브랜드·공간 디자인·인테리어. 현장에서 통한 이야기를 나눕니다."
      />

      <Section>
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">
            첫 글을 준비 중입니다.
          </p>
        ) : (
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 80}>
                <Link
                  href={`/insights/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.cover}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {p.category}
                    </span>
                    <h2 className="mt-3 text-lg font-bold leading-snug text-foreground">
                      {p.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-foreground/70">
                      {p.description}
                    </p>
                    <span className="mt-4 text-sm font-medium text-foreground/60 group-hover:text-primary">
                      읽어보기 →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <CtaSection />
    </>
  );
}
