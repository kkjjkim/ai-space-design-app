import { site } from "@/lib/site";

// 구조화 데이터(JSON-LD) 빌더 모음.
// 지어내지 않은 값만 쓴다 — 사업자 정보는 lib/site.ts 의 실제 값에서만 가져온다.

// 절대 URL(외부 이미지)은 그대로, 상대 경로만 사이트 도메인을 붙인다.
const abs = (path: string) =>
  path.startsWith("http") ? path : `${site.url}${path}`;

// 로컬 비즈니스(+조직) — 상호·전화·주소·업종을 기계가 읽는 형식으로.
// 로컬 검색·지도·AI 답변에서 가장 효과가 큰 스키마.
export function localBusinessLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "GeneralContractor"],
    "@id": `${site.url}/#business`,
    name: site.business.name, // 폴앤마리
    alternateName: site.brandName, // PAUL & MARIE
    description: site.description,
    url: site.url,
    image: abs(site.ogImage),
    telephone: site.business.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "성남시 분당구",
      addressRegion: "경기도",
      addressCountry: "KR",
    },
    // 본사는 분당이지만 서비스는 전국.
    areaServed: { "@type": "Country", name: "대한민국" },
    // 같은 브랜드의 외부 프로필 (있는 것만) — 검색엔진이 하나로 묶어 신뢰도 반영.
    sameAs: [
      site.social.instagram,
      site.social.threads,
      site.social.youtube,
      site.social.blog,
    ].filter(Boolean),
    knowsAbout: [
      "창업 컨설팅",
      "브랜드 컨설팅",
      "공간 디자인",
      "상업 공간 인테리어 시공",
    ],
    slogan: site.tagline,
  };
}

// 웹사이트 — 브랜드·검색 정보.
export function websiteLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.brandName,
    description: site.description,
    inLanguage: "ko-KR",
    publisher: { "@id": `${site.url}/#business` },
  };
}

// 제공 서비스 — 창업/브랜드/공간 세 갈래.
export function serviceLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: { "@id": `${site.url}/#business` },
    serviceType: "상업 공간 창업·브랜드·인테리어 컨설팅",
    areaServed: "KR",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "서비스",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "창업 컨설팅",
            description:
              "국가공인 경영지도사의 사업 기획·자금·운영 전략.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "브랜드 컨설팅",
            description: "손님을 부르는 브랜드 컨셉과 방향 설정.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "공간 디자인·시공",
            description:
              "백화점·명품 매장을 시공한 팀의 프리미엄 공간 설계·시공.",
          },
        },
      ],
    },
  };
}

// 블로그 글(Article) — 검색·AI가 "이 주제의 콘텐츠"로 인식하게.
export function articleLd(a: {
  slug: string;
  title: string;
  description: string;
  cover: string;
  date: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    image: abs(a.cover),
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: "ko-KR",
    mainEntityOfPage: `${site.url}/insights/${a.slug}`,
    author: { "@type": "Organization", name: site.brandName },
    publisher: { "@id": `${site.url}/#business` },
  };
}

// FAQ — 질문·답변. AI 답변엔진이 그대로 인용하기 좋은 포맷.
export function faqLd(
  items: { q: string; a: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}
