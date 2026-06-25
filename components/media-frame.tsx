import { cn } from "@/lib/utils";

// 이미지/영상 자리. src 가 있으면 실제 미디어를, 없으면 어두운 시네마틱 타이틀카드를 보여준다.
export function MediaFrame({
  src,
  alt,
  ratio = "aspect-[4/3]",
  label,
  caption,
  className,
  video = false,
  rounded = true,
}: {
  src?: string;
  alt: string;
  ratio?: string;
  kind?: "mood" | "real";
  label?: string;
  caption?: string;
  className?: string;
  video?: boolean;
  rounded?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-foreground",
        rounded && "rounded-lg",
        ratio,
        className
      )}
    >
      {src ? (
        video ? (
          <video
            className="h-full w-full object-cover"
            src={src}
            autoPlay
            muted
            loop
            playsInline
            aria-label={alt}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-background/55">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_15%,rgba(166,128,63,0.22),transparent_55%)]"
          />
          {caption && (
            <span className="relative font-semibold uppercase tracking-[0.2em] text-background/80">
              {caption}
            </span>
          )}
          <span className="relative text-xs tracking-wide">
            {label ?? "이미지 자리 — 운영자가 넣습니다"}
          </span>
        </div>
      )}
    </div>
  );
}
