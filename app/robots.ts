import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/complete", "/studio"], // 완료 페이지·비공개 제작 도구는 색인 제외
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
