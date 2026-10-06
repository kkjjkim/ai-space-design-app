import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// 인사이트(칼럼) 글 = content/insights/*.md 파일.
// 프런트매터(제목·설명·카테고리·커버 등) + 마크다운 본문.
// 운영자는 이 폴더에 .md 파일을 추가하면 글이 늘어난다. (재작성/추가는 Claude 에게 요청해도 됨)

const INSIGHTS_DIR = path.join(process.cwd(), "content", "insights");

export type InsightMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  cover: string; // /public 기준 경로 (예: /concepts/sora.jpg)
  date: string; // YYYY-MM-DD
  keywords: string[];
};

export type Insight = InsightMeta & { content: string };

function readSlugs(): string[] {
  if (!fs.existsSync(INSIGHTS_DIR)) return [];
  return fs
    .readdirSync(INSIGHTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

// 예약 발행: date 가 오늘(한국 시간) 이후인 글은 없는 글로 취급한다.
// 글을 미리 여러 편 넣어두면 배포 없이 날짜가 되는 대로 공개된다.
// 이 함수를 쓰는 페이지는 revalidate 로 주기적으로 다시 만들어져야 한다.
function todayKst(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function isPublished(date: string): boolean {
  return !date || date <= todayKst();
}

export function getInsight(slug: string): Insight | null {
  const file = path.join(INSIGHTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  if (!isPublished(String(data.date ?? ""))) return null;
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    category: String(data.category ?? "인사이트"),
    cover: String(data.cover ?? "/concepts/sora.jpg"),
    date: String(data.date ?? ""),
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    content,
  };
}

// 목록용 메타 (본문 제외), 최신순.
export function getAllInsights(): InsightMeta[] {
  return readSlugs()
    .map((slug) => getInsight(slug))
    .filter((p): p is Insight => Boolean(p))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ content: _content, ...meta }) => meta);
}
