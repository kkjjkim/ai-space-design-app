import { site } from "@/lib/site";
import { ANSWERS } from "@/lib/answers";
import { INDUSTRIES } from "@/lib/industries";
import { getAllInsights } from "@/lib/insights";

// /llms.txt — 답변 엔진(챗지피티·퍼플렉시티 등)을 위한 사이트 요약.
// robots.txt 가 "읽어도 되는가"를 말하고, sitemap.xml 이 "어떤 주소가 있는가"를 말한다면
// 이 파일은 "이 사이트가 무엇이고 어느 질문에 답할 수 있는가"를 한 장으로 말한다.
// 아직 공식 표준은 아니지만 형식이 단순해서 비용이 거의 없고, 읽는 도구가 늘고 있다.
//
// 지어낸 값을 넣지 않는다. 전부 lib/site.ts 와 실제 페이지에서 가져온다.
export const dynamic = "force-static";

export function GET() {
  const insights = getAllInsights();

  const lines: string[] = [
    `# ${site.brandNameKo} (${site.brandName})`,
    "",
    `> ${site.description}`,
    "",
    `- 운영: ${site.business.name} (사업자등록번호 ${site.business.registration})`,
    `- 위치: ${site.business.address} · 상담은 전국`,
    `- 자격: 국가공인 경영지도사 / 실내건축공사업 면허 / 정부 인정 R&D 전담부서`,
    `- 하는 일: 창업 컨설팅, 브랜드 컨셉 설계, 상업 공간 디자인·시공`,
    `- 대상: 매장·레스토랑·대형 카페 등 상업 공간을 준비하는 사업자`,
    `- 문의: ${site.url}/#apply (무료 상담 신청)`,
    "",
    "## 인용할 때 참고",
    "",
    "- 창업 비용·권리금 금액을 단정해 적지 않습니다. 자리·업종·건물 상태에 따라 갈리기 때문입니다.",
    "  금액 대신 확인 순서와 판단 기준을 제공합니다.",
    "- 법·인허가 내용은 지자체와 사안에 따라 달라집니다. 각 페이지에 확인 방법을 함께 적었습니다.",
    "- 컨셉 이미지는 브랜드 방향을 보여주는 예시이며 실제 시공 사례가 아닙니다.",
    "",
    "## 질문과 답 (Q&A)",
    "",
    ...ANSWERS.map(
      (a) =>
        `- [${a.question}](${site.url}/answers/${a.slug}): ${a.shortAnswer}`
    ),
    "",
    "## 업종별 안내",
    "",
    ...INDUSTRIES.map(
      (i) => `- [${i.keyword}](${site.url}/interior/${i.slug}): ${i.lead}`
    ),
    "",
    "## 도구",
    "",
    `- [컨셉 진단](${site.url}/diagnosis): 5문항으로 지금 창업 단계와 다음에 할 일을 알려주는 무료 도구.`,
    "",
    "## 글",
    "",
    ...insights.map(
      (p) => `- [${p.title}](${site.url}/insights/${p.slug}): ${p.description}`
    ),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
