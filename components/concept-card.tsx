import Link from "next/link";
import { ImageIcon } from "lucide-react";
import type { Concept } from "@/lib/concepts";

// 컨셉 카드: 이미지 위에 브랜드명/업종이 떠 있는 시네마틱 카드.
// 이미지가 없으면 어두운 폴백 + 안내. 클릭 시 /concepts 상세로 이동.
export function ConceptCard({ concept }: { concept: Concept }) {
  return (
    <Link
      href={`/concepts#${concept.slug}`}
      className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-lg text-background"
    >
      {/* 이미지 / 폴백 */}
      {concept.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={concept.image}
          alt={`${concept.name} 컨셉 이미지`}
          className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div aria-hidden className="absolute inset-0 -z-10 bg-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_70%_10%,rgba(166,128,63,0.25),transparent_55%)]" />
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-8 w-8 text-background/40" />
          </div>
        </div>
      )}

      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/25 to-black/10"
      />

      <div className="p-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
          {concept.type}
        </p>
        <h3 className="mt-2 font-serif text-2xl font-semibold uppercase tracking-wide">
          {concept.name}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-background/85">
          {concept.oneLiner}
        </p>
        <span className="mt-4 inline-block text-sm font-medium text-background underline-offset-4 group-hover:underline">
          자세히 보기 →
        </span>
      </div>
    </Link>
  );
}
