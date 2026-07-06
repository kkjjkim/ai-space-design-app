"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import type { InsightMeta } from "@/lib/insights";

// 인사이트 목록 — 처음 12개만 보이고 "더보기"로 펼친다.
// 모든 카드는 HTML(DOM)에 렌더되고 초과분만 숨기므로, 검색엔진은 전체 글 링크를 본다.
const PAGE_SIZE = 12;

export function InsightList({ posts }: { posts: InsightMeta[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  if (posts.length === 0) {
    return (
      <p className="text-center text-muted-foreground">첫 글을 준비 중입니다.</p>
    );
  }

  const remaining = posts.length - visible;

  return (
    <>
      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <div key={p.slug} className={i >= visible ? "hidden" : undefined}>
            <Reveal delay={(i % 3) * 80}>
              <Link
                href={`/insights/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.cover}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {p.category}
                  </span>
                  <h2 className="mt-3 text-lg font-bold leading-snug text-foreground">
                    {p.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-foreground/70">
                    {p.description}
                  </p>
                  <span className="mt-4 text-sm font-medium text-foreground/60 group-hover:text-primary">
                    읽어보기 →
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className={buttonVariants({ variant: "outline" })}
          >
            더보기 ({remaining}편 더)
          </button>
        </div>
      )}
    </>
  );
}
