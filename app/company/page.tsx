import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { Promises } from "@/components/home/promises";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd } from "@/lib/seo";
import { getAllInsights } from "@/lib/insights";
import { site } from "@/lib/site";

// 인사이트 글 수가 예약 발행으로 늘어나므로 주기적으로 다시 만든다.
export const revalidate = 21600;

export const metadata: Metadata = {
  title: "회사 소개 — 가게의 각을 잡는 사람들",
  description:
    "브랜드각은 국가공인 경영지도사와 백화점·대형 쇼핑몰 브랜드 매장을 시공해 온 팀이 함께 일하는 창업·브랜드·공간 컨설팅입니다.",
  alternates: { canonical: "/company" },
};

// 회사 소개 — 실적·발주처 이름은 쓰지 않는다(대표 결정: 클라이언트가 알아보는 실적은 노출하지 않음).
// 신뢰는 이름의 뜻, 팀 구조, 일하는 원칙, 확인 가능한 사실로만 만든다.
const PRINCIPLES = [
  {
    t: "공사 전에 숫자부터",
    d: "자리·예산·객단가가 맞는지 먼저 봅니다. 숫자가 맞지 않으면 공사를 권하지 않습니다.",
  },
  {
    t: "컨셉은 한 문장으로",
    d: "손님이 왜 와야 하는지 한 문장으로 말할 수 없으면, 아직 도면을 그릴 때가 아닙니다.",
  },
  {
    t: "기획한 사람이 현장까지",
    d: "방향을 잡은 사람과 짓는 사람이 처음부터 같은 테이블에 앉아, 의도가 현장에서 바뀌지 않게 합니다.",
  },
  {
    t: "생각을 먼저 공개합니다",
    d: "", // 글 수는 빌드 시점에 센다
  },
];

export default function CompanyPage() {
  const insightCount = getAllInsights().length;
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "회사 소개", path: "/company" }])} />

      <PageHero
        image="/concepts/board-roastery-1600.webp"
        eyebrow="회사 소개"
        title="가게의 각을 잡는 사람들."
        subtitle="'각을 잡는다'는 흐트러진 것을 바로 세운다는 뜻입니다. 브랜드각은 자리·예산·컨셉·공간이 한 방향을 보도록 맞추는 일을 합니다."
        note="컨셉 분위기 예시입니다."
      />

      {/* 팀 */}
      <Section>
        <SectionHeading
          eyebrow="누가 하나요"
          title="사업을 아는 사람과, 공간을 짓는 사람."
          lead="두 전문가가 처음부터 함께 결정합니다. 상담을 받은 사람이 방향을 잡고, 그 방향 그대로 현장이 지어집니다."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-2xl border border-border bg-card p-8 md:p-10">
            <span className="text-[0.8125rem] font-medium tracking-[0.04em] text-primary">사업 · 브랜드</span>
            <h3 className="mt-5 font-display text-2xl font-semibold">국가공인 경영지도사</h3>
            <p className="mt-4 leading-relaxed text-foreground/70">
              경영지도사는 중소벤처기업부에 등록하는 국가자격입니다. 상권·예산·자금 계획부터 브랜드 컨셉까지, 되는 장사인지
              숫자로 먼저 봅니다.
            </p>
          </Reveal>
          <Reveal delay={90} className="rounded-2xl border border-border bg-card p-8 md:p-10">
            <span className="text-[0.8125rem] font-medium tracking-[0.04em] text-primary">공간 · 시공</span>
            <h3 className="mt-5 font-display text-2xl font-semibold">백화점·대형 쇼핑몰 브랜드 매장 시공팀</h3>
            <p className="mt-4 leading-relaxed text-foreground/70">
              까다로운 기준의 브랜드 매장을 지어 온 팀이 설계와 시공을 맡습니다. 공정·마감·일정을 브랜드 매장의 기준으로
              관리합니다.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* 원칙 */}
      <Section tone="muted">
        <SectionHeading eyebrow="일하는 원칙" title="말보다 순서를 지킵니다." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.t} delay={i * 70} className="bg-background p-8 md:p-10">
              <span className="text-xs tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-display text-xl font-semibold sm:text-[1.4rem]">{p.t}</h3>
              <p className="mt-3 text-[0.975rem] leading-relaxed text-foreground/70">
                {p.d ||
                  `창업·인테리어 인사이트 ${insightCount}편과 1분 컨셉 진단을 무료로 열어 두었습니다. 읽어 보고 맞다 싶을 때 연락 주세요.`}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Promises />

      {/* 사업자 정보 — 누가 하는지 알고 맡기실 수 있게 */}
      <Section>
        <SectionHeading eyebrow="사업자 정보" title="누가 하는지 알고 맡기세요." />
        <dl className="mt-10 grid max-w-2xl gap-px overflow-hidden rounded-2xl border border-border bg-border text-[0.975rem] sm:grid-cols-2">
          {[
            ["브랜드", site.brandNameKo],
            ["사업자", site.business.name],
            ["사업자등록번호", site.business.registration],
            ["소재지", site.business.address],
            ["전화", site.business.phone],
            ["상담 지역", "전국 (시공은 현장 지역 협의)"],
          ].map(([k, v]) => (
            <div key={k} className="bg-background px-6 py-5">
              <dt className="text-xs text-foreground/45">{k}</dt>
              <dd className="mt-1.5 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <CtaSection />
    </>
  );
}
