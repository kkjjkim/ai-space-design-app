"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { canRun3D } from "@/lib/motion";
import { cn } from "@/lib/utils";

// 첫 화면 — "도면이 가게가 된다" (대표 효과 1, docs/redesign-2026-10.md).
// 같은 구도의 사진 3장(펜 도면 → 조명 꺼진 낮 → 불 켜진 저녁)을 셰이더로 잇는다.
// 1차(10/9)는 코드로 쌓은 상자 모형이었는데 "장난감 같다"는 대표 피드백으로 실사 사진 방식으로 교체.
// 글(h1·버튼)은 서버에서 바로 그려지고, three.js 는 그 뒤에 동적으로 불러온다.
// 3D를 못 돌리는 기기(움직임 줄이기·저사양·WebGL 없음)는 고정 없이 저녁 사진 한 장으로 대체.

const IMG = {
  sketch: "/hero/stage-sketch",
  day: "/hero/stage-day",
  night: "/hero/stage-night",
};
// 사진 속 주인공(카운터·조명)이 오른쪽에 있다 → 세로 화면에서 잘라낼 때 그쪽을 남긴다.
const FOCUS_X = 0.56;
const PAPER = "#f3eee6";

const PHASES = [
  { n: "01", t: "선", d: "되는 장사인지, 숫자로 먼저 그립니다" },
  { n: "02", t: "면", d: "컨셉이 공간의 재료와 동선이 됩니다" },
  { n: "03", t: "빛", d: "불이 켜진 뒤의 매출까지 함께 봅니다" },
];

