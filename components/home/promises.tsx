// 7) 약속 — "믿어도 되나? 돈은 어떻게?"에 확인 가능한 방식으로 답한다.
// 실적·발주처 이름은 쓰지 않는다(대표 결정). 비용은 퍼센트 없이 방식만(대표 결정 2026-10-09).
import { Reveal } from "@/components/reveal";

const PROMISES = [
  {
    t: "상담은 무료, 영업 전화는 없습니다",
    d: "상담만 받고 끝내셔도 됩니다. 진행 여부는 사장님이 정합니다.",
  },
  {
    t: "범위와 금액은 서면으로 드립니다",
    d: "어디까지 하고 얼마인지 문서로 확인한 뒤에 결정하세요. 말로만 정하지 않습니다.",
  },
  {
    t: "대금은 공정에 맞춰 나눠 받습니다",
    d: "착수금·중도금·잔금처럼 공사가 진행된 만큼만 받습니다. 단계별 금액은 계약 전에 공정표와 함께 정합니다.",
  },
  {
    t: "자격과 기준이 분명한 팀입니다",
    d: "사업은 중소벤처기업부 등록 국가자격인 경영지도사가, 공간은 백화점·대형 쇼핑몰 브랜드 매장을 시공해 온 팀이 맡습니다.",
  },
];

export function Promises() {
  return (
    <section className="bg-secondary/40 py-28 md:py-36">
      <div className="container">
        <div className="max-w-2xl">
          <p className="mb-6 flex items-center gap-3 text-[0.8125rem] font-medium tracking-[0.04em] text-primary">
            <span aria-hidden className="h-px w-8 bg-primary" />
            상담 전에 약속드리는 것
          </p>
          <h2 className="font-display text-[1.9rem] font-semibold leading-[1.3] tracking-[-0.02em] sm:text-[2.8rem]">
            큰돈이 오가는 일이라, 방식부터 투명하게.
          </h2>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {PROMISES.map((p, i) => (
            <Reveal key={p.t} delay={i * 70} className="bg-background p-8 md:p-10">
              <span className="text-xs tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-display text-xl font-semibold leading-snug sm:text-[1.4rem]">{p.t}</h3>
              <p className="mt-3 text-[0.975rem] leading-relaxed text-foreground/70">{p.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
