// 사이트 공통 설정. 브랜드명·숫자 등 PRD 의 [ ] 자리는 지어내지 않고 플레이스홀더로 둔다.
// (AGENTS.md 7번 / PRD 규칙)

export const site = {
  // 브랜드명 (사업자명 기반). 원하면 "폴앤마리" 등으로 교체 가능.
  brandName: "PAUL & MARIE",
  tagline: "인테리어가 아니라, 장사 되는 브랜드를 만듭니다.",
  description:
    "국가공인 경영지도사의 사업 기획 + 백화점·명품 매장을 시공한 디자인드비. 창업 첫걸음부터 매출까지, 한 곳에서.",
  // 대표(정규) 도메인 — SEO는 주소를 하나로 통일해야 한다.
  // 커스텀 도메인을 사면 이 한 줄만 바꾸면 사이트맵·OG·구조화 데이터가 전부 따라 바뀐다.
  url: "https://ai-space-design-app.vercel.app",
  // 공유·검색 미리보기 썸네일 (카톡/문자/구글). public 경로.
  ogImage: "/hero/hero.jpg",
  // 검색 키워드 (지역 + 업종 + 서비스 조합)
  keywords: [
    "인테리어 컨설팅",
    "창업 컨설팅",
    "브랜드 컨설팅",
    "공간 디자인",
    "상업 공간 인테리어",
    "매장 인테리어",
    "레스토랑 인테리어",
    "카페 인테리어",
    "경영지도사",
    "분당 인테리어",
    "성남 인테리어",
  ],
  // 검색엔진 사이트 소유확인 코드 (있으면 넣기, 없으면 빈 값)
  verification: {
    google: "", // Google Search Console → HTML 태그 인증 코드
    naver: "", // 네이버 서치어드바이저 → 사이트 확인 코드
  },
  // 히어로 배경 영상 (Seedance, 비-Kling). 빈 값이면 hero.jpg + 슬로우 줌(흔들림 0)으로 폴백.
  heroVideoUrl:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3ENGcOxBKgSEY8wEkyt8qggU2YN/hf_20260703_040517_7a424d9b-85f2-47b6-af66-c04440f0e843.mp4",
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
