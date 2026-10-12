import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/complete"], // 신청 완료 페이지는 색인 제외
      },
      // 검색 노출에 도움 없이 요청만 쏟아내는 수집 봇 — 가치잇다 9월 요금 급증의 주원인이라 함께 막는다.
      // (구글·네이버·빙·AI 답변 엔진 봇은 막지 않는다: 노출이 생명줄)
      { userAgent: "Bytespider", disallow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
