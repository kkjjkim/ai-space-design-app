import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/complete", // 신청 완료 페이지는 색인 제외
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
