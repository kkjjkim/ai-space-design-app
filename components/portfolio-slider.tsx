"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROJECTS } from "@/lib/portfolio";

// 포트폴리오 슬라이드. 실사진은 운영자가 /public/portfolio 에 넣고 lib/portfolio.ts 에 등록.
// (AGENTS.md 7번: AI 가짜 인테리어를 실제 시공 사례처럼 쓰지 않는다.)
// 캡션 바(화살표 · 프로젝트명 · "01 OF 08")는 AvroKO/ZORGE 벤치마크 레이아웃을 따른다.
export function PortfolioSlider({
  className,
  aspect = "aspect-[16/10]",
}: {
  className?: string;
  aspect?: string;
}) {
  const [index, setIndex] = useState(0);
  const total = PROJECTS.length;
  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total);
  const current = PROJECTS[index];

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-lg bg-foreground">
        <div className={cn("relative w-full", aspect)}>
          {current.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.image}
              alt={current.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-background/55">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_15%,rgba(166,128,63,0.20),transparent_55%)]"
              />
              <span className="relative text-sm">시공 사례 사진 자리 — 운영자가 실사진을 넣습니다</span>
              <span className="relative text-xs text-background/40">로고 없는 컷</span>
            </div>
          )}
        </div>
      </div>

      {/* 캡션 바: 화살표 · 프로젝트명 · 카운터 */}
      <div className="mt-6 flex items-center gap-5">
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            aria-label="이전 사례"
            onClick={() => go(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/25 text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="다음 사례"
            onClick={() => go(1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/25 text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <p className="flex-1 truncate text-foreground/80">{current.name}</p>

        <span className="shrink-0 text-sm tabular-nums tracking-widest text-muted-foreground">
          {String(index + 1).padStart(2, "0")} OF {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
