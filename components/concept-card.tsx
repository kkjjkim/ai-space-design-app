import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Concept } from "@/lib/concepts";

// 컨셉 카드: 이미지 위에 브랜드명/업종이 떠 있는 시네마틱 카드.
// 이미지가 없으면 어두운 타이틀카드(브랜드명 워터마크) + 안내. 클릭 시 /concepts 상세로.
export function ConceptCard({ concept }: { concept: Concept }) {
  return (
    <Link
      href={`/concepts#${concept.slug}`}
      className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-lg bg-foreground text-background"
    >
      {/* 이미지 / 타이틀카드 폴백 */}
      {concept.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={concept.image}
          alt={`${concept.name} 컨셉 이미지`}
          className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(130%_90%_at_70%_8%,rgba(166,128,63,0.30),transparent_55%)]" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <span className="text-center text-2xl font-extrabold uppercase tracking-wider text-background/10">
              {concept.name}
            </span>
          </div>
        </div>
      )}

      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
      />

      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {concept.type}
        </p>
        <h3 className="mt-2 text-2xl font-extrabold uppercase tracking-wide">
          {concept.name}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-background/80">
          {concept.oneLiner}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-background">
          자세히 보기
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
