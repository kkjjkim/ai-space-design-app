import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { BlueprintHero } from "@/components/hero/blueprint-hero";
import { CinematicBand } from "@/components/cinematic-band";
import { ConceptCarousel } from "@/components/concept-carousel";
import { VideoBg } from "@/components/video-bg";
import { LeadForm } from "@/components/lead-form";
import { JsonLd } from "@/components/json-ld";
import { faqLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { getAllInsights } from "@/lib/insights";
import { CONCEPTS } from "@/lib/concepts";
import { buttonVariants } from "@/components/ui/button";

// 인사이트 글 수가 예약 발행으로 늘어나므로 주기적으로 다시 만든다.
export const revalidate = 21600;

// 홈 검색 노출용 제목·설명 (화면 히어로 문구와 별개로, 검색 결과에 뜨는 텍스트).
// 주의: 홈은 루트 레이아웃과 같은 단계라 title 템플릿(`%s | 브랜드각`)이 적용되지 않는다.
// 브랜드 검색이 가장 먼저 닿는 페이지라 꼬리표를 직접 붙인다.
export const metadata: Metadata = {
  title: "창업 컨설팅·브랜드 컨설팅·공간 디자인 | 브랜드각",
  description:
    "국가공인 경영지도사가 창업·사업 전략부터 브랜드 컨셉, 공간 디자인·인테리어 시공까지 한 흐름으로 함께합니다. 창업 첫걸음부터 매출까지, 전국 상담.",
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${site.url}/feed.xml` },
  },
};

// FAQ — 실제 서비스 내용에 근거한 문답만. (지어낸 숫자·실적 없음)
// 질문·답변 형식이라 AI 답변엔진이 그대로 인용하기 좋다.
const FAQS = [
  {
    q: "인테리어만 해주나요, 사업·브랜드 컨설팅도 하나요?",
    a: "국가공인 경영지도사의 창업·사업 전략과 업종에 맞는 시공 파트너의 공간 설계·시공을 한 흐름으로 이어 갑니다. 창업 첫걸음부터 매출까지 이어서 함께합니다.",
  },
  {
    q: "상담은 무료인가요?",
    a: "네, 무료 컨셉 상담을 제공합니다. 아직 정리가 안 되셨어도 '이런 가게를 하고 싶다'는 구상만 있으면 신청할 수 있습니다.",
  },
  {
    q: "왜 공사보다 컨셉·브랜드를 먼저 잡나요?",
    a: "컨셉 없이 공사부터 시작하면 큰 돈을 써도 '어디서 본 듯한 가게'가 되기 쉽습니다. 사업·브랜드 방향을 먼저 잡아야 헛돈을 줄이고 더 오래갑니다.",
  },
  {
    q: "어떤 업종을 도와주나요?",
    a: "매장·레스토랑·대형 카페 등 고급 상업 공간을 준비하는 사장님을 돕습니다.",
  },
  {
    q: "어느 지역에서 이용할 수 있나요?",
    a: "전국에서 상담 가능합니다. 창업·브랜드 컨설팅은 전국 어디서나 진행하고, 공간 설계·시공은 현장 지역을 협의해 함께합니다.",
  },
];

// 비교표 (일반 인테리어 업체 vs 우리) — PRD 4)
const COMPARISON = [
  { label: "목적", them: "예쁘게 꾸미기", us: "매출 나는 브랜드 만들기" },
  { label: "방식", them: "기획·설계·시공 따로따로", us: "사업 기획부터 시공·운영까지 한 팀" },
  { label: "근거", them: "디자이너 감각에 의존", us: "업종·손님·동선을 먼저 따진 설계" },
  { label: "사후", them: "시공 끝나면 끝", us: "오픈 후 매출 데이터로 개선" },
];

// 우리 방식 4단계 — PRD 5) (각 단계에 공간 워크스루 영상 배경)
// 영상은 방문자 브라우저가 직접 로드(외부 URL). 영구 보관용은 추후 자체 호스팅 권장.
const STEPS = [
  {
    n: "01",
    t: "사업·브랜드 방향 잡기",
    d: '국가공인 경영지도사가 "되는 장사인지"부터.',
    img: "/concepts/sora.jpg",
    video: "/videos/sora.mp4",
  },
  {
    n: "02",
    t: "철학이 보이는 공간 설계",
    d: '들어선 순간 "여긴 다르다"가 느껴지게.',
    img: "/concepts/cityline.jpg",
    video: "/videos/cityline.mp4",
  },
  {
    n: "03",
    t: "프로젝트에 맞는 시공",
    d: "업종·규모에 맞는 시공 파트너와, 기획 의도 그대로.",
    // 완성 매장이 실제 시공작처럼 보이지 않도록, 시공 과정(도면·자재) 느낌 이미지 + 영상 제거
    img: "/insights/interior-quote-guide.png",
    video: "",
  },
  {
    n: "04",
    t: "오픈 후 매출까지",
    d: "오픈 후 매출을 같이 보며 계속 손봅니다.",
    img: "/concepts/plate.jpg",
    video: "/videos/plate.mp4",
  },
];

// 신청 후 진행 — 신청 폼 옆에 둔다.
const APPLY_STEPS = [
  "남겨주신 연락처로 연락드려 업종·자리·예산·일정을 듣습니다.",
  "지금 단계에서 먼저 할 일과 아껴야 할 지출을 정리해 드립니다.",
  "그다음 진행은 그때 정하셔도 됩니다. 상담만 받으셔도 괜찮습니다.",
];

// 증거 — 실제 시공 사례가 아직 없으니, 방문자가 지금 바로 확인할 수 있는 사실만 쓴다.
// (이전 파트너의 백화점·명품 시공 실적·특허·면허 문구는 10/6 대표 결정으로 전부 뺐다)
const PROOFS = [
  {
    t: "국가공인 경영지도사",
    d: "중소벤처기업부에 등록된 국가자격입니다. 공사 이야기 전에, 되는 장사인지부터 봅니다.",
    href: "/company",
    cta: "어떻게 일하는지",
  },
  {
    t: "생각을 먼저 공개합니다",
    d: "", // 글 수는 빌드 시점에 센다
    href: "/insights",
    cta: "인사이트 읽기",
  },
  {
    t: "컨셉을 먼저 보여드립니다",
    d: "", // 컨셉 수는 데이터에서 센다
    href: "/concepts",
    cta: "컨셉 제안 보기",
  },
];

export default function HomePage() {
  const insightCount = getAllInsights().length;
  return (
    <>
      {/* 1) 히어로 */}
      <BlueprintHero />

      {/* 2) 공감 */}
      <Section>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold leading-snug md:text-4xl">
            큰 돈 들어가는데, 평범한 가게가 될까 봐 두렵지&nbsp;않으세요?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/70">
            가게 하나 차리는 데 적은 돈이 들지 않죠. 막상 열고 보면 “어디서 본 듯한
            가게”가 됩니다. 예쁘게는 했는데 손님이 한 번 오고 다시 안 와요. 업체 말은
            다 비슷하고요.
          </p>
        </Reveal>
      </Section>

      {/* 3) 진짜 문제 — 풀블리드 시네마틱 밴드 */}
      <CinematicBand
        src="/concepts/noir.jpg"
        title="망하는 진짜 이유는, 컨셉 없이 공사부터 시작해서입니다."
        body={'예쁜 인테리어는 기본이에요. "여긴 왜 와야 하지?"가 없으면 돈을 써도 그냥 또 하나의 가게예요. 그래서 공사보다 사업·브랜드부터 잡습니다.'}
        caption="WHY CONCEPT FIRST"
        align="left"
      />

      {/* 4) 왜 우리가 다른가 — 비교표 */}
      <Section tone="muted">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">
            꾸미는 곳과, 매출을 만드는 곳의 차이
          </h2>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
          {/* 일반 인테리어 업체 — 흐리게 */}
          <Reveal className="rounded-2xl border border-border bg-secondary/50 p-8">
            <p className="mb-7 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              일반 인테리어 업체
            </p>
            <ul className="space-y-6">
              {COMPARISON.map((row) => (
                <li key={row.label} className="flex gap-3.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-foreground/40">
                    <X className="h-3 w-3" />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      {row.label}
                    </div>
                    <div className="mt-1 text-foreground/70">{row.them}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* 우리 — 다크 프리미엄 카드 */}
          <Reveal
            delay={120}
            className="relative rounded-2xl bg-foreground p-8 text-background shadow-xl shadow-foreground/10 ring-1 ring-primary/25"
          >
            <p className="mb-7 text-sm font-semibold uppercase tracking-[0.15em] text-primary">
              우리
            </p>
            <ul className="space-y-6">
              {COMPARISON.map((row) => (
                <li key={row.label} className="flex gap-3.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/25 text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-background/50">
                      {row.label}
                    </div>
                    <div className="mt-1 font-medium">{row.us}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* 5) 우리 방식 — 이미지 타일 4단계 */}
      <Section>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">
            사업의 첫걸음부터 매출까지, 이렇게 함께합니다.
          </h2>
          <p className="mt-4 text-sm font-medium text-foreground/60">
            이미지는 실제 시공 사례가 아닌 컨셉·분위기 예시입니다.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <Reveal
              key={s.n}
              delay={i * 80}
              className="group relative isolate overflow-hidden rounded-lg text-background"
            >
              {s.video ? (
                <VideoBg
                  src={s.video}
                  poster={s.img}
                  className="absolute inset-0 -z-10 h-full w-full object-cover"
                />
              ) : (
                // 시공 과정 느낌의 정적 이미지 (영상 없음)
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.img}
                  alt={s.t}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 -z-10 h-full w-full object-cover"
                />
              )}
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/45 to-black/15"
              />
              <div className="flex aspect-[16/10] flex-col justify-end p-7">
                <span className="text-3xl font-extrabold text-primary">{s.n}</span>
                <h3 className="mt-3 text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-background/85">
                  {s.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 5.5) 컨셉 제안 (실제 시공 사례 아님) */}
      <Section id="concepts" tone="muted">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">
            당신의 생각과 가치가, 공간이 되는 방식
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/70">
            “이런 브랜드를 하고 싶다”가 공간으로 어떻게 풀리는지, 업종별 컨셉으로
            보여드립니다.
          </p>
          <p className="mt-2 text-sm font-medium text-foreground/60">
            ※ 아래는 실제 시공 사례가 아닌, 방향을 보여주는 <b>컨셉 제안 예시</b>입니다.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 max-w-5xl">
          <ConceptCarousel />
        </div>

        <div className="mt-10 text-center">
          <Link href="/concepts" className={buttonVariants({ variant: "outline" })}>
            컨셉 제안 전체 보기
          </Link>
        </div>
      </Section>

      {/* 6) 증거 (신뢰) — "업체 말은 다 비슷하다"는 의심에, 말 대신 확인 가능한 것으로 답한다 */}
      <Section>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">
            업체 말은 다 비슷하니까, 먼저 확인하세요.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/70">
            상담 전에 저희가 어떻게 생각하고 일하는지 전부 열어 두었습니다.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          {PROOFS.map((p, i) => (
            <Reveal
              key={p.t}
              delay={i * 80}
              className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm"
            >
              <span className="text-sm font-semibold tracking-[0.2em] text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-semibold leading-snug">{p.t}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {p.d ||
                  (p.href === "/insights"
                    ? `창업·인테리어 인사이트 ${insightCount}편과 1분 컨셉 진단을 무료로 열어 두었습니다. 읽어보고 맞다 싶을 때 연락 주세요.`
                    : `업종별 컨셉 제안 ${CONCEPTS.length}가지로, "이런 가게 하고 싶다"가 공간으로 어떻게 풀리는지 미리 보실 수 있습니다.`)}
              </p>
              <Link
                href={p.href}
                className="mt-5 text-sm font-medium text-primary hover:underline"
              >
                {p.cta} →
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 7) 컨셉이 곧 좋은 인테리어의 시작 — 풀블리드 시네마틱 밴드.
          "컨설팅은 추가 비용이 아니라"처럼 부정하면 오히려 비용을 먼저 떠올리게 해서 바꿨다(10/6 대표 지적) */}
      <CinematicBand
        src="/concepts/ember.jpg"
        title="인테리어를 잘하는 첫 단계는, 무엇을 팔 가게인지 정하는 것입니다."
        body={
          <>
            정말 비싼 건, 큰 돈 들여 만든 평범한 가게예요.
            <br />
            방향을 먼저 잡으면 헛돈을 줄이고 더 오래갑니다.
          </>
        }
        caption="DESIGN STARTS WITH DIRECTION"
        align="right"
        minH="min-h-[70vh]"
      />

      {/* 7.5) 자주 묻는 질문 (FAQ) — 검색·AI 답변 노출용 */}
      <Section>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">자주 묻는 질문</h2>
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
            <h2 className="text-3xl font-semibold md:text-4xl">
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
