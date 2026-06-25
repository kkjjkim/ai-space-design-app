// 사이트 공통 설정. 브랜드명·숫자 등 PRD 의 [ ] 자리는 지어내지 않고 플레이스홀더로 둔다.
// (AGENTS.md 7번 / PRD 규칙)

export const site = {
  // 정해지면 교체. PRD: 브랜드명/로고 미정 → [브랜드명]
  brandName: "[브랜드명]",
  tagline: "인테리어가 아니라, 장사 되는 브랜드를 짓습니다.",
  description:
    "국가공인 경영지도사의 사업 기획 + 백화점·명품 매장을 시공한 디자인드비. 창업 첫걸음부터 매출까지, 한 곳에서.",
  // 운영자가 채울 실적 숫자 — 지어내지 않는다.
  stats: {
    completed: "[ ]", // 완공 곳
    years: "[ ]", // 업계 경력 년
    highlight: "[성과 한 줄]",
  },
} as const;

export const navItems = [
  { href: "/", label: "홈" },
  { href: "/service", label: "서비스" },
  { href: "/portfolio", label: "포트폴리오" },
  { href: "/company", label: "회사·신뢰" },
  { href: "/#apply", label: "상담 신청" },
] as const;

export const CTA_LABEL = "무료 컨셉 상담받기";
