import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllInsights } from "@/lib/insights";

// 검색엔진에 전달할 페이지 목록. /complete(신청 완료)는 색인 제외라 넣지 않는다.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/service", "/concepts", "/insights", "/company"];
  const staticPages: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const insightPages: MetadataRoute.Sitemap = getAllInsights().map((p) => ({
    url: `${site.url}/insights/${p.slug}`,
    lastModified: p.date || undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...insightPages];
}
