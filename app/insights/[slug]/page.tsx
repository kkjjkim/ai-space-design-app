import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import { Section } from "@/components/section";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { InsightDiagnosisCard } from "@/components/insight-diagnosis-card";
import { ReadTracker } from "@/components/read-tracker";
import { JsonLd } from "@/components/json-ld";
import { articleLd, breadcrumbLd } from "@/lib/seo";
import { getAllInsights, getInsight } from "@/lib/insights";

// 예약 글이 날짜가 되면 나타나도록 6시간마다 다시 만든다.
export const revalidate = 21600;

// 빌드 시 모든 글을 정적 생성 (빠르고 SEO 유리).
export function generateStaticParams() {
  return getAllInsights().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getInsight(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      images: [{ url: post.cover }],
    },
  };
}

export default function InsightPage({ params }: { params: { slug: string } }) {
  const post = getInsight(params.slug);
  if (!post) notFound();

  const html = marked.parse(post.content) as string;
  // 두 번째 소제목 앞에서 본문을 나눠 진단 카드를 끼운다(첫 단락만 읽고 나가는 사람도 보게).
  // 소제목이 두 개 미만인 짧은 글은 본문 뒤에 둔다.
  const h2s = [...html.matchAll(/<h2[\s>]/g)];
  const cut = h2s.length >= 2 ? h2s[1].index ?? html.length : html.length;
  const htmlTop = html.slice(0, cut);
  const htmlRest = html.slice(cut);

  return (
    <>
      <PageHero
        image={post.cover}
        eyebrow={post.category}
        title={post.title}
        subtitle={post.description}
      />

      <Section>
        <article
          className="prose-insight mx-auto max-w-2xl"
          dangerouslySetInnerHTML={{ __html: htmlTop }}
        />
        <InsightDiagnosisCard />
        {htmlRest && (
          <article
            className="prose-insight mx-auto max-w-2xl"
            dangerouslySetInnerHTML={{ __html: htmlRest }}
          />
        )}
        <ReadTracker slug={post.slug} />

        <div className="mx-auto mt-14 max-w-2xl border-t border-border pt-8">
          <Link
            href="/insights"
            className="text-sm font-medium text-foreground/60 hover:text-primary"
          >
            ← 인사이트 전체 보기
          </Link>
        </div>
      </Section>

      <CtaSection />

      <JsonLd
        data={articleLd({
          slug: post.slug,
          title: post.title,
          description: post.description,
          cover: post.cover,
          date: post.date,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "인사이트", path: "/insights" },
          { name: post.title, path: `/insights/${post.slug}` },
        ])}
      />
    </>
  );
}
