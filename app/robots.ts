import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// 답변 엔진(챗지피티·퍼플렉시티·클로드 등)이 우리 글을 읽고 인용하려면
// 그 회사의 크롤러가 사이트를 읽을 수 있어야 한다.
// 기본 규칙("*")으로도 이미 허용되지만, 이름을 적어 두는 이유는 두 가지다.
// 1) 나중에 누가 전체를 막아도 이 크롤러들은 의도적으로 열어둔 것임이 남는다.
// 2) 학습·검색 용도를 나눠 쓰는 크롤러(GPTBot / OAI-SearchBot 등)를 따로 관리할 수 있다.
//
// 콘텐츠를 학습에 쓰이는 것을 원하지 않게 되면 여기서 해당 크롤러만 disallow 로 바꾸면 된다.
const ANSWER_ENGINE_BOTS = [
  "GPTBot", // OpenAI 학습
  "OAI-SearchBot", // ChatGPT 검색 색인
  "ChatGPT-User", // 사용자가 물었을 때 실시간 방문
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // 구글 AI 개요·제미나이 인용
  "Applebot-Extended",
  "meta-externalagent",
  "Bingbot", // ChatGPT 검색이 일부 기대는 색인
  "Yeti", // 네이버
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/complete", // 신청 완료 페이지는 색인 제외
      },
      {
        userAgent: ANSWER_ENGINE_BOTS,
        allow: "/",
        disallow: "/complete",
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
