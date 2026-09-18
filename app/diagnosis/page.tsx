import type { Metadata } from "next";
import { Section } from "@/components/section";
import { PageHero } from "@/components/page-hero";
import { JsonLd } from "@/components/json-ld";
import { DiagnosisWizard } from "@/components/diagnosis-wizard";
import { breadcrumbLd, faqLd } from "@/lib/seo";
import { getAllInsights } from "@/lib/insights";
import { QUESTIONS } from "@/lib/diagnosis";

// 검색 의도가 "업체 찾기"가 아니라 "내가 뭘 해야 하지"인 사람을 받는 페이지.
// 인사이트 글은 읽고 나가지만, 도구는 입력하고 결과를 받으려 남는다.
export const metadata: Metadata = {
  title: "내 가게 컨셉 진단 — 지금 뭐부터 해야 하는지 1분 만에",
  description:
    "업종·단계·규모·타깃만 고르면 지금 단계에서 먼저 해야 할 일과 조심할 것을 알려드립니다. 창업 준비 순서가 막막할 때 1분이면 됩니다.",
  keywords: [
    "가게 컨셉",
    "매장 컨셉 잡기",
    "창업 준비 순서",
    "창업 진단",
    "매장 창업 체크",
    "인테리어 준비",
  ],
  alternates: { canonical: "/diagnosis" },
  openGraph: {
    title: "내 가게 컨셉 진단 — 지금 뭐부터 해야 하는지 1분 만에",
    description:
      "업종·단계·규모·타깃만 고르면 지금 먼저 해야 할 일과 조심할 것을 알려드립니다.",
    type: "website",
  },
};

// 진단 도구 자체에 대한 문답 — AI 답변엔진이 그대로 인용하기 좋은 포맷.
const FAQS = [
  {
    q: "컨셉 진단은 무료인가요?",
    a: "네, 무료입니다. 연락처를 남기지 않아도 결과를 모두 보실 수 있습니다.",
  },
  {
    q: "견적을 내주는 건가요?",
    a: "아닙니다. 금액을 계산해 드리는 도구가 아니라, 지금 단계에서 무엇을 먼저 해야 하고 무엇을 조심해야 하는지 알려드리는 진단입니다.",
  },
  {
    q: "아직 자리도 안 봤는데 해도 되나요?",
    a: "구상만 있는 단계가 오히려 가장 도움이 됩니다. 자리를 보기 전에 컨셉을 먼저 잡아야 자리에 컨셉을 끼워 맞추는 실수를 피할 수 있습니다.",
  },
  {
    q: "이미 영업 중인데 써도 되나요?",
    a: "네. 리뉴얼을 고민하는 단계를 고르시면 공사가 답인지부터 가리는 기준을 알려드립니다.",
  },
];

export default function DiagnosisPage() {
  // 진단 결과에서 이어 읽을 글을 붙이기 위해 목록만 넘긴다 (본문 제외).
  const posts = getAllInsights().map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
  }));

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "컨셉 진단", path: "/diagnosis" }])} />
      <JsonLd data={faqLd(FAQS)} />

      <PageHero
        image="/concepts/nest.jpg"
        eyebrow="무료 컨셉 진단"
        title="지금 뭐부터 해야 하는지 알려드립니다"
        subtitle={`${QUESTIONS.length}가지만 고르면 됩니다. 1분이면 끝납니다.`}
      />

      <Section>
        <DiagnosisWizard posts={posts} />
      </Section>
    </>
  );
}
