import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";

// 시네마틱 풀블리드 히어로.
// site.heroVideoUrl 이 있으면 배경 영상(방문자 브라우저가 직접 로드)을, 없으면
// 공간 이미지(/hero/hero.jpg)에 슬로우 줌/팬(Ken Burns)을 적용한다.
export function SiteHero() {
  const videoUrl = site.heroVideoUrl;

  return (
    <section className="relative isolate flex min-h-[92vh] flex-col justify-end overflow-hidden bg-foreground">
      {/* 배경 이미지 + Ken Burns (영상 로딩 전/실패 시 폴백) */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/hero.jpg"
          alt="공간 디자인 히어로"
          className="h-full w-full object-cover motion-safe:animate-kenburns"
        />
      </div>

      {/* 배경 영상 (URL 있을 때) */}
      {videoUrl && (
        <video
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero/hero.jpg"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* 가독성 오버레이 */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/40"
      />

      {/* 콘텐츠 */}
      <div className="container relative pb-16 pt-32 text-background md:pb-24">
        <div className="reveal max-w-4xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            창업 첫걸음부터 매출까지
          </p>
          <h1 className="text-[2.6rem] font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-[4.5rem]">
            인테리어가 아니라,
            <br />
            장사 되는 브랜드를 만듭니다.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-background/85">
            국가공인 경영지도사의 사업 기획 + 백화점·명품 매장을 시공한 디자인드비.
            <br />
            창업 첫걸음부터 매출까지, 한 곳에서.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href="#apply" className={buttonVariants({ size: "lg" })}>
              무료 상담 문의
            </Link>
            <Link
              href="#concepts"
              className="border-b border-background/50 pb-1 text-base text-background transition-colors hover:border-primary hover:text-primary"
            >
              컨셉 둘러보기
            </Link>
          </div>
        </div>

        <div className="mt-14 hidden items-center gap-3 text-background/60 md:flex">
          <ArrowDown className="h-5 w-5 animate-bounce" />
          <span className="text-xs uppercase tracking-[0.25em]">스크롤</span>
        </div>
      </div>
    </section>
  );
}
