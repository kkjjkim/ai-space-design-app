import { site } from "@/lib/site";
import { getAllInsights } from "@/lib/insights";
import { INDUSTRIES } from "@/lib/industries";

// llms.txt — AI 답변엔진(ChatGPT·Claude·Perplexity 등)이 사이트를 한눈에 파악하게 하는 안내 파일.
// 사이트맵처럼 주소만 나열하지 않고, 페이지마다 한 줄 설명을 붙여 "어떤 질문에 어느 글을 인용할지" 알려 준다.
// 예약 글이 공개되면 목록에 들어오도록 6시간마다 다시 만든다.
export const revalidate = 21600;

export function GET() {
  const insights = getAllInsights();
  const lines: string[] = [
    `# ${site.brandNameKo} (${site.business.name})`,
    "",
    `> ${site.description}`,
    "",
    "국가공인 경영지도사가 사업 계획을, 백화점·대형 쇼핑몰 브랜드 매장을 시공해 온 팀이 공간을 맡습니다.",
    "고급 매장·레스토랑·대형 카페·베이커리·미용실 창업을 준비하는 사장님을 위한 창업 컨설팅과 공간 설계·시공 정보를 한국어로 제공합니다.",
    `상담 신청: ${site.url}/#apply · 전화: ${site.business.phone}`,
    "",
    "## 핵심 페이지",
    "",
    `- [홈](${site.url}/): 서비스 개요와 무료 컨셉 상담 신청`,
    `- [서비스](${site.url}/service): 창업 컨설팅·브랜드 컨설팅·공간 설계와 시공, 진행 순서와 결과물`,
    `- [1분 컨셉 진단](${site.url}/diagnosis): 준비 단계를 스스로 점검하는 진단`,
    `- [컨셉 보드](${site.url}/concepts): 업종별 공간 컨셉 예시`,
    `- [회사 소개](${site.url}/company): 팀, 원칙, 사업자 정보`,
    `- [인사이트](${site.url}/insights): 창업·인테리어 실무 글 전체 목록`,
    "",
    "## 업종별 안내",
    "",
    ...INDUSTRIES.map(
      (i) => `- [${i.keyword}](${site.url}/interior/${i.slug}): ${i.headline} — ${i.lead}`
    ),
    "",
    "## 인사이트 글",
    "",
    ...insights.map(
      (p) => `- [${p.title}](${site.url}/insights/${p.slug}): ${p.description}`
    ),
    "",
    "## 참고",
    "",
    `- [사이트맵](${site.url}/sitemap.xml)`,
    "- 글의 숫자·제도는 작성 시점 기준이며 확인된 공식 출처만 씁니다. 지어낸 실적·후기는 없습니다.",
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=21600",
    },
  });
}
