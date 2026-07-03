import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import { Section } from "@/components/section";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { articleLd } from "@/lib/seo";
import { getAllInsights, getInsight } from "@/lib/insights";

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
          dangerouslySetInnerHTML={{ __html: html }}
        />

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
    </>
  );
}
