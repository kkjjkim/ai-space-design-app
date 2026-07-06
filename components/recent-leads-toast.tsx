"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// 최근 상담 신청(익명)을 좌하단에 은은하게 순환 노출 — 소셜 프루프.
// 진짜 데이터만 사용하며, 신청이 없으면 아무것도 표시하지 않는다.
type Item = { name: string; industry: string; at: string };

function ago(iso: string): string {
  const t = new Date(iso).getTime();
  if (!t) return "";
  const m = Math.floor((Date.now() - t) / 60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

export function RecentLeadsToast() {
  const [items, setItems] = useState<Item[]>([]);
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/recent-leads", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (alive && Array.isArray(d.items)) setItems(d.items);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // 첫 노출은 3초 뒤부터, 이후 하나씩 순환 (7초 주기, 5.5초 노출)
  useEffect(() => {
    if (items.length === 0) return;
    let mounted = true;
    const start = setTimeout(() => mounted && setShow(true), idx === 0 ? 3000 : 0);
    const hide = setTimeout(() => mounted && setShow(false), 5500 + (idx === 0 ? 3000 : 0));
    const next = setTimeout(
      () => mounted && setIdx((i) => (i + 1) % items.length),
      7000 + (idx === 0 ? 3000 : 0)
    );
    return () => {
      mounted = false;
      clearTimeout(start);
      clearTimeout(hide);
      clearTimeout(next);
    };
  }, [items, idx]);

  if (items.length === 0) return null;
  const it = items[idx];
  const when = ago(it.at);

  return (
    <div
      aria-live="polite"
      className={cn(
        "fixed bottom-5 left-5 z-30 max-w-[86vw] transition-all duration-500",
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <div className="flex items-center gap-3 rounded-full border border-border bg-card/95 py-2.5 pl-3 pr-5 shadow-lg shadow-foreground/10 backdrop-blur">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Check className="h-4 w-4" />
        </span>
        <p className="text-sm leading-tight text-foreground">
          <b>{it.name}</b>님이 {it.industry ? `${it.industry} ` : ""}상담을
          신청했어요
          {when && <span className="ml-1 text-muted-foreground">· {when}</span>}
        </p>
      </div>
    </div>
  );
}
