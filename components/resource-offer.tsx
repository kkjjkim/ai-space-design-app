"use client";

import Link from "next/link";
import { useState } from "react";
import { LeadForm } from "@/components/lead-form";
import { Eyebrow } from "@/components/section";
import { track } from "@/lib/track";

// 자료 받기 — "아직 상담까진 이르다"는 방문자에게 주는 첫 단계.
// 이름·연락처를 남기면 예산표·체크리스트 페이지가 바로 열린다(메일 발송 없음: Resend 도메인 미인증).
// 연락처는 상담 신청과 같은 /api/leads 로 들어가고, 메시지 머리말로 자료 받기임을 구분한다.
export const RESOURCE_PATH = "/resources/startup-budget";

const ITEMS = [
  "보증금부터 예비비까지 빠짐없는 창업 예산표",
  "공사비에 다 쓰지 않게 — 운영비를 먼저 떼는 순서",
  "계약 전·공사 전·오픈 전 단계별 체크리스트",
];

export function ResourceOffer({ compact = false }: { compact?: boolean }) {
  const [done, setDone] = useState(false);

  return (
    <section className={compact ? "py-16" : "bg-background py-24 md:py-32"}>
      <div className="container">
        <div className="grid items-start gap-10 overflow-hidden rounded-[1.5rem] border border-border bg-card p-7 md:p-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <Eyebrow>아직 상담까지는 이르다면</Eyebrow>
            <h2 className="mt-6 font-display text-[1.75rem] font-semibold leading-[1.3] tracking-[-0.02em] sm:text-[2.2rem]">
              창업 예산표와
              <br />
              오픈 전 체크리스트를 드립니다.
            </h2>
            <ul className="mt-8 space-y-3">
              {ITEMS.map((it) => (
                <li key={it} className="flex items-start gap-3 text-[0.975rem] leading-relaxed text-foreground/80">
                  <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {it}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-foreground/50">인쇄하거나 PDF로 저장해 두고 쓰실 수 있습니다.</p>
          </div>

          <div className="rounded-2xl bg-background p-6 md:p-8">
            {done ? (
              <div className="py-6 text-center">
                <p className="font-display text-2xl font-semibold">준비됐습니다.</p>
                <p className="mt-3 text-foreground/70">아래 버튼을 누르면 예산표와 체크리스트가 열립니다.</p>
                <Link
                  href={RESOURCE_PATH}
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 font-medium text-primary-foreground hover:bg-primary/90"
                  onClick={() => track("resource_open", {})}
                >
                  예산표·체크리스트 열기
                </Link>
              </div>
            ) : (
              <LeadForm
                variant="resource"
                defaults={{ message: "[자료 받기] 창업 예산표·오픈 전 체크리스트" }}
                onDone={() => setDone(true)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
