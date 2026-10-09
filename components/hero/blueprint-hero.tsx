"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { canRun3D } from "@/lib/motion";
import { cn } from "@/lib/utils";

// 첫 화면 — "도면이 가게가 된다" (대표 효과 1, docs/redesign-2026-10.md).
// 글(h1·버튼)은 서버에서 바로 그려지고, 3D는 그 뒤에 동적으로 불러온다.
// 스크롤하는 동안 화면이 고정되고 장면이 선 → 면 → 빛으로 바뀐다.
// 3D를 못 돌리는 기기(움직임 줄이기·저사양·WebGL 없음)는 고정 없이 완성 사진 한 장으로 대체.

const PHASES = [
  { n: "01", t: "선", d: "되는 장사인지, 숫자로 먼저 그립니다" },
  { n: "02", t: "면", d: "컨셉이 공간의 재료와 동선이 됩니다" },
  { n: "03", t: "빛", d: "불이 켜진 뒤의 매출까지 함께 봅니다" },
];

export function BlueprintHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // null = 아직 판단 전(서버 렌더와 같게 정지 화면), true/false = 판단 후
  const [use3D, setUse3D] = useState<boolean | null>(null);
  const [phase, setPhase] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUse3D(canRun3D());
  }, []);

  useEffect(() => {
    if (!use3D) return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const [{ createBlueprintScene }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("./blueprint-scene"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      const scene = createBlueprintScene(canvas);
      const intro = { p: 0 };
      let scrollP = 0;
      const update = () => {
        // 처음엔 스크롤 없이도 도면이 그려지고(0→0.34), 스크롤이 그다음을 이어간다.
        const p = scrollP > 0 ? Math.max(intro.p, 0.34 + scrollP * 0.66) : intro.p;
        scene.setProgress(p);
        section.style.setProperty("--hero-p", p.toFixed(3));
        setPhase(p < 0.36 ? 0 : p < 0.72 ? 1 : 2);
      };

      const introTween = gsap.to(intro, { p: 0.34, duration: 2.2, ease: "power2.out", delay: 0.2, onUpdate: update });

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          scrollP = self.progress;
          update();
        },
      });

      // 화면에 보일 때만 그린다.
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) scene.start();
        else scene.stop();
      });
      io.observe(section);

      const onPointer = (e: PointerEvent) => {
        const r = section.getBoundingClientRect();
        scene.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
      };
      section.addEventListener("pointermove", onPointer);
      const onResize = () => scene.resize();
      window.addEventListener("resize", onResize);

      setReady(true);
      cleanup = () => {
        introTween.kill();
        st.kill();
        io.disconnect();
        section.removeEventListener("pointermove", onPointer);
        window.removeEventListener("resize", onResize);
        scene.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [use3D]);

  const pinned = use3D === true;

  return (
    <section
      ref={sectionRef}
      className={cn("relative bg-background", pinned ? "h-[260vh]" : "")}
      style={{ ["--hero-p" as string]: 0 }}
    >
      <div className={cn("overflow-hidden", pinned ? "sticky top-0 h-[100svh]" : "relative min-h-[92svh]")}>
        {/* 모눈 도면지 — 조명이 켜질수록 옅어진다 */}
        <div aria-hidden className="blueprint-grid absolute inset-0" />

        {/* 3D 장면 */}
        {pinned && (
          <canvas
            ref={canvasRef}
            aria-hidden
            className={cn(
              "absolute bottom-0 left-0 h-[52%] w-full transition-opacity duration-1000 lg:left-auto lg:right-0 lg:top-0 lg:h-full lg:w-[62%] lg:[mask-image:linear-gradient(to_right,transparent,black_22%)]",
              ready ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {/* 3D를 못 돌리는 기기 — 완성된 공간 사진 한 장 */}
        {use3D === false && (
          <div className="absolute inset-x-5 bottom-6 h-[42%] overflow-hidden rounded-2xl shadow-2xl shadow-foreground/15 lg:inset-y-24 lg:left-auto lg:right-10 lg:h-auto lg:w-[52%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero/hero.jpg" alt="조명이 켜진 매장 공간 예시" className="h-full w-full object-cover" />
          </div>
        )}

        {/* 글 — 서버 렌더, 3D보다 먼저 보인다 */}
        <div className="container relative z-10 flex h-full flex-col pt-28 lg:justify-center lg:pt-0">
          <div className="reveal max-w-xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              창업 첫걸음부터 매출까지
            </p>
            <h1 className="text-[2.4rem] font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-[4.2rem]">
              인테리어가 아니라,
              <br />
              장사 되는 브랜드를 만듭니다.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-foreground/70 sm:text-lg">
              국가공인 경영지도사가 사업 계획부터 공간·시공까지 한 흐름으로.
              <br className="hidden sm:block" /> 창업 첫걸음부터 매출까지, 한 곳에서.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link href="#apply" className={buttonVariants({ size: "lg" })}>
                무료 상담 문의
              </Link>
              {/* 아직 상담할 단계가 아닌 방문자(대부분 글로 들어온다)에게 주는 낮은 문턱 */}
              <Link
                href="/diagnosis"
                className="border-b border-foreground/40 pb-1 text-base transition-colors hover:border-primary hover:text-primary"
              >
                1분 컨셉 진단
              </Link>
            </div>
          </div>
        </div>

        {/* 단계 표시 — 장면이 지금 무엇을 보여주는지 */}
        {pinned && (
          <ol className="absolute bottom-6 left-0 right-0 z-10 hidden justify-end gap-8 px-10 lg:flex">
            {PHASES.map((ph, i) => (
              <li
                key={ph.n}
                className={cn(
                  "max-w-[13rem] transition-all duration-500",
                  i === phase ? "opacity-100" : "opacity-35"
                )}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-xs tabular-nums text-primary">{ph.n}</span>
                  <span className="font-serif text-2xl font-semibold">{ph.t}</span>
                </div>
                <p className="mt-1 text-sm leading-snug text-foreground/70">{ph.d}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
