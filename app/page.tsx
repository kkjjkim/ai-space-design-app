import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Section, Eyebrow } from "@/components/section";
import { SiteHero } from "@/components/site-hero";
import { CinematicBand } from "@/components/cinematic-band";
import { MediaFrame } from "@/components/media-frame";
import { PortfolioSlider } from "@/components/portfolio-slider";
import { ConceptCard } from "@/components/concept-card";
import { LeadForm } from "@/components/lead-form";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";
import { CONCEPTS } from "@/lib/concepts";

// 비교표 (일반 인테리어 업체 vs 우리) — PRD 4)
const COMPARISON = [
  { label: "목적", them: "예쁘게 꾸미기", us: "매출 나는 브랜드 만들기" },
  { label: "방식", them: "기획·설계·시공 따로따로", us: "사업 기획부터 시공·운영까지 한 팀" },
  { label: "근거", them: "디자이너 감각에 의존", us: "고객 동선·체류시간 데이터 기반(특허 출원)" },
  { label: "사후", them: "시공 끝나면 끝", us: "오픈 후 매출 데이터로 개선" },
];

// 우리 방식 4단계 — PRD 5)
const STEPS = [
  { n: "01", t: "사업·브랜드 방향 잡기", d: '국가공인 경영지도사가 "되는 장사인지"부터.' },
  { n: "02", t: "철학이 보이는 공간 설계", d: '들어선 순간 "여긴 다르다"가 느껴지게.' },
  { n: "03", t: "검증된 프리미엄 시공", d: "백화점·명품 매장을 시공한 팀이 그대로 구현." },
  { n: "04", t: "오픈 후 매출까지", d: "동선·체류시간 데이터로 계속 개선." },
];

const BADGES = [
  "공간 최적화 특허 출원",
  "정부 인정 R&D 전담부서",
  "실내건축공사업 면허 보유",
];

