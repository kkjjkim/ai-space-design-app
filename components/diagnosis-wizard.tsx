"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/lead-form";
import { Eyebrow } from "@/components/section";
import { QUESTIONS, diagnose, type Answers } from "@/lib/diagnosis";
import { CONCEPTS } from "@/lib/concepts";
import { cn } from "@/lib/utils";

// 진단을 끝까지 마친 사람만 GA4에 집계한다 — 중간 이탈과 구분하기 위해.
// (ConversionTracker 와 같은 방식으로 gtag 가 있을 때만 호출한다)
function trackDiagnosisComplete() {
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
  };
  w.gtag?.("event", "diagnosis_complete");
}

// 한 번에 한 질문만 보여준다. 긴 폼을 한 화면에 깔면 끝까지 안 채운다.
export function DiagnosisWizard({
  posts,
}: {
  posts: { slug: string; title: string; description: string }[];
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});

  const done = step >= QUESTIONS.length;
  const question = QUESTIONS[step];
  const progress = Math.round((step / QUESTIONS.length) * 100);

  function choose(value: string) {
    if (!question) return;
    const next = { ...answers, [question.key]: value };
    setAnswers(next);
    if (step + 1 >= QUESTIONS.length) {
      trackDiagnosisComplete();
    }
    setStep(step + 1);
  }

  function restart() {
    setAnswers({});
    setStep(0);
  }

  if (!done) {
    return (
      <div className="mx-auto max-w-2xl">
        {/* 진행 표시 — 몇 개 남았는지 보이면 끝까지 간다 */}
        <div className="mb-10">
          <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {step + 1} / {QUESTIONS.length}
            </span>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                이전
              </button>
            )}
          </div>
          <div className="h-1 w-full rounded-full bg-foreground/10">
            <div
              className="h-1 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="font-serif text-2xl leading-snug md:text-3xl">
          {question.title}
        </h2>
        {question.hint && (
          <p className="mt-3 text-muted-foreground">{question.hint}</p>
        )}

        <div className="mt-8 grid gap-3">
          {question.options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => choose(o.value)}
              className={cn(
                "group rounded-lg border border-border bg-card px-5 py-4 text-left transition-colors",
                "hover:border-primary hover:bg-primary/5"
              )}
            >
              <span className="block font-medium">{o.label}</span>
              {o.desc && (
                <span className="mt-1 block text-sm text-muted-foreground">
                  {o.desc}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const result = diagnose(answers as Answers);
  const reads = result.readSlugs
    .map((slug) => posts.find((p) => p.slug === slug))
    .filter(Boolean) as typeof posts;
  const concepts = result.conceptSlugs
    .map((slug) => CONCEPTS.find((c) => c.slug === slug))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl">
      <Eyebrow>진단 결과</Eyebrow>
      <h2 className="mt-4 font-serif text-3xl leading-snug md:text-4xl">
        {result.headline}
      </h2>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        {result.body}
      </p>

      {/* 지금 순서 */}
      <div className="mt-12 rounded-xl border border-border bg-card p-7 md:p-9">
        <h3 className="font-serif text-xl">지금 이 순서대로 하시면 됩니다</h3>
        <ol className="mt-6 grid gap-5">
          {result.steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                {i + 1}
              </span>
              <span className="leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 조심할 것 */}
      <div className="mt-6 rounded-xl border-l-4 border-primary bg-secondary/40 p-7 md:p-9">
        <h3 className="font-serif text-xl">{result.warn}</h3>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {result.warnNote}
        </p>
      </div>

      {/* 공간에서 봐야 할 것 */}
      <div className="mt-6 rounded-xl border border-border p-7 md:p-9">
        <h3 className="font-serif text-xl">이 조건에서 공간이 져야 할 몫</h3>
        <ul className="mt-6 grid gap-4">
          {result.spaceNotes.map((n, i) => (
            <li key={i} className="flex gap-3">
              <Check
                className="mt-1 h-4 w-4 shrink-0 text-primary"
                aria-hidden
              />
              <span className="leading-relaxed text-muted-foreground">{n}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 이어서 읽을 글 — 진단에서 끝내지 않고 사이트에 머물게 */}
      {reads.length > 0 && (
        <div className="mt-6 rounded-xl border border-border p-7 md:p-9">
          <h3 className="font-serif text-xl">이 상황에서 도움이 될 글</h3>
          <ul className="mt-6 grid gap-5">
            {reads.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/insights/${p.slug}`}
                  className="group block"
                >
                  <span className="font-medium underline-offset-4 group-hover:text-primary group-hover:underline">
                    {p.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 업종에 맞는 컨셉 예시 */}
      {concepts.length > 0 && (
        <div className="mt-6 rounded-xl border border-border p-7 md:p-9">
          <h3 className="font-serif text-xl">비슷한 결의 컨셉 예시</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            실제 시공 사례가 아니라 브랜드 방향을 보여주는 컨셉 예시입니다.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {concepts.map((c) => (
              <li key={c!.slug}>
                <Link
                  href={`/concepts#${c!.slug}`}
                  className="block rounded-lg border border-border px-5 py-4 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <span className="block font-medium">{c!.name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {c!.type}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 상담 — 진단 내용이 이미 담겨 있으니 연락처만 받으면 된다 */}
      <div
        id="apply"
        className="mt-14 scroll-mt-20 rounded-xl border border-border bg-card p-7 md:p-9"
      >
        <Eyebrow>무료 상담</Eyebrow>
        <h3 className="mt-4 font-serif text-2xl leading-snug md:text-3xl">
          진단 결과를 두고 더 구체적으로 봐드립니다
        </h3>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          위 내용은 일반적인 원칙입니다. 실제로는 자리·예산·업종에 따라 답이
          달라집니다. 답해주신 내용은 아래에 이미 담겨 있으니 연락처만
          남겨주시면 됩니다.
        </p>

        <div className="mt-8">
          <LeadForm defaults={{ message: result.summary }} />
        </div>
      </div>

      <div className="mt-10 text-center">
        <Button variant="ghost" onClick={restart}>
          다시 진단하기
        </Button>
      </div>
    </div>
  );
}
