import { cn } from "@/lib/utils";

export function Section({
  id,
  className,
  children,
  tone = "default",
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  tone?: "default" | "muted" | "ink";
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 py-24 md:py-32",
        tone === "muted" && "bg-secondary/40",
        tone === "ink" && "bg-foreground text-background",
        className
      )}
    >
      <div className="container">{children}</div>
    </section>
  );
}

// 섹션 머리글 — 짧은 금색 선 + 보통 자간 (한글에 넓은 자간을 주면 흩어져 보인다. 2026-10 개편)
export function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[0.8125rem] font-medium tracking-[0.04em] text-primary",
        center && "justify-center"
      )}
    >
      <span aria-hidden className="h-px w-8 bg-primary" />
      {children}
      {center && <span aria-hidden className="h-px w-8 bg-primary" />}
    </p>
  );
}

// 섹션 제목 묶음 — 머리글 + 명조 제목 + 설명. 홈·서브 페이지 전체가 같은 리듬을 쓰게 한 곳에 둔다.
export function SectionHeading({
  eyebrow,
  title,
  lead,
  center = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(center ? "mx-auto max-w-3xl text-center" : "max-w-3xl", className)}>
      {eyebrow && (
        <div className="mb-6">
          <Eyebrow center={center}>{eyebrow}</Eyebrow>
        </div>
      )}
      <h2 className="font-display text-[1.9rem] font-semibold leading-[1.3] tracking-[-0.02em] sm:text-[2.6rem]">
        {title}
      </h2>
      {lead && (
        <p className={cn("mt-6 text-[1.0625rem] leading-[1.85] text-foreground/70", center && "mx-auto max-w-2xl")}>
          {lead}
        </p>
      )}
    </div>
  );
}
