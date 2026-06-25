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
        "scroll-mt-20 py-20 md:py-28",
        tone === "muted" && "bg-secondary/40",
        tone === "ink" && "bg-foreground text-background",
        className
      )}
    >
      <div className="container">{children}</div>
    </section>
  );
}

// 섹션 상단 작은 라벨 (골드 포인트, 절제)
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
      {children}
    </span>
  );
}
