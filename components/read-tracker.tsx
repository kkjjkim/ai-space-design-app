"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/track";

// 글 끝 지점이 화면에 들어오면 "끝까지 읽음"으로 센다.
// 어떤 글이 읽히고 어떤 글이 첫 문단에서 버려지는지 구분하려는 것.
export function ReadTracker({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        track("insight_read", { slug });
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [slug]);
  return <div ref={ref} aria-hidden />;
}
