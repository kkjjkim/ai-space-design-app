"use client";

// 인쇄 / PDF 저장 — 브라우저 인쇄 창에서 "PDF로 저장"을 고르면 파일로 남는다.
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium hover:border-foreground/40"
    >
      인쇄 · PDF로 저장
    </button>
  );
}
