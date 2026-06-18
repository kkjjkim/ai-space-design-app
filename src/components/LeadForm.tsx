"use client";

import { useState } from "react";
import { BUILDING_TYPES, BUDGET_RANGES, SOURCES } from "@/lib/constants";

type FormState = {
  name: string;
  phone: string;
  region: string;
  buildingType: string;
  areaPyeong: string;
  budget: string;
  desiredDate: string;
  message: string;
  source: string;
  agree: boolean;
};

const initialState: FormState = {
  name: "",
  phone: "",
  region: "",
  buildingType: "",
  areaPyeong: "",
  budget: "",
  desiredDate: "",
  message: "",
  source: "",
  agree: false,
};

export default function LeadForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("loading");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          areaPyeong: form.areaPyeong ? Number(form.areaPyeong) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "신청 중 오류가 발생했습니다.");
      }
      setStatus("done");
      setForm(initialState);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-black/5">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
          ✓
        </div>
        <h3 className="text-xl font-bold">상담 신청이 접수되었습니다!</h3>
        <p className="mt-2 text-ink-500">
          담당 디자이너가 영업일 기준 1일 이내에 연락드리겠습니다.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700"
        >
          추가로 신청하기
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
  const labelClass = "mb-1.5 block text-sm font-medium text-ink-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 sm:p-8"
    >
      <h3 className="text-xl font-bold">무료 견적 상담 신청</h3>
      <p className="mt-1 text-sm text-ink-500">
        1분이면 충분해요. 부담 없이 신청해보세요.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>
            이름 <span className="text-brand-600">*</span>
          </label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="홍길동"
            required
          />
        </div>
        <div>
          <label className={labelClass}>
            연락처 <span className="text-brand-600">*</span>
          </label>
          <input
            className={inputClass}
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="010-1234-5678"
            inputMode="tel"
            required
          />
        </div>
        <div>
          <label className={labelClass}>지역</label>
          <input
            className={inputClass}
            value={form.region}
            onChange={(e) => update("region", e.target.value)}
            placeholder="서울 강남구"
          />
        </div>
        <div>
          <label className={labelClass}>건물 유형</label>
          <select
            className={inputClass}
            value={form.buildingType}
            onChange={(e) => update("buildingType", e.target.value)}
          >
            <option value="">선택</option>
            {BUILDING_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>평수</label>
          <input
            className={inputClass}
            value={form.areaPyeong}
            onChange={(e) =>
              update("areaPyeong", e.target.value.replace(/[^0-9]/g, ""))
            }
            placeholder="32"
            inputMode="numeric"
          />
        </div>
        <div>
          <label className={labelClass}>예산</label>
          <select
            className={inputClass}
            value={form.budget}
            onChange={(e) => update("budget", e.target.value)}
          >
            <option value="">선택</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>희망 시공 시기</label>
          <input
            className={inputClass}
            value={form.desiredDate}
            onChange={(e) => update("desiredDate", e.target.value)}
            placeholder="예: 2개월 이내"
          />
        </div>
        <div>
          <label className={labelClass}>유입 경로</label>
          <select
            className={inputClass}
            value={form.source}
            onChange={(e) => update("source", e.target.value)}
          >
            <option value="">선택</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>요청사항</label>
          <textarea
            className={`${inputClass} min-h-[90px] resize-y`}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="원하시는 스타일, 공간, 일정 등을 자유롭게 적어주세요."
          />
        </div>
      </div>

      <label className="mt-5 flex items-start gap-2.5 text-sm text-ink-500">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          checked={form.agree}
          onChange={(e) => update("agree", e.target.checked)}
        />
        <span>
          개인정보 수집·이용(상담 목적)에 동의합니다.{" "}
          <span className="text-brand-600">*</span>
        </span>
      </label>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-5 w-full rounded-xl bg-brand-600 py-3.5 text-base font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "접수 중..." : "무료 상담 신청하기"}
      </button>
    </form>
  );
}
