"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { BUDGET_OPTIONS } from "@/lib/leads";
import { readSource } from "@/lib/attribution";
import { site } from "@/lib/site";
import { track } from "@/lib/track";

type Form = {
  name: string;
  phone: string;
  industry: string;
  location: string;
  budget: string;
  message: string;
};

const initial: Form = {
  name: "",
  phone: "",
  industry: "",
  location: "",
  budget: "",
  message: "",
};

// 봇 방지 캡차(Cloudflare Turnstile) 사이트 키(공개용) — 없으면 캡차 없이 동작.
const TURNSTILE_SITE_KEY =
  site.analytics.turnstileSiteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
  getResponse: (id: string) => string | undefined;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

// 진단 결과처럼 앞 단계에서 이미 받은 정보는 미리 채워준다.
// 같은 걸 두 번 묻지 않아야 폼을 끝까지 채운다.
// compact: 진단 결과처럼 업종·상황을 이미 아는 자리에서 쓴다. 이름·연락처만 바로 보이고
// 나머지 칸은 접어 둔다 — "연락처만 남기면 된다"고 써 놓고 칸 6개를 보여주면 시작만 하고 나간다.
export function LeadForm({
  defaults,
  compact = false,
}: {
  defaults?: Partial<Form>;
  compact?: boolean;
} = {}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Form>({ ...initial, ...defaults });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const startedRef = useRef(false);
  // 캡차 스크립트(약 0.7MB)는 폼이 화면 가까이 오거나 손님이 입력을 시작할 때만 불러온다.
  // 예전엔 페이지를 열자마자 받아서 휴대폰 첫 화면을 느리게 했다(2026-10-11 Lighthouse).
  const [captchaWanted, setCaptchaWanted] = useState(false);
  // 손님 브라우저가 Cloudflare 확인 서버에 닿지 못하면(광고 차단·VPN 등) 위젯이 오류로 끝난다.
  // 이때는 전화·문자로 바로 연락할 수 있게 안내를 띄운다(봇 방지 자체는 약하게 하지 않는다).
  const [captchaFailed, setCaptchaFailed] = useState(false);
  useEffect(() => {
    const el = formRef.current;
    if (!TURNSTILE_SITE_KEY || !el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCaptchaWanted(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 폼을 건드렸는데 제출을 안 했다면 폼 자체가 문제다(칸이 많거나 부담스럽거나).
  // 진단 결과에서 온 폼인지 구분해야 진단→신청 전환이 따로 보인다.
  const formType = defaults?.message ? "diagnosis" : "direct";

  // 폼이 실제로 화면에 보였는지(30% 이상) 한 번만 남긴다 — "결과는 봤는데 폼까지 못 내려왔다"를 가려내려고.
  useEffect(() => {
    const el = formRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          track("form_view", { form_type: formType });
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [formType]);
  function onFirstInput() {
    setCaptchaWanted(true);
    if (startedRef.current) return;
    startedRef.current = true;
    track("form_start", { form_type: formType });
  }

  // 자동 렌더링(implicit)은 스크립트가 처음 로드될 때 한 번만 화면을 훑는다.
  // 그래서 링크로 다른 폼 페이지에 넘어가면 위젯이 안 그려져 신청이 막혔다(7/20~10/6 신청 0건).
  // 폼이 마운트될 때마다 직접 그린다.
  const renderCaptcha = useCallback(() => {
    const el = captchaRef.current;
    if (!TURNSTILE_SITE_KEY || !el || !window.turnstile) return;
    if (widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(el, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: "auto",
      "error-callback": () => {
        setCaptchaFailed(true);
        track("form_error", { form_type: "captcha", reason: "widget_error" });
      },
      callback: () => setCaptchaFailed(false),
    });
  }, []);

  useEffect(() => {
    renderCaptcha();
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [renderCaptcha]);

  function resetCaptcha() {
    // 토큰은 한 번만 쓸 수 있어서, 실패 후 다시 누르려면 새 토큰이 필요하다.
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    track("form_submit", { form_type: formType });
    try {
      const captchaToken =
        (widgetIdRef.current &&
          window.turnstile?.getResponse(widgetIdRef.current)) ||
        "";
      // 위젯이 연결 실패로 확정된 손님은 캡차 없이 접수(서버가 [캡차 미확인]으로 표시) — 2026-10-11 대표 결정
      const captchaUnavailable = Boolean(TURNSTILE_SITE_KEY && !captchaToken && captchaFailed);
      if (TURNSTILE_SITE_KEY && !captchaToken && !captchaUnavailable) {
        track("form_error", { form_type: formType, reason: "captcha_missing" });
        setError("잠시만요, 봇 방지 확인이 끝나면 다시 눌러주세요.");
        setLoading(false);
        return;
      }

      const source = readSource();
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source,
          company_website: honeypotRef.current?.value || "", // 허니팟
          captchaToken,
          captchaUnavailable,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        track("form_error", {
          form_type: formType,
          reason: `http_${res.status}`,
        });
        throw new Error(data.error || "신청 중 문제가 발생했습니다.");
      }
      router.push("/complete");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "잠시 후 다시 시도해주세요.",
      );
      setLoading(false);
      resetCaptcha();
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onInput={onFirstInput}
      className="grid gap-5"
    >
      {/* 허니팟 — 사람 눈에 안 보이는 칸. 봇이 채우면 서버가 폐기한다. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="company_website">회사명 (입력하지 마세요)</label>
        <input
          ref={honeypotRef}
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="name">
          이름 <span className="text-primary">*</span>
        </Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="성함을 적어주세요"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">
          연락처 <span className="text-primary">*</span>
        </Label>
        <Input
          id="phone"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="010-1234-5678"
          inputMode="tel"
          required
        />
      </div>

      {compact && form.industry && (
        <p className="text-sm text-muted-foreground">
          업종 <b className="font-medium text-foreground">{form.industry}</b> · 진단에서 답하신 내용이 함께 전달됩니다.
        </p>
      )}

      {/* compact 에서는 아래 칸들을 접어 둔다. 열지 않아도 제출된다. */}
      <details className={compact ? "group" : "contents"} open={!compact || undefined}>
        {compact && (
          <summary className="cursor-pointer list-none text-sm font-medium text-foreground/70 underline-offset-4 hover:text-primary hover:underline">
            위치·평수·예산도 적어두기 (선택)
          </summary>
        )}
        <div className={compact ? "mt-5 grid gap-5" : "contents"}>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="industry">업종</Label>
          <Input
            id="industry"
            value={form.industry}
            onChange={(e) => set("industry", e.target.value)}
            placeholder="예: 카페, 레스토랑, 베이커리"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">매장 위치·평수</Label>
          <Input
            id="location"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="예: 서울 성수동 / 40평"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="budget">예산대 (선택)</Label>
        <Select
          id="budget"
          value={form.budget}
          onChange={(e) => set("budget", e.target.value)}
        >
          <option value="">선택 안 함</option>
          {BUDGET_OPTIONS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">하고 싶은 가게 한 줄</Label>
        <Textarea
          id="message"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder='"이런 가게 하고 싶다" 한마디면 충분해요.'
        />
      </div>
        </div>
      </details>

      {/* 봇 방지 캡차 (사이트 키 있을 때만 표시) */}
      {TURNSTILE_SITE_KEY && (
        <>
          {captchaWanted && (
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
              strategy="afterInteractive"
              onReady={renderCaptcha}
            />
          )}
          <div ref={captchaRef} />
          {captchaFailed && (
            <p className="rounded-md bg-secondary px-4 py-3 text-sm leading-relaxed text-foreground/80">
              봇 방지 확인이 이 브라우저에서 연결되지 않고 있어요. 그대로 제출하셔도 접수됩니다. 불편하시면{" "}
              <a href={`tel:${site.business.phone}`} className="font-semibold text-foreground underline underline-offset-4">
                {site.business.phone}
              </a>
              로 전화·문자 주시면 바로 연락드립니다.
            </p>
          )}
        </>
      )}

      {error && (
        <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "보내는 중…" : "무료 상담 문의"}
        </Button>
        {/* PRD 원문 — 남기기 전의 마지막 망설임(영업 전화·계약 압박)을 없앤다 */}
        <p className="mt-3 text-center text-sm text-muted-foreground">
          영업 전화 없음 · 상담 후 결정은 자유
        </p>
      </div>
    </form>
  );
}
