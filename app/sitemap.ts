import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// 검색엔진에 전달할 페이지 목록. /complete(신청 완료)는 색인 제외라 넣지 않는다.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/service", "/concepts", "/company"];
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
