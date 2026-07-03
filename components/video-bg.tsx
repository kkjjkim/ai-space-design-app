"use client";

import { useEffect, useRef } from "react";

// 배경 영상: 화면에 보일 때만 재생(성능), poster 폴백, 재생 속도 조절 지원.
export function VideoBg({
  src,
  poster,
  className,
  playbackRate,
}: {
  src: string;
  poster: string;
  className?: string;
  playbackRate?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const applyRate = () => {
      if (playbackRate) v.playbackRate = playbackRate;
    };
    applyRate();
    v.addEventListener("loadedmetadata", applyRate);
    v.addEventListener("play", applyRate);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(v);

    return () => {
      io.disconnect();
      v.removeEventListener("loadedmetadata", applyRate);
      v.removeEventListener("play", applyRate);
    };
  }, [playbackRate]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      className={className}
    />
  );
}
