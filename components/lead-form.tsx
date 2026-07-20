"use client";

import { useRef, useState } from "react";
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

export function LeadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Form>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Turnstile 토큰 (위젯이 폼에 주입하는 hidden 입력)
      const captchaToken =
        formRef.current?.querySelector<HTMLInputElement>(
          '[name="cf-turnstile-response"]'
        )?.value || "";
      if (TURNSTILE_SITE_KEY && !captchaToken) {
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
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "신청 중 문제가 발생했습니다.");
      router.push("/complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "잠시 후 다시 시도해주세요.");
      setLoading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-5">
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

      {/* 봇 방지 캡차 (사이트 키 있을 때만 표시) */}
      {TURNSTILE_SITE_KEY && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="afterInteractive"
          />
          <div
            className="cf-turnstile"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-theme="auto"
          />
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
      </div>
    </form>
  );
}
