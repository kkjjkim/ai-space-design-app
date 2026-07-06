import type { Metadata } from "next";
import { Section } from "@/components/section";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { InsightList } from "@/components/insight-list";
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
        <InsightList posts={posts} />
      </Section>

      <CtaSection />
    </>
  );
}
