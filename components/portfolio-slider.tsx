"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ImageIcon } from "lucide-react";

// 포트폴리오 슬라이드. 실제 사진은 운영자가 넣는 자리(플레이스홀더)만 제공한다.
// (AGENTS.md 7번: AI 가짜 인테리어를 실제 시공 사례처럼 쓰지 않는다.)
const TOTAL = 8;

export function PortfolioSlider() {
  const [index, setIndex] = useState(0);

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + TOTAL) % TOTAL);

  return (
    <div>
      <div className="relative overflow-hidden rounded-lg border border-border bg-muted">
        {/* 풀블리드 대형 사진 자리 */}
        <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 text-muted-foreground">
          <ImageIcon className="h-10 w-10" />
          <p className="text-sm">
            시공 사례 사진 자리 — 운영자가 실사진을 넣습니다
          </p>
          <p className="text-xs">로고 없는 컷 · {String(index + 1).padStart(2, "0")}번 슬라이드</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="font-serif text-lg tabular-nums text-foreground">
          {String(index + 1).padStart(2, "0")}{" "}
          <span className="text-muted-foreground">/ {String(TOTAL).padStart(2, "0")}</span>
        </span>
        <div className="flex gap-3">
          <button
            type="button"
            aria-label="이전 사례"
            onClick={() => go(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/25 text-foreground transition-colors hover:bg-foreground/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="다음 사례"
            onClick={() => go(1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/25 text-foreground transition-colors hover:bg-foreground/5"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
