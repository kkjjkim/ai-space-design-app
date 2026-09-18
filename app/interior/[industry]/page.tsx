import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Section, Eyebrow } from "@/components/section";
import { PageHero } from "@/components/page-hero";
import { JsonLd } from "@/components/json-ld";
import { LeadForm } from "@/components/lead-form";
import { breadcrumbLd, faqLd } from "@/lib/seo";
import { INDUSTRIES, getIndustry } from "@/lib/industries";
import { getAllInsights } from "@/lib/insights";
import { CONCEPTS } from "@/lib/concepts";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ industry: i.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { industry: string };
}): Metadata {
  const ind = getIndustry(params.industry);
  if (!ind) return {};
  // 검색어를 타이틀 맨 앞에 둔다 — 네이버 웹사이트 컬렉션이 정확한 문구로 잡는다.
  return {
    title: `${ind.keyword} — ${ind.headline}`,
    description: ind.lead,
    keywords: ind.keywords,
    alternates: { canonical: `/interior/${ind.slug}` },
    openGraph: {
      title: `${ind.keyword} | ${site.brandNameKo}`,
      description: ind.lead,
      type: "website",
      images: [{ url: ind.image }],
    },
  };
}

export default function IndustryPage({
  params,
}: {
  params: { industry: string };
}) {
  const ind = getIndustry(params.industry);
  if (!ind) notFound();

  const posts = getAllInsights();
  const reads = ind.insightSlugs
    .map((s) => posts.find((p) => p.slug === s))
    .filter(Boolean);
  const concepts = ind.conceptSlugs
    .map((s) => CONCEPTS.find((c) => c.slug === s))
    .filter(Boolean);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: ind.keyword, path: `/interior/${ind.slug}` },
        ])}
      />
      <JsonLd data={faqLd(ind.faqs)} />

      <PageHero
        image={ind.image}
        eyebrow={ind.keyword}
        title={ind.headline}
        subtitle={ind.lead}
      />

      {/* 이 업종에서 공간이 하는 일 */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <Eyebrow>이 업종의 원리</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl leading-snug md:text-4xl">
            {ind.shortName}에서 공간이 하는 일
          </h2>

          <div className="mt-12 grid gap-10">
            {ind.principle.map((p, i) => (
              <div key={i} className="border-l-2 border-primary/40 pl-6 md:pl-8">
                <h3 className="font-serif text-xl md:text-2xl">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 자주 나오는 실수 */}
      <Section tone="muted">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-2xl leading-snug md:text-3xl">
            이 업종에서 자주 나오는 실수
          </h2>
          <ul className="mt-8 grid gap-5">
            {ind.mistakes.map((m, i) => (
              <li key={i} className="flex gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span className="leading-relaxed">{m}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-muted-foreground">
            전부 공사가 끝난 뒤에는 고치기 어렵거나, 고치려면 다시 뜯어야 하는
            것들입니다. 도면 단계에서 짚으면 비용이 들지 않습니다.
          </p>
        </div>
      </Section>

      {/* 우리 방식 */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <Eyebrow>브랜드각이 하는 방식</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl leading-snug md:text-4xl">
            공사보다 먼저, 되는 장사인지부터
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            국가공인 경영지도사가 사업·브랜드 방향을 먼저 잡고, 백화점·명품 매장을
            시공한 파트너 팀이 공간을 만듭니다. 컨설팅 따로 시공 따로가 아니라 한
            팀으로 이어집니다.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            컨셉 없이 공사부터 시작하면 큰 돈을 써도 어디서 본 듯한 가게가 되기
            쉽습니다. 먼저 방향을 잡아야 헛돈을 줄이고 더 오래갑니다.
          </p>

          <div className="mt-10">
            <Link
              href="/diagnosis"
              className="inline-flex items-center gap-2 font-medium text-primary underline-offset-4 hover:underline"
            >
              1분 컨셉 진단으로 지금 단계부터 확인해보기 →
            </Link>
          </div>
        </div>
      </Section>

      {/* 컨셉 예시 */}
      {concepts.length > 0 && (
        <Section tone="muted">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-2xl leading-snug md:text-3xl">
              이 업종의 컨셉 예시
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              실제 시공 사례가 아니라 브랜드 방향을 보여주는 컨셉 예시입니다.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {concepts.map((c) => (
                <li key={c!.slug}>
                  <Link
                    href={`/concepts#${c!.slug}`}
                    className="block rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    <span className="block font-medium">{c!.name}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {c!.type}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* 이어 읽을 글 */}
      {reads.length > 0 && (
        <Section>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-2xl leading-snug md:text-3xl">
              먼저 읽어두면 좋은 글
            </h2>
            <ul className="mt-8 grid gap-6">
              {reads.map((p) => (
                <li key={p!.slug}>
                  <Link href={`/insights/${p!.slug}`} className="group block">
                    <span className="font-medium underline-offset-4 group-hover:text-primary group-hover:underline">
                      {p!.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {p!.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* 자주 묻는 질문 */}
      <Section tone="muted">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-2xl leading-snug md:text-3xl">
            자주 묻는 질문
          </h2>
          <dl className="mt-8 grid gap-8">
            {ind.faqs.map((f, i) => (
              <div key={i}>
                <dt className="font-medium">{f.q}</dt>
                <dd className="mt-2 leading-relaxed text-muted-foreground">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* 상담 — 업종은 이미 채워둔다 */}
      <Section id="apply">
        <div className="mx-auto max-w-2xl">
          <Eyebrow>무료 상담</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl leading-snug md:text-4xl">
            {ind.keyword}, 도면 전에 같이 보시죠
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            아직 정리가 안 되셨어도 괜찮습니다. &ldquo;이런 가게를 하고
            싶다&rdquo;는 구상만 있으면 됩니다.
          </p>

          <div className="mt-10">
            <LeadForm defaults={{ industry: ind.formIndustry }} />
          </div>
        </div>
      </Section>
    </>
  );
}
