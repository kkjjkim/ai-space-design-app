import Link from "next/link";
import type { InsightMeta } from "@/lib/insights";

// 글 끝 관련 글 3편. 목록 카드와 같은 모양을 작게 써서 "다음에 읽을 글"로 이어 준다.
export function RelatedInsights({ posts }: { posts: InsightMeta[] }) {
  if (posts.length === 0) return null;
  return (
    <div className="mx-auto mt-14 max-w-5xl">
      <h2 className="text-center font-display text-2xl font-semibold text-foreground">
        함께 읽으면 좋은 글
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
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
            <div className="flex flex-1 flex-col p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {p.category}
              </span>
              <h3 className="mt-2 text-base font-bold leading-snug text-foreground">
                {p.title}
              </h3>
              <span className="mt-3 text-sm font-medium text-foreground/60 group-hover:text-primary">
                읽어보기 →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
