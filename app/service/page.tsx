import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Section, Eyebrow } from "@/components/section";
import { CtaSection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "서비스",
  description: "사업의 뇌 + 공간의 뇌. 창업 첫걸음부터 매출까지, 끊김 없이.",
};

export default function ServicePage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Service</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
            사업의 뇌 + 공간의 뇌
          </h1>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl items-stretch gap-6 md:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <h2 className="font-serif text-2xl">국가공인 경영지도사</h2>
            <p className="mt-4 leading-relaxed text-foreground/70">
              창업·사업 기획·자금·경영 전략
            </p>
          </div>

          <div className="flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Plus className="h-5 w-5" />
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <h2 className="font-serif text-2xl">디자인드비</h2>
            <p className="mt-4 leading-relaxed text-foreground/70">
              공간 브랜딩·프리미엄 시공·데이터 운영
            </p>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center font-serif text-2xl font-semibold leading-snug md:text-3xl">
          “창업 첫걸음부터 매출까지, 끊김 없이.”
        </p>
      </Section>

      <CtaSection />
    </>
  );
}