export function BlueprintHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // null = 아직 판단 전(서버 렌더와 같게), true/false = 판단 후
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
      const [{ createHeroShaderScene }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("./hero-shader-scene"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      // 화면 폭에 맞는 크기의 사진을 쓴다(휴대폰에 2560px 를 보내지 않게).
      const width = window.innerWidth * Math.min(window.devicePixelRatio || 1, 1.5);
      const size = width > 1700 ? 2560 : width > 1100 ? 1920 : 1280;
      const scene = await createHeroShaderScene(
        canvas,
        {
          sketch: `${IMG.sketch}-${size}.webp`,
          day: `${IMG.day}-${size}.webp`,
          night: `${IMG.night}-${size}.webp`,
        },
        { focusX: FOCUS_X, paper: PAPER }
      ).catch(() => null);
      if (disposed) {
        scene?.dispose();
        return;
      }
      if (!scene) {
        setUse3D(false); // 사진을 못 불러오면 정지 화면으로
        return;
      }

      const intro = { p: 0 };
      let scrollP = 0;
      const update = () => {
        // 처음엔 스크롤 없이도 도면이 그려지고(0→0.3), 스크롤이 그다음을 이어간다.
        const p = scrollP > 0 ? Math.max(intro.p, 0.3 + scrollP * 0.7) : intro.p;
        scene.setProgress(p);
        section.style.setProperty("--hero-p", p.toFixed(3));
        // 불이 켜지면 종이색 → 어둠, 차콜 글자 → 밝은 글자로 함께 바뀐다
        const night = Math.min(1, Math.max(0, (p - 0.74) / 0.2));
        section.style.setProperty("--night", night.toFixed(3));
        setPhase(p < 0.33 ? 0 : p < 0.7 ? 1 : 2);
      };
      const introTween = gsap.to(intro, { p: 0.3, duration: 2.6, ease: "power2.inOut", delay: 0.1, onUpdate: update });

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

      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) scene.start();
        else scene.stop();
      });
      io.observe(section);

      const onPointer = (e: PointerEvent) => {
        const r = section.getBoundingClientRect();
        scene.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
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
  // 정지 화면은 "3D 못 쓴다"가 확정된 기기만. 판단 전(서버 렌더)은 3D와 같은 종이 화면으로 시작해 깜빡임이 없게.
  const isStatic = use3D === false;

  return (
    <section
      ref={sectionRef}
      className={cn("relative bg-background", pinned ? "h-[280vh]" : "")}
      style={{ ["--hero-p" as string]: 0, ["--night" as string]: 0 }}
    >
      <div className={cn("overflow-hidden", pinned ? "sticky top-0 h-[100svh]" : "relative min-h-[92svh]")}>
        {/* 3D 기기는 빈 종이에서 시작, 정지 기기(그리고 판단 전 서버 렌더)는 완성된 저녁 사진 */}
        {!isStatic ? (
          <div aria-hidden className="absolute inset-0" style={{ background: PAPER }} />
        ) : (
          <picture>
            <source media="(max-width: 767px)" srcSet={`${IMG.night}-1280.webp`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG.night}-1920.webp`}
              alt="조명이 켜진 매장 공간 예시"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: `${FOCUS_X * 100}% 50%` }}
              fetchPriority="high"
            />
          </picture>
        )}

        {pinned && (
          <canvas
            ref={canvasRef}
            aria-hidden
            className={cn(
              "absolute inset-0 h-full w-full transition-opacity duration-700",
              ready ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {/* 글 가독성 — 왼쪽(휴대폰은 위쪽)에 그라데이션. 낮엔 종이색, 불이 켜지면 어둠으로 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f3eee6] via-[#f3eee6]/75 to-transparent md:bg-gradient-to-r md:from-[#f3eee6]/95 md:via-[#f3eee6]/50"
          style={{ opacity: isStatic ? 0 : "calc(1 - var(--night))" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#120e0b]/85 via-[#120e0b]/45 to-transparent md:bg-gradient-to-r md:from-[#120e0b]/80 md:via-[#120e0b]/35"
          style={{ opacity: isStatic ? 1 : "var(--night)" }}
        />

        {/* 글 — 서버 렌더, 3D보다 먼저 보인다. 색은 --night 에 따라 차콜 ↔ 아이보리 */}
        <div
          className="container relative z-10 flex h-full flex-col pt-28 md:justify-center md:pt-0"
          style={{
            color: isStatic
              ? "hsl(var(--background))"
              : "color-mix(in srgb, hsl(var(--background)) calc(var(--night) * 100%), hsl(var(--foreground)))",
          }}
        >
          <div className="reveal max-w-xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              창업 첫걸음부터 매출까지
            </p>
            <h1 className="text-[2.4rem] font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-[4.2rem]">
              인테리어가 아니라,
              <br />
              장사 되는 브랜드를 만듭니다.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed opacity-80 sm:text-lg">
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
                className="border-b border-current pb-1 text-base opacity-90 transition-colors hover:border-primary hover:text-primary"
              >
                1분 컨셉 진단
              </Link>
            </div>
          </div>
        </div>

        {/* 단계 표시 — 장면이 지금 무엇을 보여주는지 */}
        {pinned && (
          <ol
            className="absolute bottom-7 left-0 right-0 z-10 hidden gap-10 px-10 md:flex"
            style={{ color: "color-mix(in srgb, hsl(var(--background)) calc(var(--night) * 100%), hsl(var(--foreground)))" }}
          >
            {PHASES.map((ph, i) => (
              <li
                key={ph.n}
                className={cn("max-w-[14rem] transition-opacity duration-500", i === phase ? "opacity-100" : "opacity-40")}
              >
                <div className="mb-2 h-px w-full" style={{ backgroundColor: "color-mix(in srgb, currentColor 20%, transparent)" }}>
                  <div
                    className="h-px bg-primary transition-[width] duration-500"
                    style={{ width: i < phase ? "100%" : i === phase ? "55%" : "0%" }}
                  />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs tabular-nums text-primary">{ph.n}</span>
                  <span className="text-xl font-semibold">{ph.t}</span>
                </div>
                <p className="mt-1 text-sm leading-snug opacity-75">{ph.d}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
