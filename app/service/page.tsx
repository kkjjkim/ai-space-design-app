import type { Metadata } from "next";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd } from "@/lib/seo";
import Link from "next/link";
import { INDUSTRIES } from "@/lib/industries";

export const metadata: Metadata = {
  title: "서비스",
  description:
    "창업 컨설팅 · 브랜드 컨설팅 · 공간 디자인. 창업 첫걸음부터 매출까지, 한 팀으로.",
};

// 세 가지 색깔을 또렷하게: 창업 / 브랜드 / 공간.
// 국가공인 경영지도사(사업·브랜드) + 검증된 시공 파트너(공간)가 한 팀으로 이어서 만든다.
// 시공 파트너는 프로젝트마다 운영자가 선정하므로, 특정 업체명을 화면에 노출하지 않는다.
const SERVICES = [
  {
    eyebrow: "Consulting",
    name: "창업 컨설팅",
    desc: "국가공인 경영지도사가 “되는 장사인지”부터. 사업 기획·자금·운영 전략을 먼저 잡습니다.",
    image: "/concepts/cityline.jpg",
  },
  {
    eyebrow: "Branding",
    name: "브랜드 컨설팅",
    desc: "“왜 꼭 여기 와야 하지?” 손님을 부르는 브랜드 컨셉과 방향을 만듭니다.",
    image: "/concepts/daon.jpg",
  },
  {
    eyebrow: "Space Design",
    name: "공간 디자인·시공",
    desc: "컨셉을 공간으로. 백화점·명품 매장을 시공한 파트너 팀이 프리미엄으로 설계·시공합니다.",
    image: "/concepts/plate.jpg",
  },
];

export default function ServicePage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "서비스", path: "/service" }])} />

      <PageHero
        image="/concepts/nest.jpg"
        eyebrow="Service"
        title="사업의 뇌 + 공간의 뇌"
        subtitle="창업·브랜드 전략과 공간 디자인이 한 팀으로 움직입니다."
      />

      <Section>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold leading-snug md:text-4xl">
            창업부터 매출까지, 세 가지가 한 팀으로.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/70">
            따로 맡기면 방향이 흩어집니다. 창업 전략·브랜드·공간을 한 팀이
            <br />
            끊김 없이 이어서 만듭니다.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.name} delay={i * 100}>
              <ServiceCard {...s} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mx-auto mt-14 max-w-3xl text-center text-2xl font-bold leading-snug md:text-3xl">
            “창업 첫걸음부터 매출까지, 최고의 브랜드, 최고의 공간으로 태어납니다.”
          </p>
        </Reveal>
      </Section>

      {/* 업종별 상세 — 검색에서 "미용실 인테리어"처럼 좁은 조합으로 들어오는 사람이
          바로 자기 업종 페이지로 가게 한다. 크롤러가 랜딩을 찾아가는 길이기도 하다. */}
      <Section tone="muted">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-2xl leading-snug md:text-3xl">
            업종별로 더 자세히
          </h2>
          <p className="mt-3 text-muted-foreground">
            업종마다 공간이 해야 하는 일이 다릅니다. 준비 중인 업종을 골라보세요.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {INDUSTRIES.map((i) => (
              <li key={i.slug}>
                <Link
                  href={`/interior/${i.slug}`}
                  className="block rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <span className="block font-medium">{i.keyword}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {i.headline}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}

function ServiceCard({
  eyebrow,
  name,
  desc,
  image,
}: {
  eyebrow: string;
  name: string;
  desc: string;
  image: string;
}) {
  return (
    <div className="group relative isolate flex aspect-[4/5] h-full flex-col justify-end overflow-hidden rounded-xl text-background">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={name}
        className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/45 to-black/10"
      />
      <div className="p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-xl font-bold md:text-2xl">{name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-background/85">{desc}</p>
      </div>
    </div>
  );
}
