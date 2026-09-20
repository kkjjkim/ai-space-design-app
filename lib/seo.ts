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
    // 별칭에 한글 브랜드명을 먼저 둔다 — 검색엔진이 "브랜드각 = 이 사업자"로 묶게.
    alternateName: [site.brandNameKo, site.brandName],
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
    // 자격·면허 — 화면(회사·신뢰 페이지)에 이미 쓰인 문구를 기계가 읽는 형식으로 옮긴 것.
    // 새로운 주장을 추가하지 않는다.
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "국가공인 자격",
        name: "국가공인 경영지도사",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "면허",
        name: "실내건축공사업 면허",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "정부 인정",
        name: "정부 인정 R&D 전담부서",
      },
    ],
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
    name: site.brandNameKo,
    alternateName: site.brandName,
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
    author: { "@type": "Organization", name: site.brandNameKo },
    // 감수 표기는 직함까지만 (실명 비공개 — 대표님 결정).
    reviewedBy: { "@type": "Person", name: "국가공인 경영지도사" },
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

// 빵부스러기 — 검색 결과에 "홈 > 인사이트 > 글제목" 경로가 뜨게 한다.
export function breadcrumbLd(
  trail: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "홈", path: "/" }, ...trail].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path === "/" ? "" : it.path}`,
    })),
  };
}

// 인사이트 전체 — 낱개 글이 아니라 "이 브랜드가 운영하는 콘텐츠 묶음"으로 인식시킨다.
export function blogLd(
  posts: { slug: string; title: string; description: string; date: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${site.url}/insights#blog`,
    name: `${site.brandNameKo} 인사이트`,
    description: "창업·브랜드·공간에 대한 실무 정보.",
    url: `${site.url}/insights`,
    inLanguage: "ko-KR",
    publisher: { "@id": `${site.url}/#business` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      url: `${site.url}/insights/${p.slug}`,
    })),
  };
}

// 질문 한 건을 담은 페이지(QAPage) — /answers/[slug] 용.
// FAQPage 는 "여러 문답이 모인 페이지", QAPage 는 "질문 하나에 답하는 페이지"다.
// 답변 엔진(챗지피티·퍼플렉시티 등)은 질문이 제목이고 답이 본문인 이 형식을 그대로 인용한다.
export function qaPageLd(a: {
  slug: string;
  question: string;
  askedAs: string[];
  answerText: string;
  image: string;
  keywords: string[];
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    inLanguage: "ko-KR",
    mainEntity: {
      "@type": "Question",
      name: a.question,
      // 같은 질문의 다른 표현 — 어떤 말투로 물어도 이 페이지가 걸리게.
      alternateName: a.askedAs,
      text: a.question,
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: a.answerText,
        url: `${site.url}/answers/${a.slug}`,
        author: { "@id": `${site.url}/#business` },
      },
    },
    image: abs(a.image),
    keywords: a.keywords.join(", "),
    publisher: { "@id": `${site.url}/#business` },
  };
}

// 목록 페이지의 항목 순서를 기계가 읽게 한다 (질문 허브 목록).
export function itemListLd(
  name: string,
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: `${site.url}${it.path}`,
    })),
  };
}
