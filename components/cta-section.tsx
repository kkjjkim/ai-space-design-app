import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

// 서브 페이지 끝마다 두는 신청 진입점 (모든 페이지에 "무료 상담" 진입점).
// 전환 핵심이라 모션으로 숨기지 않고 항상 노출한다. 홈 첫 화면의 저녁 장면으로 이야기를 닫는다.
export function CtaSection() {
  return (
    <section className="relative isolate overflow-hidden bg-foreground text-background">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/stage-night-1920.webp"
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55"
        style={{ objectPosition: "60% 50%" }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-[#120e0b]/95 via-[#120e0b]/70 to-[#120e0b]/30" />
      <div className="container py-28 md:py-36">
        <div className="max-w-2xl">
          <h2 className="font-display text-[2rem] font-semibold leading-[1.25] tracking-[-0.02em] sm:text-5xl">
            잘되는 가게는,
            <br />
            공사 전에 정해집니다.
          </h2>
          <p className="mt-6 max-w-lg text-[1.0625rem] leading-[1.8] text-background/75">
            머릿속 구상만 들고 오세요. 자리·예산·컨셉부터 같이 잡고, 진행 여부는 그다음에 정하시면 됩니다.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/#apply" className={buttonVariants({ size: "lg" })}>
              무료 상담 문의
            </Link>
            <Link
              href="/diagnosis"
              className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-background/90 hover:text-primary"
            >
              1분 컨셉 진단
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
