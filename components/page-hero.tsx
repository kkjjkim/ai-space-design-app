import { Reveal } from "@/components/reveal";

// 서브페이지 상단 시네마틱 헤더: 공간 이미지 + 슬로우 줌 + 어두운 오버레이 위 제목.
export function PageHero({
  image,
  eyebrow,
  title,
  subtitle,
  note,
}: {
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  note?: string;
}) {
  return (
    <section className="relative isolate flex min-h-[56vh] items-end overflow-hidden text-background">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 -z-10 h-full w-full object-cover motion-safe:animate-kenburns"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/40"
      />
      <div className="container relative w-full pb-16 pt-32 md:pb-20">
        <Reveal className="max-w-3xl">
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-background/85">
              {subtitle}
            </p>
          )}
          {note && (
            <p className="mt-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm text-background/80 backdrop-blur">
              {note}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
