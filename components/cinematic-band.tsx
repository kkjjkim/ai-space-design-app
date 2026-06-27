import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

// ZORGE식 풀블리드 시네마틱 밴드: 대형 이미지/영상 위에 텍스트가 떠 있는 섹션.
// 이미지가 없으면 어두운 시네마틱 폴백을 보여주고, 운영자가 파일을 넣으면 교체된다.
export function CinematicBand({
  id,
  src,
  video = false,
  eyebrow,
  title,
  body,
  caption,
  align = "left",
  kind = "mood",
  minH = "min-h-[78vh]",
}: {
  id?: string;
  src?: string;
  video?: boolean;
  eyebrow?: string;
  title: string;
  body?: string;
  caption?: string;
  align?: "left" | "right";
  kind?: "mood" | "real";
  minH?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate flex items-center overflow-hidden text-background",
        minH
      )}
    >
      {/* 배경 미디어 / 폴백 */}
      {src ? (
        video ? (
          <video
            className="absolute inset-0 -z-10 h-full w-full object-cover"
            src={src}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={title}
            className="absolute inset-0 -z-10 h-full w-full object-cover motion-safe:animate-kenburns"
          />
        )
      ) : (
        <div aria-hidden className="absolute inset-0 -z-10 bg-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_75%_25%,rgba(166,128,63,0.22),transparent_55%)]" />
          <span className="absolute bottom-4 right-5 text-[11px] tracking-wide text-background/35">
            {kind === "real"
              ? "실사진 자리 — 운영자가 넣습니다"
              : "이미지/영상 자리 — 운영자가 넣습니다"}
          </span>
        </div>
      )}

      {/* 가독성 오버레이 */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10",
          align === "right"
            ? "bg-gradient-to-l from-black/75 via-black/35 to-black/20"
            : "bg-gradient-to-r from-black/75 via-black/35 to-black/20"
        )}
      />

      <div className="container relative w-full py-20">
        <Reveal
          className={cn("max-w-xl", align === "right" && "ml-auto md:text-right")}
        >
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-semibold leading-snug md:text-[2.6rem]">
            {title}
          </h2>
          {body && (
            <p className="mt-6 text-lg leading-relaxed text-background/85">
              {body}
            </p>
          )}
        </Reveal>

        {caption && (
          <p className="mt-16 text-sm uppercase tracking-[0.2em] text-background/70">
            {caption}
          </p>
        )}
      </div>
    </section>
  );
}
