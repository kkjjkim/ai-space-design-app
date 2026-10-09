import { Eyebrow } from "@/components/section";
import { ImageReveal } from "@/components/image-reveal";

// 서브 페이지 머리말 (2026-10 개편) — 홈 첫 화면과 같은 종이색 바탕 + 명조 제목,
// 그 아래 사진이 스크롤에 맞춰 펼쳐진다. 예전 어두운 영상형 머리말을 대체.
export function PageHero({
  image,
  eyebrow,
  title,
  subtitle,
  note,
  compact = false,
}: {
  image?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  note?: string;
  // 글 제목처럼 긴 제목은 한 단계 작게
  compact?: boolean;
}) {
  return (
    <section className="bg-background pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="container">
        <div className={compact ? "reveal max-w-4xl" : "reveal max-w-3xl"}>
          {eyebrow && (
            <div className="mb-7">
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          )}
          <h1
            className={
              compact
                ? "font-display text-[1.8rem] font-semibold leading-[1.3] tracking-[-0.02em] sm:text-[2.5rem] lg:text-[2.9rem]"
                : "font-display text-[2.2rem] font-semibold leading-[1.22] tracking-[-0.03em] sm:text-5xl lg:text-[3.6rem]"
            }
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-7 max-w-2xl text-[1.0625rem] leading-[1.85] text-foreground/70">{subtitle}</p>
          )}
        </div>
      </div>
      {image && <ImageReveal src={image} alt={title} caption={note} className="mt-14 md:mt-20" />}
    </section>
  );
}
