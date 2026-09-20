import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/section";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd, faqLd, itemListLd } from "@/lib/seo";
import { ANSWERS, getAnswersByCategory } from "@/lib/answers";

export const metadata: Metadata = {
  title: "창업·인테리어 질문과 답",
  description:
    "권리금 계산, 창업 자금 배분, 인테리어 평당 단가, 음식점 인허가 순서 등 창업 준비에서 가장 많이 묻는 질문에 국가공인 경영지도사와 시공 팀이 답합니다.",
  keywords: [
    "권리금 계산",
    "창업 자금",
    "인테리어 평당 단가",
    "음식점 인허가",
    "상가 계약 주의사항",
    "상권분석",
    "창업 질문",
  ],
  alternates: { canonical: "/answers" },
};

export default function AnswersPage() {
  const groups = getAnswersByCategory();

  return (
    <>
      {/* 목록 페이지는 FAQPage — 질문과 짧은 답이 한 화면에 모여 있다.
          개별 페이지는 QAPage 로 따로 붙는다. */}
      <JsonLd
        data={faqLd(ANSWERS.map((a) => ({ q: a.question, a: a.shortAnswer })))}
      />
      <JsonLd
        data={itemListLd(
          "창업·인테리어 질문과 답",
          ANSWERS.map((a) => ({
            name: a.question,
            path: `/answers/${a.slug}`,
          }))
        )}
      />
      <JsonLd data={breadcrumbLd([{ name: "질문과 답", path: "/answers" }])} />

      <PageHero
        image="/concepts/sodam.jpg"
        eyebrow="Q&A"
        title="창업 준비에서 가장 많이 묻는 질문"
        subtitle="권리금, 자금, 견적, 인허가. 검색해도 답이 안 나오는 질문을 국가공인 경영지도사와 시공 팀의 기준으로 정리했습니다."
      />

      <Section>
        <div className="mx-auto max-w-2xl">
          <p className="leading-[1.85] text-foreground/80">
            금액을 지어내지 않습니다. 창업 비용과 권리금은 자리·업종·건물 상태에
            따라 갈리기 때문에, 하나의 숫자로 답하면 틀립니다. 대신 무엇을 어떤
            순서로 확인하면 내 숫자가 나오는지를 적었습니다.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl grid gap-16">
          {groups.map((group) => (
            <div key={group.category}>
              <Eyebrow>{group.category}</Eyebrow>
              <ul className="mt-6 grid gap-4">
                {group.answers.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/answers/${a.slug}`}
                      className="group block rounded-xl border border-border bg-card px-5 py-5 transition-colors hover:border-primary hover:bg-primary/5 sm:px-6"
                    >
                      <h2 className="font-serif text-lg leading-snug group-hover:text-primary md:text-xl">
                        {a.question}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {a.shortAnswer}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-2xl rounded-xl border border-border bg-secondary/40 px-6 py-6">
          <p className="leading-relaxed text-foreground/80">
            찾는 질문이 없으신가요? 상담 신청에 질문을 그대로 적어 보내주시면
            답변해 드리고, 많이 들어오는 질문은 이 페이지에 추가합니다.
          </p>
          <Link
            href="/#apply"
            className="mt-4 inline-flex items-center gap-2 font-medium text-primary underline-offset-4 hover:underline"
          >
            질문 보내기 →
          </Link>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
