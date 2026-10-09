import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { Eyebrow } from "@/components/section";
import { PrintButton } from "./print-button";

// 자료 받기로 여는 페이지 — 창업 예산표 + 오픈 전 체크리스트.
// 연락처를 남긴 사람에게 주는 자료라 검색에는 내보내지 않는다(noindex, 사이트맵 제외).
// 금액·비율은 지어내지 않는다(AGENTS.md 7번) — 칸을 비워 두고 채우는 법만 안내한다.
export const metadata: Metadata = {
  title: "창업 예산표·오픈 전 체크리스트",
  robots: { index: false, follow: false },
};

const BUDGET = [
  {
    group: "자리",
    rows: [
      ["보증금", "돌려받는 돈이지만 오픈 자금에서 먼저 묶입니다"],
      ["권리금", "시설·영업·바닥 권리금을 나눠 적습니다"],
      ["중개 수수료·계약 비용", ""],
    ],
  },
  {
    group: "공간",
    rows: [
      ["철거·원상복구", "앞 매장 시설을 걷어내는 비용"],
      ["설비 (전기 증설·급배수·가스·배기)", "업종에 따라 가장 크게 달라지는 칸"],
      ["목공·마감·조명", ""],
      ["간판·사인", "허가·신고가 필요한지 함께 확인"],
      ["설계·디자인", ""],
    ],
  },
  {
    group: "장비·집기",
    rows: [
      ["주방·제조 장비", "메뉴가 장비를, 장비가 전기 용량을 정합니다"],
      ["가구·집기·POS", ""],
    ],
  },
  {
    group: "오픈 준비",
    rows: [
      ["초기 재료·소모품·포장재", ""],
      ["인허가·위생교육·보험", ""],
      ["오픈 전 홍보", "사진 촬영·지도 등록·SNS"],
    ],
  },
  {
    group: "버틸 돈",
    rows: [
      ["운영비 (임대료·인건비·관리비) × 개월 수", "매출이 자리 잡기 전까지 버틸 기간만큼"],
      ["예비비", "공사 중 추가 비용·일정 지연에 대비"],
    ],
  },
];

const CHECKLIST = [
  {
    when: "자리 계약 전",
    items: [
      "건축물대장에서 용도와 위반건축물 여부 확인",
      "전기 용량·가스·배기 덕트를 뺄 수 있는지 확인",
      "권리금이 무엇에 대한 값인지 항목별로 나눠 보기",
      "원상복구 범위를 계약서 특약에 적기",
      "목표 매출로 임대료가 감당되는지 숫자로 계산",
    ],
  },
  {
    when: "공사 전",
    items: [
      "컨셉을 한 문장으로 정리 — \"손님이 왜 여기 와야 하나\"",
      "메뉴·상품 구성과 객단가, 좌석 수를 먼저 정하기",
      "주방·카운터 동선을 피크 시간 기준으로 그려 보기",
      "견적서 항목에 빠진 것(철거·설비·간판·설계)이 없는지 확인",
      "공정표와 대금 지급 단계를 계약서에 함께 적기",
    ],
  },
  {
    when: "오픈 전",
    items: [
      "영업신고·위생교육·사업자등록 순서 확인",
      "소방·가스 등 사용 전 점검 일정 잡기",
      "지도·플레이스 등록, 매장 사진 촬영",
      "직원 동선·응대 리허설 한 번 하기",
      "오픈 후 볼 숫자(일 매출·객단가·재방문)를 정해 두기",
    ],
  },
];

export default function StartupBudgetPage() {
  return (
    <div className="bg-background pb-24 pt-32 md:pt-40 print:pt-0">
      <div className="container max-w-4xl">
        <div className="flex flex-wrap items-end justify-between gap-6 print:hidden">
          <Eyebrow>브랜드각 자료</Eyebrow>
          <PrintButton />
        </div>
        <h1 className="mt-6 font-display text-[2.1rem] font-semibold leading-[1.25] tracking-[-0.02em] sm:text-5xl">
          창업 예산표와 오픈 전 체크리스트
        </h1>
        <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.85] text-foreground/70">
          금액은 자리·업종·규모마다 크게 달라서 비워 두었습니다. 견적을 받을 때마다 채우고, 맨 아래 &lsquo;버틸 돈&rsquo;부터
          먼저 떼어 두세요. 공사비에 다 쓰고 오픈 후 버틸 돈이 없는 것이 가장 흔한 실수입니다.
        </p>

        {/* 예산표 */}
        <h2 className="mt-16 font-display text-2xl font-semibold">1. 창업 예산표</h2>
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[36rem] border-collapse text-[0.9375rem]">
            <thead>
              <tr className="bg-secondary/60 text-left text-sm">
                <th className="px-4 py-3 font-medium">항목</th>
                <th className="w-28 px-4 py-3 font-medium">예상</th>
                <th className="w-28 px-4 py-3 font-medium">견적·실제</th>
                <th className="px-4 py-3 font-medium">메모</th>
              </tr>
            </thead>
            <tbody>
              {BUDGET.map((g) => (
                <Fragment key={g.group}>
                  <tr className="border-t border-border bg-secondary/25">
                    <td colSpan={4} className="px-4 py-2 text-sm font-semibold text-primary">
                      {g.group}
                    </td>
                  </tr>
                  {g.rows.map(([item, memo]) => (
                    <tr key={item} className="border-t border-border align-top">
                      <td className="px-4 py-3">{item}</td>
                      <td className="px-4 py-3 text-foreground/30">　</td>
                      <td className="px-4 py-3 text-foreground/30">　</td>
                      <td className="px-4 py-3 text-sm text-foreground/55">{memo}</td>
                    </tr>
                  ))}
                </Fragment>
              ))}
              <tr className="border-t-2 border-foreground/30 font-semibold">
                <td className="px-4 py-3">합계</td>
                <td className="px-4 py-3" />
                <td className="px-4 py-3" />
                <td className="px-4 py-3" />
              </tr>
            </tbody>
          </table>
        </div>

        {/* 체크리스트 */}
        <h2 className="mt-16 font-display text-2xl font-semibold">2. 단계별 체크리스트</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3 print:grid-cols-3">
          {CHECKLIST.map((c) => (
            <div key={c.when} className="rounded-xl border border-border p-6 print:break-inside-avoid">
              <h3 className="font-display text-lg font-semibold">{c.when}</h3>
              <ul className="mt-4 space-y-3">
                {c.items.map((it) => (
                  <li key={it} className="flex gap-3 text-[0.9375rem] leading-relaxed text-foreground/80">
                    <span aria-hidden className="mt-1 h-4 w-4 shrink-0 rounded border border-foreground/30" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-foreground p-8 text-background md:p-10 print:hidden">
          <p className="font-display text-xl font-semibold sm:text-2xl">칸을 채우다 막히는 곳이 있으면</p>
          <p className="mt-3 text-background/75">
            자리·예산·컨셉 중 어디서 막혔는지 알려주세요. 국가공인 경영지도사가 숫자부터 같이 봅니다. 상담은 무료입니다.
          </p>
          <Link
            href="/#apply"
            className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
          >
            무료 상담 문의
          </Link>
        </div>
        <p className="mt-10 text-xs text-foreground/45">© 브랜드각 · 개인 사업 준비 용도로 자유롭게 쓰셔도 됩니다.</p>
      </div>
    </div>
  );
}
