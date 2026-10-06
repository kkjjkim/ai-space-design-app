import type { Metadata } from "next";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/page-hero";
import { getAllInsights } from "@/lib/insights";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd } from "@/lib/seo";

// 인사이트 글 수가 예약 발행으로 늘어나므로 주기적으로 다시 만든다.
export const revalidate = 21600;

export const metadata: Metadata = {
  title: "회사·신뢰",
  description: "공간 너머 브랜드 가치를 디자인한다.",
  alternates: { canonical: "/company" },
};

// 핵심 지표 — 방문자가 지금 확인할 수 있는 사실만.
// (이전 시공 파트너의 경력·소셜벤처·백화점 시공·특허·면허 문구는 10/6 대표 결정으로 뺐다)
function facts(insightCount: number) {
  return [
    { value: "국가공인", label: "경영지도사가 직접 봅니다" },
    { value: `${insightCount}편`, label: "공개한 창업·인테리어 인사이트" },
    { value: "0원", label: "상담·컨셉 진단 비용" },
  ];
}

// 일하는 원칙 — 약속할 수 있는 것만.
const TRUST = [
  {
    title: "공사 전에 사업부터",
    desc: "업종·자리·예산이 되는 장사인지부터 봅니다. 공사는 그다음입니다.",
  },
  {
    title: "프로젝트마다 맞는 시공 파트너",
    desc: "업종·규모·지역에 맞는 파트너를 매번 직접 고르고, 기획한 사람이 끝까지 챙깁니다.",
  },
  {
    title: "업종마다 기준이 다릅니다",
    desc: "카페·베이커리·미용실·레스토랑·리테일은 먼저 따질 것이 다릅니다. 업종에 맞춰 봅니다.",
  },
  {
    title: "사업자 정보 공개",
    desc: "사업자 정보와 연락처를 화면 아래에 공개합니다. 누가 하는지 알고 맡기실 수 있게.",
  },
];

export default function CompanyPage() {
  const FACTS = facts(getAllInsights().length);
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "회사·신뢰", path: "/company" }])} />

      <PageHero
        image="/concepts/sodam.jpg"
        eyebrow="Company"
        title="왜 믿을 수 있나요?"
        subtitle="“공간 너머 브랜드 가치를 디자인한다.”"
      />

      <Section>
        {/* 핵심 지표 — 말보다 사실로 */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold leading-snug md:text-4xl">
            말보다, 확인할 수 있는 것으로.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/70">
            국가공인 경영지도사가 사업 계획부터 공간·시공까지 한 흐름으로 봅니다.
            <br />
            어떻게 생각하는지는 인사이트와 컨셉 진단에 전부 열어 두었습니다.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {FACTS.map((f, i) => (
            <Reveal
              key={f.label}
              delay={i * 80}
              className="rounded-2xl border border-border bg-card p-7 text-center shadow-sm"
            >
              <div className="text-2xl font-extrabold tracking-tight text-primary md:text-3xl">
                {f.value}
              </div>
              <div className="mt-2 text-sm leading-snug text-muted-foreground">
                {f.label}
              </div>
            </Reveal>
          ))}
        </div>

        {/* 신뢰 근거 — 얇은 구분선의 에디토리얼 그리드 */}
        <Reveal className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-2xl border border-border bg-border">
          <div className="grid gap-px sm:grid-cols-2">
            {TRUST.map((t, i) => (
              <div
                key={t.title}
                className="group bg-card p-8 transition-colors hover:bg-secondary/30"
              >
                <span className="text-sm font-semibold tracking-[0.2em] text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground">
                  {t.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* 대표·팀 — 사실 기반, 프리미엄 블록 */}
        <Reveal className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-2xl border border-border">
          <div className="grid md:grid-cols-5">
            <div className="relative min-h-[280px] md:col-span-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/concepts/ember.jpg"
                alt="컨셉 예시 공간"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r"
              />
            </div>
            <div className="bg-foreground p-8 text-background md:col-span-3 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                People
              </p>
              <h2 className="mt-4 text-2xl font-bold md:text-[1.75rem]">
                상담한 사람이 끝까지 봅니다.
              </h2>
              <p className="mt-5 leading-relaxed text-background/85">
                처음 이야기를 듣는 사람과 방향을 잡는 사람이 같습니다. 국가공인
                경영지도사가 사업 계획부터 공간·시공 과정까지 챙기고, 시공은
                프로젝트에 맞는 파트너와 함께합니다.
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      <CtaSection />
    </>
  );
}
