// 사이트 공통 설정. 브랜드명·숫자 등 PRD 의 [ ] 자리는 지어내지 않고 플레이스홀더로 둔다.
// (AGENTS.md 7번 / PRD 규칙)

export const site = {
  // 브랜드명 (사업자명 기반). 원하면 "폴앤마리" 등으로 교체 가능.
  brandName: "PAUL & MARIE",
  tagline: "인테리어가 아니라, 장사 되는 브랜드를 만듭니다.",
  description:
    "국가공인 경영지도사의 사업 기획 + 백화점·명품 매장을 시공한 디자인드비. 창업 첫걸음부터 매출까지, 한 곳에서.",
  // 히어로 배경 영상 URL (방문자 브라우저가 직접 로드). 비우면 hero.jpg + 슬로우줌으로 폴백.
  // ⚠️ 현재는 Higgsfield CDN 직링크 — 영구 보관용으로는 추후 자체 호스팅/저장소 파일로 교체 권장.
  heroVideoUrl:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3ENGcOxBKgSEY8wEkyt8qggU2YN/hf_20260625_144942_421da280-a4f3-4edb-b613-8d563c31966a.mp4",
  // 운영자가 채울 실적 숫자 — 지어내지 않는다.
  stats: {
    completed: "[ ]", // 완공 곳
    years: "[ ]", // 업계 경력 년
    highlight: "[성과 한 줄]",
  },
  // 사업자 정보 (푸터)
  business: {
    name: "폴앤마리",
    registration: "720-11-01939",
    address: "경기도 성남시 분당구",
    phone: "010-8533-0140",
  },
} as const;

export const navItems = [
  { href: "/", label: "홈" },
  { href: "/service", label: "서비스" },
  { href: "/concepts", label: "컨셉" },
  { href: "/company", label: "회사·신뢰" },
  { href: "/#apply", label: "상담 신청" },
] as const;

export const CTA_LABEL = "무료 상담 문의";
