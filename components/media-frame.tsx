import { ImageIcon, Film } from "lucide-react";
import { cn } from "@/lib/utils";

// 이미지/영상 자리. src 가 있으면 실제 미디어를, 없으면 운영자용 플레이스홀더를 보여준다.
// kind="real" 은 포트폴리오 실사진 자리(AGENTS.md 7번: AI 가짜 금지),
// kind="mood" 는 히어로/분위기 컷(생성 이미지·영상 허용).
export function MediaFrame({
  src,
  alt,
  ratio = "aspect-[4/3]",
  kind = "mood",
  label,
  className,
  video = false,
  rounded = true,
}: {
  src?: string;
  alt: string;
  ratio?: string;
  kind?: "mood" | "real";
  label?: string;
  className?: string;
  video?: boolean;
  rounded?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
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
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
          {video ? <Film className="h-8 w-8" /> : <ImageIcon className="h-8 w-8" />}
          <p className="px-4 text-center text-xs">
            {label ??
              (kind === "real"
                ? "실사진 자리 — 운영자가 넣습니다 (로고 없는 컷)"
                : "이미지/영상 자리 — 운영자가 넣습니다")}
          </p>
        </div>
      )}
    </div>
  );
}
