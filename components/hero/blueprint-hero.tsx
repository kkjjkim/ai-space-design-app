"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { canRun3D } from "@/lib/motion";
import { cn } from "@/lib/utils";

// 첫 화면 — "도면이 가게가 된다" (대표 효과 1, docs/redesign-2026-10.md).
// 같은 구도의 사진 3장(펜 도면 → 조명 꺼진 낮 → 불 켜진 저녁)을 셰이더로 잇는다.
// 1차(10/9)는 코드로 쌓은 상자 모형이었는데 "장난감 같다"는 대표 피드백으로 실사 사진 방식으로 교체.
// 글(h1·버튼)과 도면 사진은 서버에서 바로 그려지고, three.js 는 그 뒤에 동적으로 불러와 사진 위에 겹친다.
// 10/23 이전엔 빈 종이에서 도면을 그리며 시작했는데, 휴대폰은 3D 준비(대기·코드·사진 3장)까지 몇 초간
// 글만 보여 "배경이 늦게 뜬다"는 대표 피드백 → 도면이 다 그려진 장면(0.30)을 사진으로 먼저 보여 준다.
// 3D를 못 돌리는 기기(움직임 줄이기·저사양·WebGL 없음)는 고정 없이 저녁 사진 한 장으로 대체.

const IMG = {
  sketch: "/hero/stage-sketch",
  day: "/hero/stage-day",
  night: "/hero/stage-night",
};
// 사진 속 주인공(카운터·조명)이 오른쪽에 있다 → 세로 화면에서 잘라낼 때 그쪽을 남긴다.
const FOCUS_X = 0.56;
const PAPER = "#f3eee6";
// 도면이 다 그려진 진행도. 첫 화면 사진과 3D 첫 프레임이 이 장면이다.
const SKETCH_DONE = 0.3;
// 셰이더가 이 진행도에서 사진을 확대하는 비율(hero-shader-scene.ts 의 zoom = 1.06 - p * 0.05)과 맞춘다.
const SKETCH_ZOOM = 1.06 - SKETCH_DONE * 0.05;

const PHASES = [
  { n: "01", t: "선", d: "경영지도사의 사업 계획" },
  { n: "02", t: "면", d: "브랜드 매장 시공팀의 설계" },
  { n: "03", t: "빛", d: "불이 켜진 뒤의 매출을 생각한 설계" },
];

