// 구조화 데이터(JSON-LD)를 <script>로 심는다.
// 검색엔진·AI 답변엔진(구글 AI 개요, ChatGPT, Perplexity 등)이 이 데이터를 읽어
// "성남 분당 인테리어 컨설팅" 같은 질문에 우리 업체를 인용하게 만든다. (AEO 핵심)
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
