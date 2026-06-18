import Link from "next/link";
import LeadForm from "@/components/LeadForm";

const FEATURES = [
  {
    icon: "📐",
    title: "맞춤 설계",
    desc: "공간과 라이프스타일을 분석해 1:1 맞춤 디자인을 제안합니다.",
  },
  {
    icon: "💰",
    title: "투명한 견적",
    desc: "불필요한 비용 없이 항목별로 명확한 견적을 제공합니다.",
  },
  {
    icon: "🛠️",
    title: "책임 시공",
    desc: "전 과정 직영 시공과 A/S로 끝까지 책임집니다.",
  },
  {
    icon: "⏱️",
    title: "빠른 상담",
    desc: "신청 후 영업일 1일 이내 전문 디자이너가 연락드립니다.",
  },
];

const STATS = [
  { value: "1,200+", label: "누적 시공" },
  { value: "4.9/5", label: "고객 만족도" },
  { value: "15년", label: "업력" },
  { value: "100%", label: "직영 시공" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* 헤더 */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="text-lg font-extrabold tracking-tight">
          공간<span className="text-brand-600">디자인</span>
        </div>
        <a
          href="#apply"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          상담 신청
        </a>
      </header>

      {/* 히어로 + 폼 */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-8 lg:grid-cols-2 lg:gap-16 lg:pt-16">
        <div>
          <span className="inline-block rounded-full bg-brand-100 px-3.5 py-1.5 text-sm font-semibold text-brand-700">
            인테리어 무료 상담
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            당신의 공간을
            <br />
            <span className="text-brand-600">가장 당신답게.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            아파트·주택·상가 인테리어 전문 디자인 스튜디오.
            <br className="hidden sm:block" />
            지금 신청하면 맞춤 견적을 무료로 받아보실 수 있어요.
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-white/70 p-4 text-center ring-1 ring-black/5"
              >
                <dt className="text-2xl font-extrabold text-brand-600">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs text-ink-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div id="apply" className="scroll-mt-20">
          <LeadForm />
        </div>
      </section>

      {/* 특징 */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-center text-3xl font-extrabold tracking-tight">
          왜 공간디자인일까요?
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-white p-6 ring-1 ring-black/5 transition hover:shadow-lg"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="rounded-3xl bg-brand-900 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-extrabold">
            지금 바로 무료 상담을 시작하세요
          </h2>
          <p className="mt-3 text-brand-100">
            상담은 무료이며, 어떤 비용도 청구되지 않습니다.
          </p>
          <a
            href="#apply"
            className="mt-8 inline-block rounded-xl bg-white px-7 py-3.5 font-bold text-brand-700 transition hover:bg-brand-50"
          >
            무료 상담 신청하기
          </a>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-gray-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-ink-500 sm:flex-row">
          <p>© {new Date().getFullYear()} 공간디자인. All rights reserved.</p>
          <Link href="/admin" className="hover:text-brand-600">
            관리자
          </Link>
        </div>
      </footer>
    </main>
  );
}
