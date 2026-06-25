import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "신청 완료",
  robots: { index: false },
};

export default function CompletePage() {
  return (
    <section className="flex min-h-[80vh] items-center">
      <div className="container max-w-xl py-32 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="mt-8 text-3xl font-semibold md:text-4xl">
          신청 완료됐습니다.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-foreground/70">
          1~2일 안에 연락드릴게요. 그동안 머릿속 구상을 편하게 정리해 두세요.
        </p>
        <Link
          href="/"
          className={buttonVariants({ variant: "outline", className: "mt-10" })}
        >
          홈으로 돌아가기
        </Link>
      </div>
    </section>
  );
}
