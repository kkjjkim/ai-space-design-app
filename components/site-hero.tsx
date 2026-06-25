import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

// 시네마틱 풀블리드 영상 히어로 (ZORGE식 레이아웃 + AvroKO 팔레트/명조).
// 영상은 /public/hero/banner.mp4 + poster.jpg 를 떨어뜨리면 자동 적용된다.
// 파일이 없으면 어두운 시네마틱 그라데이션이 폴백으로 보인다.
export function SiteHero() {
  return (
    <section className="relative flex min-h-[92vh] flex-col justify-end overflow-hidden">
      {/* 폴백 배경 (영상 없을 때 보임) */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_72%_15%,rgba(166,128,63,0.28),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_20%_90%,rgba(120,92,42,0.18),transparent_60%)]" />
        <span className="absolute bottom-4 right-5 text-[11px] tracking-wide text-background/35">
          메인 배너 영상 자리 · /hero/banner.mp4
        </span>
      </div>

      {/* 배경 영상 */}
      <video
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero/poster.jpg"
      >
        <source src="/hero/banner.mp4" type="video/mp4" />
      </video>

      {/* 가독성 오버레이 */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/35 to-black/55"
      />

      {/* 콘텐츠 */}
      <div className="container relative pb-16 pt-32 text-background md:pb-24">
        <div className="reveal max-w-4xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            창업 첫걸음부터 매출까지
          </p>
          <h1 className="text-[2.6rem] font-semibold leading-[1.1] tracking-tight sm:text-6xl lg:text-[4.5rem]">
            인테리어가 아니라,
            <br />
            장사 되는 브랜드를 짓습니다.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-background/85">
            국가공인 경영지도사의 사업 기획 + 백화점·명품 매장을 시공한
            디자인드비. 창업 첫걸음부터 매출까지, 한 곳에서.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href="#apply" className={buttonVariants({ size: "lg" })}>
              무료 컨셉 상담받기 · 1분
            </Link>
            <Link
              href="/portfolio"
              className="border-b border-background/50 pb-1 text-base text-background transition-colors hover:border-primary hover:text-primary"
            >
              포트폴리오 보기
            </Link>
          </div>
          <p className="mt-4 text-sm text-background/65">
            영업 전화 안 합니다. 방향부터 들어드려요.
          </p>
        </div>

        {/* 스크롤 큐 */}
        <div className="mt-14 hidden items-center gap-3 text-background/60 md:flex">
          <ArrowDown className="h-5 w-5 animate-bounce" />
          <span className="text-xs uppercase tracking-[0.25em]">스크롤</span>
        </div>
      </div>
    </section>
  );
}
