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
  url: "https://www.brandgak.com",
  // 공유·검색 미리보기 썸네일 (카톡/문자/구글). public 경로.
  ogImage: "/hero/hero.jpg",
  // 검색 키워드 (전국·업종·서비스 조합)
  keywords: [
    "창업 컨설팅",
    "브랜드 컨설팅",
    "공간 디자인",
    "인테리어 컨설팅",
    "매장 인테리어",
    "레스토랑 인테리어",
    "카페 인테리어",
    "상업 공간 인테리어",
    "공간 브랜딩",
    "프리미엄 인테리어 시공",
    "경영지도사",
  ],
  // 검색엔진 사이트 소유확인 코드 (있으면 넣기, 없으면 빈 값)
  verification: {
    // Google Search Console 인증 코드 (여러 속성 지원 — brandgak.com + 기존 vercel.app)
    google: [
      "MkC2zgMQQbj-Wo07wg5iAa6Hvcc5pfhYu_rK49YHOgk", // www.brandgak.com
      "CiLGc9VaMh8Sn8RLoXDCaw6uMsz4R8gN816SI3XwQ_U", // 기존 vercel.app
    ],
    // 네이버 서치어드바이저 사이트 확인 코드 (여러 사이트 지원)
    naver: [
      "8141454da817137204d585651bb68d6e94d373a1", // www.brandgak.com
      "3d429b597536edad2479d872dfc7e3109fdf5a91", // 기존 vercel.app
    ],
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
  // 소셜/외부 프로필 (브랜드각 본인 계정이 생기면 여기에 넣으면 푸터+sameAs 자동 연결).
  // 지금은 브랜드각 소유 계정이 없어 비워둔다. (타 브랜드 계정을 넣으면 SEO 정체성이 흐려짐)
  social: {
    instagram: "",
    threads: "",
    youtube: "",
    blog: "",
  },
  // 분석/광고 추적 ID (값이 있을 때만 해당 스크립트가 로드됨).
  // 공개용 클라이언트 ID라 코드/깃에 있어도 안전 (비밀키 아님).
  analytics: {
    ga4: "", // Google Analytics 4 측정 ID (G-XXXXXXXXXX)
    googleAdsId: "", // Google Ads 전환 ID (AW-XXXXXXXXXX)
    googleAdsLabel: "", // Google Ads 전환 라벨
    metaPixelId: "", // Meta(페북·인스타) 픽셀 ID
  },
  // 상담 알림 메일 제목 앞에 붙는 프로젝트 식별 태그.
  // 여러 프로젝트를 운영할 때 메일함에서 어느 사이트에서 온 신청인지 구분하기 위함.
  mailTag: "브랜드각",
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
  { href: "/insights", label: "인사이트" },
  { href: "/company", label: "회사·신뢰" },
  { href: "/#apply", label: "상담 신청" },
] as const;

export const CTA_LABEL = "무료 상담 문의";
