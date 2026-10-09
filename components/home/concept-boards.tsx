"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CONCEPT_BOARDS } from "@/lib/concept-boards";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

// 6) 업종별 컨셉 보드 (대표 효과 3) — 업종을 고르면 사진이 조각으로 흩어졌다가 모여 한 장이 된다.
// (Stanzza식 "조각이 모여 한 공간"). 옆에는 고민 → 컨셉 문장 → 공간으로 푸는 법 → 키워드·색·재료.
const COLS = 6;
const ROWS = 4;

export function ConceptBoards() {
  const [active, setActive] = useState(0);
  const tilesRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const b = CONCEPT_BOARDS[active];
  const src = `${b.image}-1600.webp`;

  // 바뀔 때마다 조각이 모이는 전환
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;
      const tiles = tilesRef.current?.querySelectorAll("[data-tile]");
      if (tiles?.length) {
        gsap.fromTo(
          tiles,
          { opacity: 0, scale: 1.12 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: { grid: [ROWS, COLS], from: "center", amount: 0.45 },
          }
        );
      }
      if (textRef.current) {
        gsap.fromTo(
          textRef.current.children,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power2.out" }
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <section className="bg-background py-28 md:py-36">
      <div className="container">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-6 flex items-center gap-3 text-[0.8125rem] font-medium tracking-[0.04em] text-primary">
              <span aria-hidden className="h-px w-8 bg-primary" />
              업종별 컨셉 보드
            </p>
            <h2 className="font-display text-[1.9rem] font-semibold leading-[1.3] tracking-[-0.02em] sm:text-[2.8rem]">
              같은 고민도, 업종마다 답이 다릅니다.
            </h2>
            <p className="mt-6 text-[1.0625rem] leading-[1.85] text-foreground/70">
              상담에서는 사장님의 고민을 한 문장의 컨셉으로 정리하고, 그 문장을 재료와 동선으로 옮깁니다.
            </p>
          </div>
          <p className="text-sm text-foreground/50">컨셉 분위기 예시입니다.</p>
        </div>

        {/* 업종 탭 */}
        <div role="tablist" aria-label="업종" className="mt-12 flex flex-wrap gap-2">
          {CONCEPT_BOARDS.map((c, i) => (
            <button
              key={c.slug}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm transition-colors",
                i === active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground/70 hover:border-foreground/40 hover:text-foreground"
              )}
            >
              {c.industry}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
          {/* 사진 — 조각 그리드 */}
          <div
            ref={tilesRef}
            key={b.slug}
            className="relative grid aspect-[3/2] overflow-hidden rounded-2xl bg-secondary"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
            aria-label={`${b.industry} 컨셉 분위기 예시`}
            role="img"
          >
            {Array.from({ length: COLS * ROWS }).map((_, i) => {
              const c = i % COLS;
              const r = Math.floor(i / COLS);
              return (
                <div
                  key={i}
                  data-tile
                  style={{
                    // 조각 사이 1px 미만 틈이 보이지 않게 살짝 겹친다
                    margin: "-0.5px",
                    backgroundImage: `url(${src})`,
                    backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                    backgroundPosition: `${(c / (COLS - 1)) * 100}% ${(r / (ROWS - 1)) * 100}%`,
                  }}
                />
              );
            })}
          </div>

          {/* 보드 */}
          <div ref={textRef} key={`t-${b.slug}`} className="flex flex-col">
            <span className="text-[0.8125rem] font-medium tracking-[0.04em] text-primary">{b.industry}</span>
            <h3 className="mt-3 font-display text-[1.6rem] font-semibold leading-snug sm:text-3xl">{b.title}</h3>

            <dl className="mt-8 space-y-6 text-[0.975rem] leading-relaxed">
              <div>
                <dt className="text-xs font-medium tracking-[0.04em] text-foreground/45">사장님의 고민</dt>
                <dd className="mt-1.5 text-foreground/80">{b.problem}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-[0.04em] text-foreground/45">공간으로 푸는 법</dt>
                <dd className="mt-1.5 text-foreground/80">{b.move}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-2">
              {b.keywords.map((k) => (
                <span key={k} className="rounded-full bg-secondary px-3 py-1 text-[0.8125rem] text-foreground/75">
                  {k}
                </span>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-6 border-t border-border pt-6">
              <div className="flex">
                {b.palette.map((hex) => (
                  <span
                    key={hex}
                    title={hex}
                    className="-ml-1.5 h-8 w-8 rounded-full border-2 border-background first:ml-0"
                    style={{ background: hex }}
                  />
                ))}
              </div>
              <p className="text-sm text-foreground/60">{b.materials.join(" · ")}</p>
            </div>

            <Link
              href={b.href}
              className="group mt-auto inline-flex items-center gap-2 pt-8 text-[0.9375rem] font-medium hover:text-primary"
            >
              {b.href === "/#apply" ? "이 업종으로 상담 받기" : `${b.industry} 인테리어 더 보기`}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
