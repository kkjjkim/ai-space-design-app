import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/section";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { InsightList } from "@/components/insight-list";
import { JsonLd } from "@/components/json-ld";
import { blogLd, breadcrumbLd } from "@/lib/seo";
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
      <JsonLd data={blogLd(posts)} />
      <JsonLd data={breadcrumbLd([{ name: "인사이트", path: "/insights" }])} />

      <PageHero
        image="/concepts/mellow.jpg"
        eyebrow="Insights"
        title="장사가 되는 공간의 원리"
        subtitle="창업·브랜드·공간 디자인·인테리어. 현장에서 통한 이야기를 나눕니다."
      />

      <Section>
        {/* 글을 읽으러 온 분과 답을 찾으러 온 분은 다르다. 질문으로 찾는 입구를 위에 둔다. */}
        <div className="mx-auto mb-14 max-w-2xl rounded-xl border border-border bg-secondary/40 px-6 py-6">
          <p className="leading-relaxed text-foreground/80">
            궁금한 게 정해져 있으시면 질문으로 바로 찾으실 수 있습니다. 권리금
            계산, 창업 자금 배분, 인테리어 평당 단가, 음식점 인허가 순서 등을
            한 줄 답으로 정리해 뒀습니다.
          </p>
          <Link
            href="/answers"
            className="mt-4 inline-flex items-center gap-2 font-medium text-primary underline-offset-4 hover:underline"
          >
            질문과 답 보기 →
          </Link>
        </div>

        <InsightList posts={posts} />
      </Section>

      <CtaSection />
    </>
  );
}