export function BlueprintHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sketchImgRef = useRef<HTMLImageElement>(null);
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
      // 휴대폰은 첫 화면 글자가 다 그려진 뒤 한가할 때 3D를 시작한다(느린 기기에서 첫 화면 버벅임 방지).
      if (window.innerWidth < 768) {
        await new Promise<void>((resolve) => {
          const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
            .requestIdleCallback;
          if (ric) ric(() => resolve(), { timeout: 2500 });
          else setTimeout(resolve, 1200);
        });
        if (disposed) return;
      }
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
      // 도면은 화면에 이미 받아 둔 사진 주소를 그대로 써서 다시 받지 않는다(브라우저 캐시).
      const sketchSrc = sketchImgRef.current?.currentSrc || `${IMG.sketch}-${size}.webp`;
      const scene = await createHeroShaderScene(
        canvas,
        {
          sketch: sketchSrc,
          day: `${IMG.day}-${size}.webp`,
          night: `${IMG.night}-${size}.webp`,
        },
        { focusX: FOCUS_X, paper: PAPER, initialProgress: SKETCH_DONE }
      ).catch(() => null);
      if (disposed) {
        scene?.dispose();
        return;
      }
      if (!scene) {
        setUse3D(false); // 사진을 못 불러오면 정지 화면으로
        return;
      }

      let scrollP = 0;
      let lastNight = "";
      const update = () => {
        // 도면 완성(0.3)에서 시작해 스크롤이 공간 → 불 켜기를 이어간다.
        const p = SKETCH_DONE + scrollP * (1 - SKETCH_DONE);
        scene.setProgress(p);
        // 불이 켜지면 종이색 → 어둠, 차콜 글자 → 밝은 글자로 함께 바뀐다.
        // CSS 변수는 값이 바뀔 때만 쓴다 — 매 프레임 쓰면 글자 전체 스타일 재계산이 도면 그리는 2.6초 내내 돈다(휴대폰 CPU).
        const night = Math.min(1, Math.max(0, (p - 0.74) / 0.2)).toFixed(3);
        if (night !== lastNight) {
          lastNight = night;
          section.style.setProperty("--night", night);
        }
        setPhase(p < 0.33 ? 0 : p < 0.7 ? 1 : 2);
      };
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

      // 새로고침으로 중간부터 열린 경우도 지금 스크롤 위치의 장면으로 맞춘다.
      scrollP = st.progress;
      update();
      setReady(true);
      cleanup = () => {
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
      style={{ ["--night" as string]: 0 }}
    >
      {/* 서버 렌더·정지 화면도 100svh — 3D가 켜지며 섹션이 280vh로 늘 때 보이는 요소가 밀리지 않게(92svh였을 땐 CLS 0.08) */}
      <div className={cn("overflow-hidden", pinned ? "sticky top-0 h-[100svh]" : "relative min-h-[100svh]")}>
        {/* 3D 기기와 판단 전 서버 렌더는 도면 사진(3D 첫 프레임과 같은 장면), 정지 기기는 완성된 저녁 사진.
            도면 사진 주소 크기는 셰이더가 고르는 크기(1280/1920/2560)와 같아서 3D가 그대로 재사용한다. */}
        {!isStatic ? (
          <div aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: PAPER }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={sketchImgRef}
              src={`${IMG.sketch}-1280.webp`}
              srcSet={`${IMG.sketch}-1280.webp 1280w, ${IMG.sketch}-1920.webp 1920w, ${IMG.sketch}-2560.webp 2560w`}
              sizes="100vw"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: `${FOCUS_X * 100}% 50%`, transform: `scale(${SKETCH_ZOOM})` }}
              // fetchPriority high 로 두면 제목 글꼴보다 먼저 받아 LCP(제목)가 늦어진다 → 기본 순서.
              decoding="async"
            />
          </div>
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
          <div className="reveal max-w-2xl">
            {/* 한글 머리글은 넓은 자간을 주면 흩어져 보인다 → 짧은 금색 선 + 보통 자간 */}
            <p className="mb-7 flex items-center gap-3 text-[0.8125rem] font-medium tracking-[0.04em] text-primary">
              <span aria-hidden className="h-px w-8 bg-primary" />
              창업 컨설팅 · 브랜드 · 공간 디자인
            </p>
            <h1 className="font-display text-[2.15rem] font-semibold leading-[1.22] tracking-[-0.03em] sm:text-[3.6rem] lg:text-[4.4rem]">
              잘되는 가게는,
              <br />
              공사 전에 정해집니다.
            </h1>
            {/* 두 전문가의 분업이 한 번에 읽히게 (2026-10-09 대표 요청).
                시공 파트너의 이력은 발주처 이름 없이 "백화점·대형 쇼핑몰 브랜드 매장"으로만 쓴다. */}
            <p className="mt-7 max-w-[27rem] text-[1.0625rem] leading-[1.8] opacity-80">
              사업은 국가공인 경영지도사가, 공간은 백화점·대형 쇼핑몰 브랜드 매장을 시공해 온 팀이
              맡습니다.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="#apply" className={buttonVariants({ size: "lg" })}>
                무료 상담 문의
              </Link>
              {/* 아직 상담할 단계가 아닌 방문자(대부분 글로 들어온다)에게 주는 낮은 문턱 */}
              <Link
                href="/diagnosis"
                className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium opacity-90 transition-colors hover:text-primary"
              >
                1분 컨셉 진단
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
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
                  <span className="font-display text-xl font-semibold">{ph.t}</span>
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
