// 움직임 공통 판단 — 어떤 기기에서 무거운 효과(3D·부드러운 스크롤)를 켤지 한 곳에서 정한다.
// 원칙(전역 지침 5번): 움직임 줄이기 설정·약한 휴대폰·데이터 절약 모드에선 정지 화면으로 대체.

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

// 3D 장면을 돌려도 되는 기기인가.
export function canRun3D(): boolean {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData) return false;
  // 메모리·코어 정보가 없는 브라우저(사파리)는 막지 않는다 — 아이폰은 대부분 충분하다.
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4) return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}
