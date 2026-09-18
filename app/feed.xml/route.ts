import { site } from "@/lib/site";
import { getAllInsights } from "@/lib/insights";

// RSS 피드. 네이버 서치어드바이저·구글이 새 글을 빨리 잡아가는 통로다.
// 사이트맵은 "어떤 주소가 있나", RSS는 "무엇이 새로 올라왔나"를 알린다.

// XML 안에서 의미를 갖는 문자를 이스케이프한다. (제목에 &, < 가 들어와도 피드가 깨지지 않게)
const esc = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function GET() {
  const posts = getAllInsights();
  const updated = posts[0]?.date;

  const items = posts
    .map((p) => {
      const url = `${site.url}/insights/${p.slug}`;
      // date 는 YYYY-MM-DD 라 UTC 자정으로 해석된다. RFC-822 형식으로 변환.
      const pubDate = p.date ? new Date(`${p.date}T00:00:00Z`).toUTCString() : "";
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(p.description)}</description>
      <category>${esc(p.category)}</category>${pubDate ? `\n      <pubDate>${pubDate}</pubDate>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.brandNameKo)} 인사이트</title>
    <link>${site.url}/insights</link>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>창업·브랜드·공간 디자인에 관한 실전 인사이트.</description>
    <language>ko</language>${
      updated
        ? `\n    <lastBuildDate>${new Date(`${updated}T00:00:00Z`).toUTCString()}</lastBuildDate>`
        : ""
    }
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      // 검색엔진 수집기가 자주 들르므로 1시간 캐시.
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
