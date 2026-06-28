"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONCEPTS } from "@/lib/concepts";

// 컨셉 제안 슬라이더: 하나를 크게 보여주고 화살표/점으로 이동, 5초마다 자동 전환(호버 시 정지).
export function ConceptCarousel() {
  const [index, setIndex] = useState(0);
  const total = CONCEPTS.length;
  const paused = useRef(false);

  const go = (d: 1 | -1) => setIndex((p) => (p + d + total) % total);

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setIndex((p) => (p + 1) % total);
    }, 5000);
    return () => clearInterval(id);
  }, [total]);

  const c = CONCEPTS[index];

  return (
    <div
      className="select-none"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="relative isolate aspect-[4/3] overflow-hidden rounded-xl bg-foreground text-background sm:aspect-[16/10] lg:aspect-[16/8]">
        {/* 이미지 크로스페이드 */}
        {CONCEPTS.map((cc, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={cc.slug}
            src={cc.image}
            alt={cc.name}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              idx === index ? "opacity-100" : "opacity-0"
            )}
          />
        ))}

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10"
        />

        {/* 카운터 */}
        <div className="absolute right-5 top-5 text-sm font-medium tabular-nums tracking-widest text-background/80">
          {String(index + 1).padStart(2, "0")}
          <span className="text-background/40"> / {String(total).padStart(2, "0")}</span>
        </div>

        {/* 내용 */}
        <div
          key={c.slug}
          className="absolute inset-x-0 bottom-0 p-7 md:p-12 motion-safe:animate-fade-in-up"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {c.type}
          </p>
          <h3 className="mt-2 text-3xl font-extrabold uppercase tracking-wide md:text-5xl">
            {c.name}
          </h3>
          <p className="mt-3 max-w-xl leading-relaxed text-background/85">
            {c.oneLiner}
          </p>
          <Link
            href={`/concepts#${c.slug}`}
            className="mt-5 inline-flex items-center gap-1 border-b border-background/50 pb-1 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
          >
            자세히 보기
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 화살표 */}
        <button
          type="button"
          aria-label="이전"
          onClick={() => go(-1)}
          className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-background backdrop-blur transition-colors hover:border-primary hover:text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="다음"
          onClick={() => go(1)}
          className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-background backdrop-blur transition-colors hover:border-primary hover:text-primary"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* 점 인디케이터 */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {CONCEPTS.map((cc, idx) => (
          <button
            key={cc.slug}
            type="button"
            aria-label={`${idx + 1}번 컨셉`}
            onClick={() => setIndex(idx)}
            className={cn(
              "h-2 rounded-full transition-all",
              idx === index ? "w-6 bg-primary" : "w-2 bg-foreground/20 hover:bg-foreground/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
