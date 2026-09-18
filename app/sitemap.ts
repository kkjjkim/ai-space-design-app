import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllInsights } from "@/lib/insights";
import { INDUSTRIES } from "@/lib/industries";

// 검색엔진에 전달할 페이지 목록. /complete(신청 완료)는 색인 제외라 넣지 않는다.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/diagnosis", "/service", "/concepts", "/insights", "/company"];
  const staticPages: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/diagnosis" ? 0.9 : 0.8,
  }));

  const insightPages: MetadataRoute.Sitemap = getAllInsights().map((p) => ({
    url: `${site.url}/insights/${p.slug}`,
    lastModified: p.date || undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 업종별 랜딩 — 상담을 받는 페이지라 글보다 가중치를 높게 둔다.
  const industryPages: MetadataRoute.Sitemap = INDUSTRIES.map((i) => ({
    url: `${site.url}/interior/${i.slug}`,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...staticPages, ...industryPages, ...insightPages];
}
