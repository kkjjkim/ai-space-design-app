"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// 포트폴리오/히어로 슬라이드. 실제 사진은 운영자가 넣는 자리(플레이스홀더)만 제공한다.
// (AGENTS.md 7번: AI 가짜 인테리어를 실제 시공 사례처럼 쓰지 않는다.)
// 캡션 바(화살표 · 프로젝트명 · "01 OF 08")는 AvroKO 벤치마크 레이아웃을 따른다.

// 프로젝트명은 운영자가 채울 자리.
const SLIDES = Array.from({ length: 8 }, (_, i) => ({
  name: `프로젝트 ${String(i + 1).padStart(2, "0")} — 운영자 입력`,
}));

export function PortfolioSlider({
  className,
  aspect = "aspect-[16/10]",
}: {
  className?: string;
  aspect?: string;
}) {
  const [index, setIndex] = useState(0);
  const total = SLIDES.length;
  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total);

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-lg border border-border bg-foreground/90">
        {/* 풀블리드 대형 사진 자리 */}
        <div
          className={cn(
            "flex w-full flex-col items-center justify-center gap-3 bg-muted text-muted-foreground",
            aspect
          )}
        >
          <ImageIcon className="h-10 w-10" />
          <p className="text-sm">시공 사례 사진 자리 — 운영자가 실사진을 넣습니다</p>
          <p className="text-xs">로고 없는 컷</p>
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

        <p className="flex-1 truncate text-foreground/80">{SLIDES[index].name}</p>

        <span className="shrink-0 text-sm tabular-nums tracking-widest text-muted-foreground">
          {String(index + 1).padStart(2, "0")} OF {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
