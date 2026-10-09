import type { Metadata } from "next";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { BlueprintHero } from "@/components/hero/blueprint-hero";
import { Manifesto } from "@/components/home/manifesto";
import { SquareUp } from "@/components/home/square-up";
import { TwoExperts } from "@/components/home/two-experts";
import { ProcessFlow } from "@/components/home/process-flow";
import { ConceptBoards } from "@/components/home/concept-boards";
import { Promises } from "@/components/home/promises";
import { LeadForm } from "@/components/lead-form";
import { JsonLd } from "@/components/json-ld";
import { faqLd } from "@/lib/seo";
import { site } from "@/lib/site";

// 인사이트 글 수가 예약 발행으로 늘어나므로 주기적으로 다시 만든다.
export const revalidate = 21600;

// 홈 검색 노출용 제목·설명 (화면 히어로 문구와 별개로, 검색 결과에 뜨는 텍스트).
// 주의: 홈은 루트 레이아웃과 같은 단계라 title 템플릿(`%s | 브랜드각`)이 적용되지 않는다.
// 브랜드 검색이 가장 먼저 닿는 페이지라 꼬리표를 직접 붙인다.
export const metadata: Metadata = {
  title: "창업 컨설팅·브랜드 컨설팅·공간 디자인 | 브랜드각",
  description:
    "국가공인 경영지도사가 창업·사업 전략부터 브랜드 컨셉, 공간 디자인·인테리어 시공까지 한 흐름으로 함께합니다. 창업 첫걸음부터 오픈까지, 전국 상담.",
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${site.url}/feed.xml` },
  },
};

// FAQ — 실제 서비스 내용에 근거한 문답만. (지어낸 숫자·실적 없음)
// 질문·답변 형식이라 AI 답변엔진이 그대로 인용하기 좋다.
// 비용 방식은 2026-10-09 대표 확인(서면 견적 + 공정 단계별 분할, 퍼센트는 쓰지 않음).
const FAQS = [
  {
    q: "비용은 어떻게 정해지고, 어떻게 내나요?",
    a: "상담과 컨셉 진단은 무료입니다. 진행이 정해지면 범위와 금액을 서면 견적으로 드리고, 대금은 공정 단계에 맞춰 착수금·중도금·잔금(또는 착수금·잔금)으로 나눠 받습니다. 단계별 금액은 계약 전에 공정표와 함께 정합니다.",
  },
  {
    q: "누가 맡아서 하나요?",
    a: "사업·브랜드는 국가공인 경영지도사가, 공간 설계와 시공은 백화점·대형 쇼핑몰 브랜드 매장을 시공해 온 팀이 맡습니다. 두 전문가가 처음부터 같이 결정해 기획 의도가 현장까지 이어집니다.",
  },
  {
    q: "상담만 받아도 되나요?",
    a: "네. 상담에서 지금 단계에 먼저 할 일과 아껴야 할 지출을 정리해 드리고, 진행 여부는 그다음에 정하시면 됩니다. 영업 전화는 하지 않습니다.",
  },
  {
    q: "이미 자리를 계약했는데도 도움이 되나요?",
    a: "네. 계약 뒤에도 컨셉, 예산 배분, 동선, 전기·가스·배기 같은 설비 확인처럼 공사 전에 정해야 할 것이 많습니다. 지금 단계에서 할 수 있는 것부터 같이 봅니다.",
  },
  {
    q: "왜 공사보다 컨셉·브랜드를 먼저 잡나요?",
    a: "컨셉 없이 공사부터 시작하면 큰돈을 써도 '어디서 본 듯한 가게'가 되기 쉽습니다. 자리·예산·컨셉·동선을 먼저 맞춰야 헛돈을 줄이고 오래갑니다.",
  },
  {
    q: "어떤 업종, 어느 지역을 도와주나요?",
    a: "카페·베이커리·레스토랑·미용실·편집숍 등 매장을 준비하는 사장님을 돕습니다. 상담은 전국 어디서나 가능하고, 공간 설계·시공은 현장 지역을 협의해 진행합니다.",
  },
];

// 신청 후 진행 — 신청 폼 옆에 둔다.
const APPLY_STEPS = [
  "남겨주신 연락처로 연락드려 업종·자리·예산·일정을 듣습니다.",
  "지금 단계에서 먼저 할 일과 아껴야 할 지출을 정리해 드립니다.",
  "그다음 진행은 그때 정하셔도 됩니다. 상담만 받으셔도 괜찮습니다.",
];

export default function HomePage() {
  return (
    <>
      {/* 1) 첫 화면 — 도면이 가게가 된다 */}
      <BlueprintHero />
      {/* 2) 왜 공사 전인가 */}
      <Manifesto />
      {/* 3) 각 잡기 — 공사 전에 정할 7가지 */}
      <SquareUp />
      {/* 4) 한 테이블, 두 전문가 */}
      <TwoExperts />
      {/* 5) 진행 순서와 받는 결과물 */}
      <ProcessFlow />
      {/* 6) 업종별 컨셉 보드 */}
      <ConceptBoards />
      {/* 7) 약속 */}
      <Promises />

      {/* 7.5) 자주 묻는 질문 (FAQ) — 검색·AI 답변 노출용 */}
      <Section>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-[1.9rem] font-semibold tracking-[-0.02em] sm:text-[2.6rem]">자주 묻는 질문</h2>
        </Reveal>
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-foreground">
                  {f.q}
                  <span className="shrink-0 text-primary transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-foreground/70">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FAQ 구조화 데이터 (AI 답변엔진 인용용) */}
      <JsonLd data={faqLd(FAQS.map((f) => ({ q: f.q, a: f.a })))} />

      {/* 8) 신청 (폼) */}
      <Section id="apply" tone="muted">
        <div className="mx-auto grid max-w-5xl items-start gap-12 lg:grid-cols-2">
          <Reveal className="lg:sticky lg:top-28">
            <h2 className="font-display text-[1.9rem] font-semibold leading-[1.3] tracking-[-0.02em] sm:text-[2.6rem]">
              머릿속 구상만 들고 오세요.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-foreground/70">
              아직 정리 안 되셨어도 괜찮습니다.
              <br />
              “이런 가게 하고 싶다” 한마디면 시작이에요.
            </p>

            {/* 신청 뒤에 무슨 일이 생기는지 모르면 안 남긴다 — 다음 단계와 부담 없음을 먼저 말한다 */}
            <ol className="mt-10 space-y-5">
              {APPLY_STEPS.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-foreground/80">{step}</span>
                </li>
              ))}
            </ol>

            <p className="mt-10 text-foreground/70">
              전화가 편하시면{" "}
              <a
                href={`tel:${site.business.phone}`}
                className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                {site.business.phone}
              </a>
            </p>
          </Reveal>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
            <LeadForm />
          </div>
        </div>
      </Section>
    </>
  );
}
