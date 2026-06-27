import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "서비스",
  description: "사업의 뇌 + 공간의 뇌. 창업 첫걸음부터 매출까지, 끊김 없이.",
};

const PILLARS = [
  {
    name: "국가공인 경영지도사",
    desc: "창업·사업 기획·자금·경영 전략",
    image: "/concepts/cityline.jpg",
  },
  {
    name: "디자인드비",
    desc: "공간 브랜딩·프리미엄 시공·데이터 운영",
    image: "/concepts/daon.jpg",
  },
];

export default function ServicePage() {
  return (
    <>
      <PageHero
        image="/concepts/nest.jpg"
        eyebrow="Service"
        title="사업의 뇌 + 공간의 뇌"
        subtitle="창업·경영 전략과 공간 브랜딩이 한 팀으로 움직입니다."
      />

      <Section>
        <div className="mx-auto grid max-w-5xl items-stretch gap-6 md:grid-cols-[1fr_auto_1fr]">
          <Reveal>
            <PillarCard {...PILLARS[0]} />
          </Reveal>

          {/* + 기호 (가운데) */}
          <div className="flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              <Plus className="h-6 w-6" />
            </span>
          </div>

          <Reveal delay={120}>
            <PillarCard {...PILLARS[1]} />
          </Reveal>
        </div>

        <Reveal>
          <p className="mx-auto mt-12 max-w-2xl text-center text-2xl font-bold leading-snug md:text-3xl">
            “창업 첫걸음부터 매출까지, 끊김 없이.”
          </p>
        </Reveal>
      </Section>

      <CtaSection />
    </>
  );
}

function PillarCard({
  name,
  desc,
  image,
}: {
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
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/40 to-black/10"
      />
      <div className="p-8">
        <h2 className="text-2xl font-bold">{name}</h2>
        <p className="mt-3 leading-relaxed text-background/85">{desc}</p>
      </div>
    </div>
  );
}
