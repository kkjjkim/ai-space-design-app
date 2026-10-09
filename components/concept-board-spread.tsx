import Link from "next/link";
import type { ConceptBoard } from "@/lib/concept-boards";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

// 컨셉 보드 한 장(정지형) — 컨셉 페이지와 업종 페이지에서 쓴다.
// 홈의 탭형(조각 전환)과 같은 내용을 펼쳐 놓은 버전.
export function ConceptBoardSpread({
  board,
  flip = false,
  showLink = true,
}: {
  board: ConceptBoard;
  flip?: boolean;
  showLink?: boolean;
}) {
  return (
    <article id={board.slug} className="scroll-mt-28">
      <div className={cn("grid items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16", flip && "lg:[&>*:first-child]:order-2")}>
        <Reveal className="overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${board.image}-1600.webp`}
            srcSet={`${board.image}-960.webp 960w, ${board.image}-1600.webp 1600w`}
            sizes="(min-width: 1024px) 58vw, 100vw"
            alt={`${board.industry} 컨셉 분위기 예시`}
            loading="lazy"
            className="aspect-[3/2] w-full object-cover"
          />
        </Reveal>
        <Reveal delay={100}>
          <span className="text-[0.8125rem] font-medium tracking-[0.04em] text-primary">{board.industry}</span>
          <h3 className="mt-3 font-display text-[1.6rem] font-semibold leading-snug sm:text-3xl">{board.title}</h3>
          <dl className="mt-8 space-y-6 text-[0.975rem] leading-relaxed">
            <div>
              <dt className="text-xs font-medium tracking-[0.04em] text-foreground/45">사장님의 고민</dt>
              <dd className="mt-1.5 text-foreground/80">{board.problem}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-[0.04em] text-foreground/45">공간으로 푸는 법</dt>
              <dd className="mt-1.5 text-foreground/80">{board.move}</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-2">
            {board.keywords.map((k) => (
              <span key={k} className="rounded-full bg-secondary px-3 py-1 text-[0.8125rem] text-foreground/75">
                {k}
              </span>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-6 border-t border-border pt-6">
            <div className="flex">
              {board.palette.map((hex) => (
                <span
                  key={hex}
                  title={hex}
                  className="-ml-1.5 h-8 w-8 rounded-full border-2 border-background first:ml-0"
                  style={{ background: hex }}
                />
              ))}
            </div>
            <p className="text-sm text-foreground/60">{board.materials.join(" · ")}</p>
          </div>
          {showLink && (
            <Link href={board.href} className="group mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium hover:text-primary">
              {board.href === "/#apply" ? "이 업종으로 상담 받기" : `${board.industry} 인테리어 더 보기`}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          )}
        </Reveal>
      </div>
    </article>
  );
}
