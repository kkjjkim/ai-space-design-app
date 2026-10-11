"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";
import { cn } from "@/lib/utils";

// 사진 펼침 — 스크롤하면 좁게 잘린 사진이 양옆으로 열리며 살짝 줌아웃된다.
// 서브 페이지 머리말 아래에 쓴다. 움직임 줄이기 설정이면 처음부터 펼쳐진 상태.
// 휴대폰에서는 이 사진이 첫 화면에 걸려 LCP가 된다(2026-10-11 /service 8.3s) → 우선 로드 + 화면 폭에 맞는 판(srcSet).
export function ImageReveal({
  src,
  srcSet,
  sizes = "(min-width: 1280px) 1200px, 100vw",
  alt,
  className,
  caption,
}: {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  className?: string;
  caption?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, (gsap) => {
    gsap.fromTo(
      "[data-frame]",
      { clipPath: "inset(0% 12% 0% 12% round 1.25rem)" },
      {
        clipPath: "inset(0% 0% 0% 0% round 1.25rem)",
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 90%", end: "top 25%", scrub: true },
      }
    );
    gsap.fromTo(
      "[data-img]",
      { scale: 1.14 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 90%", end: "bottom top", scrub: true },
      }
    );
  });

  return (
    <figure ref={ref} className={cn("container", className)}>
      <div data-frame className="overflow-hidden rounded-[1.25rem] bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-img
          src={src}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          alt={alt}
          fetchPriority="high"
          decoding="async"
          className="aspect-[16/9] w-full object-cover md:aspect-[21/9]"
        />
      </div>
      {caption && <figcaption className="mt-3 text-right text-xs text-foreground/45">{caption}</figcaption>}
    </figure>
  );
}