export default function HomePage() {
  return (
    <>
      {/* 1) 히어로 — 시네마틱 풀블리드 영상 */}
      <SiteHero />

      {/* 2) 공감 — 강한 한 문장 */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>공감</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold leading-snug md:text-4xl">
            큰 돈 들어가는데, 평범한 가게가 될까 봐 두렵지 않으세요?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/70">
            가게 하나 차리는 데 적은 돈이 들지 않죠. 막상 열고 보면 “어디서 본 듯한
            가게”가 됩니다. 예쁘게는 했는데 손님이 한 번 오고 다시 안 와요. 업체 말은
            다 비슷하고요.
          </p>
        </div>
      </Section>

      {/* 3) 진짜 문제 — 풀블리드 시네마틱 밴드 */}
      <CinematicBand
        eyebrow="진짜 문제"
        title="망하는 진짜 이유는, 컨셉 없이 공사부터 시작해서입니다."
        body='예쁜 인테리어는 기본이에요. "여긴 왜 와야 하지?"가 없으면 돈을 써도 그냥 또 하나의 가게예요. 그래서 공사보다 사업·브랜드부터 잡습니다.'
        caption="WHY CONCEPT FIRST"
        align="left"
      />

      {/* 4) 왜 우리가 다른가 — 비교표 */}
      <Section tone="muted">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>왜 우리가 다른가</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            꾸미는 곳과, 매출을 만드는 곳의 차이
          </h2>
        </div>
        <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-lg border border-border bg-card">
          <div className="grid grid-cols-[88px_1fr_1fr] border-b border-border bg-secondary/60 text-sm font-medium md:grid-cols-[120px_1fr_1fr]">
            <div className="px-4 py-3" />
            <div className="px-4 py-3 text-muted-foreground">일반 인테리어 업체</div>
            <div className="px-4 py-3 text-primary">우리</div>
          </div>
          {COMPARISON.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[88px_1fr_1fr] border-b border-border last:border-0 md:grid-cols-[120px_1fr_1fr]"
            >
              <div className="bg-secondary/40 px-4 py-4 text-sm font-medium text-foreground/80">
                {row.label}
              </div>
              <div className="flex items-start gap-2 px-4 py-4 text-sm text-muted-foreground">
                <Minus className="mt-0.5 h-4 w-4 shrink-0" />
                {row.them}
              </div>
              <div className="flex items-start gap-2 px-4 py-4 text-sm font-medium text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {row.us}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 5) 우리 방식 — 이미지 타일 4단계 */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>우리 방식</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            사업의 첫걸음부터 매출까지, 이렇게 함께합니다.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="group relative isolate overflow-hidden rounded-lg text-background"
            >
              {/* 이미지/폴백 */}
              <div aria-hidden className="absolute inset-0 -z-10 bg-foreground">
                <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_80%_0%,rgba(166,128,63,0.25),transparent_55%)]" />
              </div>
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-black/10"
              />
              <div className="flex aspect-[16/10] flex-col justify-end p-7">
                <span className="font-serif text-3xl text-primary">{s.n}</span>
                <h3 className="mt-3 text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-background/80">
                  {s.d}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
          관광단지 안 대형 카페를 ‘도산서원’ 컨셉으로 — 한옥의 결을 살린 공간에
          한국식 빵과 차. 공간·메뉴·이름이 하나의 이야기로 묶이자 일부러 찾아오는
          곳이 됐습니다.
        </p>
      </Section>

      {/* 5.5) 컨셉 제안 — 브랜드가 공간이 되는 방식 (실제 시공 사례 아님) */}
      <Section id="concepts" tone="muted">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>컨셉 제안</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            당신의 생각과 가치가, 공간이 되는 방식
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/70">
            “이런 브랜드를 하고 싶다”가 공간으로 어떻게 풀리는지, 업종별 컨셉으로
            보여드립니다.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            ※ 아래는 실제 시공 사례가 아닌, 방향을 보여주는 <b>컨셉 제안 예시</b>입니다.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CONCEPTS.map((c) => (
            <ConceptCard key={c.slug} concept={c} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/concepts" className={buttonVariants({ variant: "outline" })}>
            컨셉 제안 전체 보기
          </Link>
        </div>
      </Section>

      {/* 6) 증거 (신뢰) + 포트폴리오 */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>증거</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            대형 백화점과 글로벌 명품 매장을 만들던 팀입니다.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/70">
            까다로운 대형 유통사와 명품 브랜드가 믿고 맡긴 실력을, 이제 당신의
            매장에 씁니다.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
          {BADGES.map((b) => (
            <span
              key={b}
              className="rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary"
            >
              {b}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
          <span>완공 {site.stats.completed}곳</span>
          <span className="text-border">·</span>
          <span>업계 경력 {site.stats.years}년</span>
          <span className="text-border">·</span>
          <span>{site.stats.highlight}</span>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <PortfolioSlider aspect="aspect-[16/9]" />
          <div className="mt-8 text-center">
            <Link
              href="/portfolio"
              className={buttonVariants({ variant: "outline" })}
            >
              포트폴리오 더 보기
            </Link>
          </div>
        </div>
      </Section>

      {/* 7) 가격 뒤집기 — 풀블리드 시네마틱 밴드 */}
      <CinematicBand
        eyebrow="가격에 대하여"
        title="컨설팅은 ‘추가 비용’이 아니라, 망하지 않으려는 첫 단계입니다."
        body="정말 비싼 건, 큰 돈 들여 만든 평범한 가게예요. 방향을 먼저 잡으면 헛돈을 줄이고 더 오래갑니다."
        caption="INVEST IN DIRECTION"
        align="right"
        minH="min-h-[70vh]"
      />

      {/* 8) 신청 (폼) */}
      <Section id="apply" tone="muted">
        <div className="mx-auto grid max-w-5xl items-start gap-12 lg:grid-cols-2">
          <div className="lg:sticky lg:top-28">
            <Eyebrow>무료 컨셉 상담</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
              머릿속 구상만 들고 오세요.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-foreground/70">
              아직 정리 안 되셨어도 괜찮습니다. “이런 가게 하고 싶다” 한마디면
              시작이에요. 무료고, 1분이면 됩니다.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
            <LeadForm />
          </div>
        </div>
      </Section>
    </>
  );
}
