"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LEAD_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  type LeadStatus,
} from "@/lib/constants";

type Lead = {
  id: string;
  name: string;
  phone: string;
  region: string | null;
  buildingType: string | null;
  areaPyeong: number | null;
  budget: string | null;
  desiredDate: string | null;
  message: string | null;
  source: string | null;
  status: string;
  memo: string | null;
  createdAt: string;
};

type Stats = {
  counts: Record<string, number>;
  total: number;
  thisMonth: number;
};

export default function AdminDashboard({
  initialStats,
}: {
  initialStats: Stats;
}) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [selected, setSelected] = useState<Lead | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const sp = new URLSearchParams();
    if (statusFilter) sp.set("status", statusFilter);
    if (q) sp.set("q", q);
    sp.set("page", String(page));
    const res = await fetch(`/api/leads?${sp.toString()}`);
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setLeads(data.items ?? []);
    setTotalPages(data.totalPages ?? 1);
    setLoading(false);
  }, [statusFilter, q, page, router]);

  useEffect(() => {
    load();
  }, [load]);

  async function refreshStats() {
    // 상태 변경 후 집계 갱신을 위해 서버 컴포넌트 데이터 재요청
    router.refresh();
  }

  async function updateStatus(id: string, status: LeadStatus) {
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status } : l))
      );
      setStats((prev) => {
        // 로컬 집계 보정
        const prevStatus = leads.find((l) => l.id === id)?.status;
        const counts = { ...prev.counts };
        if (prevStatus && counts[prevStatus] != null) counts[prevStatus] -= 1;
        counts[status] = (counts[status] ?? 0) + 1;
        return { ...prev, counts };
      });
      if (selected?.id === id) setSelected({ ...selected, status });
    }
  }

  async function saveMemo(id: string, memo: string) {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memo }),
    });
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, memo } : l)));
  }

  async function remove(id: string) {
    if (!confirm("이 상담 신청을 삭제할까요?")) return;
    const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSelected(null);
      load();
      refreshStats();
    }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  function exportCsv() {
    const header = [
      "신청일",
      "이름",
      "연락처",
      "지역",
      "건물유형",
      "평수",
      "예산",
      "희망시기",
      "유입경로",
      "상태",
      "요청사항",
    ];
    const rows = leads.map((l) => [
      new Date(l.createdAt).toLocaleString("ko-KR"),
      l.name,
      l.phone,
      l.region ?? "",
      l.buildingType ?? "",
      l.areaPyeong ?? "",
      l.budget ?? "",
      l.desiredDate ?? "",
      l.source ?? "",
      STATUS_LABELS[l.status as LeadStatus] ?? l.status,
      (l.message ?? "").replace(/\n/g, " "),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단바 */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <h1 className="text-lg font-bold">
            상담 신청 관리{" "}
            <span className="text-sm font-normal text-ink-500">Dashboard</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCsv}
              className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-medium hover:bg-gray-50"
            >
              CSV 내보내기
            </button>
            <button
              onClick={logout}
              className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-medium hover:bg-gray-50"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="전체" value={stats.total} highlight />
          <StatCard label="이번 달" value={stats.thisMonth} />
          {LEAD_STATUSES.map((s) => (
            <StatCard
              key={s}
              label={STATUS_LABELS[s]}
              value={stats.counts[s] ?? 0}
            />
          ))}
        </div>

        {/* 필터 */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="이름·연락처·지역 검색"
            className="w-56 rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none focus:border-brand-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
          >
            <option value="">전체 상태</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        {/* 테이블 */}
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-ink-500">
                <tr>
                  <th className="px-4 py-3">신청일</th>
                  <th className="px-4 py-3">이름</th>
                  <th className="px-4 py-3">연락처</th>
                  <th className="px-4 py-3">지역</th>
                  <th className="px-4 py-3">유형/평수</th>
                  <th className="px-4 py-3">예산</th>
                  <th className="px-4 py-3">상태</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-ink-500">
                      불러오는 중...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-ink-500">
                      상담 신청이 없습니다.
                    </td>
                  </tr>
                ) : (
                  leads.map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-ink-500">
                        {new Date(l.createdAt).toLocaleDateString("ko-KR", {
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 font-medium">{l.name}</td>
                      <td className="whitespace-nowrap px-4 py-3">{l.phone}</td>
                      <td className="px-4 py-3">{l.region ?? "-"}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {l.buildingType ?? "-"}
                        {l.areaPyeong ? ` / ${l.areaPyeong}평` : ""}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {l.budget ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={l.status}
                          onChange={(e) =>
                            updateStatus(l.id, e.target.value as LeadStatus)
                          }
                          className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold ${
                            STATUS_COLORS[l.status as LeadStatus] ?? ""
                          }`}
                        >
                          {LEAD_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelected(l)}
                          className="text-sm font-medium text-brand-600 hover:underline"
                        >
                          상세
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              이전
            </button>
            <span className="text-sm text-ink-500">
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              다음
            </button>
          </div>
        )}
      </div>

      {/* 상세 패널 */}
      {selected && (
        <DetailPanel
          lead={selected}
          onClose={() => setSelected(null)}
          onSaveMemo={saveMemo}
          onStatus={updateStatus}
          onDelete={remove}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-brand-200 bg-brand-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="text-xs text-ink-500">{label}</div>
      <div
        className={`mt-1 text-2xl font-extrabold ${
          highlight ? "text-brand-700" : "text-ink-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function DetailPanel({
  lead,
  onClose,
  onSaveMemo,
  onStatus,
  onDelete,
}: {
  lead: Lead;
  onClose: () => void;
  onSaveMemo: (id: string, memo: string) => void;
  onStatus: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
}) {
  const [memo, setMemo] = useState(lead.memo ?? "");
  const [saved, setSaved] = useState(false);

  const rows: [string, string][] = [
    ["이름", lead.name],
    ["연락처", lead.phone],
    ["지역", lead.region ?? "-"],
    ["건물 유형", lead.buildingType ?? "-"],
    ["평수", lead.areaPyeong ? `${lead.areaPyeong}평` : "-"],
    ["예산", lead.budget ?? "-"],
    ["희망 시기", lead.desiredDate ?? "-"],
    ["유입 경로", lead.source ?? "-"],
    ["신청일시", new Date(lead.createdAt).toLocaleString("ko-KR")],
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h3 className="text-lg font-bold">상담 상세</h3>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-ink-500 hover:text-ink-900"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              상태
            </label>
            <select
              value={lead.status}
              onChange={(e) => onStatus(lead.id, e.target.value as LeadStatus)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <dl className="divide-y divide-gray-100 rounded-xl border border-gray-200">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between px-4 py-2.5 text-sm">
                <dt className="text-ink-500">{k}</dt>
                <dd className="font-medium text-right">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4">
            <div className="mb-1.5 text-sm font-medium text-ink-700">
              요청사항
            </div>
            <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-ink-700">
              {lead.message || "내용 없음"}
            </p>
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              내부 메모
            </label>
            <textarea
              value={memo}
              onChange={(e) => {
                setMemo(e.target.value);
                setSaved(false);
              }}
              className="min-h-[90px] w-full resize-y rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
              placeholder="통화 내용, 다음 일정 등을 기록하세요."
            />
            <button
              onClick={() => {
                onSaveMemo(lead.id, memo);
                setSaved(true);
              }}
              className="mt-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              {saved ? "저장됨 ✓" : "메모 저장"}
            </button>
          </div>

          <div className="mt-8 flex gap-2">
            <a
              href={`tel:${lead.phone}`}
              className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-700"
            >
              전화 걸기
            </a>
            <button
              onClick={() => onDelete(lead.id)}
              className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
