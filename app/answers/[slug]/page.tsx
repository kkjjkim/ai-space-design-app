import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/section";
import { PageHero } from "@/components/page-hero";
import { JsonLd } from "@/components/json-ld";
import { LeadForm } from "@/components/lead-form";
import { AnswerBlocks } from "@/components/answer-blocks";
import { breadcrumbLd, qaPageLd } from "@/lib/seo";
import { ANSWERS, answerPlainText, getAnswer } from "@/lib/answers";
import { getAllInsights } from "@/lib/insights";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return ANSWERS.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const answer = getAnswer(params.slug);
  if (!answer) return {};
  // 타이틀을 질문 문장 그대로 둔다 — 사람이 묻는 문장과 페이지 제목이 같아야
  // 답변 엔진이 이 페이지를 그 질문의 답으로 고른다.
  return {
    title: answer.question,
    description: answer.shortAnswer,
    keywords: [...answer.keywords, ...answer.askedAs],
    alternates: { canonical: `/answers/${answer.slug}` },
    openGraph: {
      title: `${answer.question} | ${site.brandNameKo}`,
      description: answer.shortAnswer,
      type: "article",
      images: [{ url: answer.image }],
    },
  };
}

export default function AnswerPage({ params }: { params: { slug: string } }) {
  const answer = getAnswer(params.slug);
  if (!answer) notFound();

  const posts = getAllInsights();
  const reads = answer.insightSlugs
    .map((s) => posts.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const related = answer.relatedSlugs
    .map((s) => ANSWERS.find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <>
      <JsonLd
        data={qaPageLd({
          slug: answer.slug,
          question: answer.question,
          askedAs: answer.askedAs,
          answerText: answerPlainText(answer),
          image: answer.image,
          keywords: answer.keywords,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "질문과 답", path: "/answers" },
          { name: answer.question, path: `/answers/${answer.slug}` },
        ])}
      />

      <PageHero
        image={answer.image}
        eyebrow={answer.category}
        title={answer.question}
      />

      {/* 짧은 답 — 페이지 맨 위, 제목 바로 아래.
          답변 엔진이 잘라 인용하는 부분이라 링크·수식 없이 문장만 둔다. */}
      <Section className="pb-0 md:pb-0">
        <div className="mx-auto max-w-2xl">
          <Eyebrow>짧은 답</Eyebrow>
          <p className="mt-4 border-l-2 border-primary pl-6 font-serif text-xl leading-[1.7] text-foreground md:text-2xl md:leading-[1.7]">
            {answer.shortAnswer}
          </p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            이렇게도 묻습니다 — {answer.askedAs.join(" · ")}
          </p>
        </div>
      </Section>

      {/* 본문 */}
      <Section>
        <div className="mx-auto max-w-2xl">
          {answer.sections.map((section) => (
            <div
              key={section.heading}
              className="mt-14 first:mt-0 scroll-mt-24"
            >
              <h2 className="font-serif text-2xl leading-snug md:text-3xl">
                {section.heading}
              </h2>
              <AnswerBlocks blocks={section.blocks} />
            </div>
          ))}
        </div>
      </Section>

      {/* 우리가 이 질문을 보는 방식 — 여기서만 브랜드를 말한다 */}
      <Section tone="muted">
        <div className="mx-auto max-w-2xl">
          <Eyebrow>브랜드각은 이렇게 봅니다</Eyebrow>
          <p className="mt-4 leading-[1.85] text-foreground/85">
            {answer.ourTake}
          </p>
          <Link
            href="/diagnosis"
            className="mt-6 inline-flex items-center gap-2 font-medium text-primary underline-offset-4 hover:underline"
          >
            1분 컨셉 진단으로 내 단계부터 확인하기 →
          </Link>
        </div>
      </Section>

      {/* 이어 읽을 글 */}
      {reads.length > 0 && (
        <Section>
          <div className="mx-auto max-w-2xl">
            <h2 className="font-serif text-2xl leading-snug md:text-3xl">
              더 자세히 쓴 글
            </h2>
            <ul className="mt-8 grid gap-6">
              {reads.map((p) => (
                <li key={p.slug}>
                  <Link href={`/insights/${p.slug}`} className="group block">
                    <span className="font-medium underline-offset-4 group-hover:text-primary group-hover:underline">
                      {p.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* 함께 묻는 질문 */}
      {related.length > 0 && (
        <Section tone="muted">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-serif text-2xl leading-snug md:text-3xl">
              함께 묻는 질문
            </h2>
            <ul className="mt-8 grid gap-3">
              {related.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/answers/${a.slug}`}
                    className="block rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    <span className="block font-medium">{a.question}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {a.shortAnswer}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/answers"
              className="mt-8 inline-flex text-sm font-medium text-foreground/60 hover:text-primary"
            >
              질문 전체 보기 →
            </Link>
          </div>
        </Section>
      )}

      {/* 상담 — 검색·AI를 타고 처음 들어온 분이라 여기서 바로 신청할 수 있어야 한다.
          문의 내용에 질문을 미리 채워 같은 말을 두 번 쓰지 않게 한다. */}
      <Section id="apply">
        <div className="mx-auto max-w-2xl">
          <Eyebrow>무료 상담</Eyebrow>
          <h2 className="mt-4 font-serif text-3xl leading-snug md:text-4xl">
            내 상황에 맞는 답이 궁금하시면
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            위 내용은 일반적인 기준입니다. 자리·업종·예산이 정해지면 답이
            달라집니다. 상황을 들려주시면 국가공인 경영지도사가 직접 봅니다.
          </p>

          <div className="mt-10">
            <LeadForm
              defaults={{
                message: `[${answer.question}] 관련해서 상담받고 싶습니다.\n\n`,
              }}
            />
          </div>
        </div>
      </Section>
    </>
  );
}
