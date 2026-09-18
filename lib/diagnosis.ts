// 컨셉 진단 — 입력을 받아 "지금 무엇부터 해야 하는지"를 돌려주는 규칙 엔진.
//
// 왜 견적이 아니라 진단인가:
// 금액을 계산하려면 단가를 지어내야 한다(AGENTS.md 7번). 진단은 지어낼 필요가 없고,
// 사이트의 핵심 주장("공사보다 컨셉이 먼저다")을 그대로 증명한다.
// 순수 함수로 둬서 UI 없이도 결과를 확인할 수 있게 한다.

export type Answers = {
  industry: string;
  stage: string;
  size: string;
  concern: string;
  target: string;
};

export type Question = {
  key: keyof Answers;
  title: string;
  hint?: string;
  options: { value: string; label: string; desc?: string }[];
};

export const QUESTIONS: Question[] = [
  {
    key: "industry",
    title: "어떤 가게를 준비하고 계신가요?",
    options: [
      { value: "cafe", label: "카페·로스터리" },
      { value: "bakery", label: "베이커리·디저트" },
      { value: "restaurant", label: "레스토랑·주점" },
      { value: "beauty", label: "미용실·네일·뷰티" },
      { value: "retail", label: "리테일 매장·쇼룸" },
      { value: "other", label: "그 외" },
    ],
  },
  {
    key: "stage",
    title: "지금 어느 단계이신가요?",
    hint: "이 답에 따라 해야 할 일의 순서가 완전히 달라집니다.",
    options: [
      { value: "idea", label: "구상만 있는 단계", desc: "자리는 아직 안 봤습니다" },
      { value: "looking", label: "자리를 보는 중", desc: "계약 전입니다" },
      { value: "contracted", label: "계약을 마쳤습니다", desc: "공사는 아직입니다" },
      { value: "preconstruction", label: "공사를 앞두고 있습니다", desc: "업체를 알아보는 중" },
      { value: "operating", label: "이미 영업 중입니다", desc: "리뉴얼을 고민 중" },
    ],
  },
  {
    key: "size",
    title: "매장 규모는 어느 정도인가요?",
    options: [
      { value: "under10", label: "10평 이하" },
      { value: "10to20", label: "10~20평" },
      { value: "20to50", label: "20~50평" },
      { value: "over50", label: "50평 이상" },
      { value: "unknown", label: "아직 모르겠습니다" },
    ],
  },
  {
    key: "target",
    title: "주로 어떤 손님을 받고 싶으신가요?",
    options: [
      { value: "local", label: "동네 단골" },
      { value: "young", label: "2030 · SNS에 올릴 사람" },
      { value: "office", label: "직장인 · 점심 수요" },
      { value: "family", label: "가족 단위" },
      { value: "premium", label: "고급 소비층" },
    ],
  },
  {
    key: "concern",
    title: "지금 가장 큰 고민은 무엇인가요?",
    options: [
      { value: "concept", label: "컨셉이 안 잡힙니다" },
      { value: "budget", label: "예산을 어떻게 나눌지 모르겠습니다" },
      { value: "trust", label: "업체를 믿어도 될지 모르겠습니다" },
      { value: "location", label: "이 자리가 맞는지 모르겠습니다" },
      { value: "sales", label: "매출이 생각만큼 안 나옵니다" },
    ],
  },
];

// ── 단계별: 지금 가장 먼저 할 일 ─────────────────────────────
const STAGE: Record<
  string,
  { headline: string; body: string; steps: string[] }
> = {
  idea: {
    headline: "자리를 보기 전에, 컨셉을 문장으로 만들 단계입니다",
    body: "이 단계에서 자리부터 보러 다니면 마음에 드는 자리에 컨셉을 끼워 맞추게 됩니다. 순서가 뒤집히면 나중에 전부 비용으로 돌아옵니다.",
    steps: [
      "누구에게 무엇을 파는 가게인지 한 문장으로 적어봅니다",
      "그 문장에 맞는 상권 조건을 먼저 정합니다",
      "조건에 맞는 자리만 보러 다닙니다",
    ],
  },
  looking: {
    headline: "계약 전이라면, 지금이 가장 중요한 시점입니다",
    body: "자리는 인테리어와 달리 계약 기간 내내 바꿀 수 없습니다. 도장을 찍기 전에 확인할 것을 확인하는 게 가장 큰 비용 절감입니다.",
    steps: [
      "시간대를 나눠 최소 세 번 직접 가봅니다",
      "건축물 용도·정화조·전기 용량·배기 조건을 서류로 확인합니다",
      "권리금이 무엇에 대한 값인지 항목별로 나눠봅니다",
    ],
  },
  contracted: {
    headline: "도면을 그리기 전에 확인할 것이 남아 있습니다",
    body: "계약은 끝났지만 공사 전이라 아직 바꿀 수 있는 게 많습니다. 여기서 놓치면 마감 후에 천장을 다시 뜯는 일이 생깁니다.",
    steps: [
      "업종에 필요한 인허가 조건을 관할 구청에 확인합니다",
      "소방·환기·전기 조건을 도면 단계에서 반영합니다",
      "공사에 들어가기 전에 컨셉을 확정합니다",
    ],
  },
  preconstruction: {
    headline: "돈이 가장 많이 새는 구간에 들어와 계십니다",
    body: "공사 분쟁은 공사 중에 생기지 않습니다. 계약할 때 안 적어둔 것이 공사 중에 터질 뿐입니다.",
    steps: [
      "공사 범위를 항목별로 문서에 적습니다 (철거·설비·간판·집기 포함 여부)",
      "주요 자재는 제품명과 등급까지 적습니다",
      "대금은 공정에 맞춰 나누고, 잔금은 준공 확인 후에 지급합니다",
    ],
  },
  operating: {
    headline: "공사가 답인지부터 가려야 합니다",
    body: "매출 하락의 상당수는 공사로 해결되지 않습니다. 원인을 나누지 않고 돈을 쓰면 그대로입니다.",
    steps: [
      "신규 손님이 안 오는지, 왔던 손님이 안 돌아오는지 구분합니다",
      "바깥 문제(노출·외관)라면 간판·조명부터 손봅니다",
      "전체 공사는 공사 기간의 매출 손실까지 계산한 뒤 결정합니다",
    ],
  },
};

// ── 업종별 공간의 축 ─────────────────────────────────────────
const INDUSTRY: Record<string, string> = {
  cafe: "카페는 체류가 매출입니다. 머물고 싶은 자리를 의도적으로 만들어야 객단가와 재방문이 함께 올라갑니다.",
  bakery:
    "베이커리는 제품이 곧 인테리어입니다. 진열이 풍성해 보이는 구조와 둘러보게 만드는 동선이 매출을 정합니다.",
  restaurant:
    "레스토랑·주점은 주방 효율과 좌석 회전이 수익을 정합니다. 보이는 곳보다 안 보이는 동선 설계가 먼저입니다.",
  beauty:
    "미용실·뷰티샵은 손님이 몇 시간씩 한자리에 앉아 있습니다. 조명과 의자, 환기가 만족도를 직접 좌우합니다.",
  retail:
    "리테일은 손님이 제품을 집어 들게 만드는 게 전부입니다. 진열 높이와 통로 폭이 매출로 직결됩니다.",
  other:
    "업종이 무엇이든 원리는 같습니다. 손님이 들어와서 나갈 때까지의 흐름이 자연스러워야 합니다.",
};

// ── 타깃별 공간이 져야 할 조건 ───────────────────────────────
const TARGET: Record<string, string> = {
  local: "동네 단골을 노린다면 화려함보다 편안함입니다. 자주 와도 질리지 않는 톤이어야 합니다.",
  young:
    "2030이 SNS에 올리게 하려면 사진이 잘 나오는 자리가 필요합니다. 조명과 배경 한 곳은 의도적으로 설계해야 합니다.",
  office:
    "직장인 점심 수요는 속도가 생명입니다. 주문·수령·퇴장이 막히지 않는 동선이 매출 상한을 정합니다.",
  family:
    "가족 단위는 통로 폭과 좌석 크기가 관건입니다. 유모차와 아이가 지나갈 수 있어야 다시 옵니다.",
  premium:
    "고급 소비층은 마감의 디테일에서 판단합니다. 넓은 여백과 자재의 질감이 가격을 설득합니다.",
};

// ── 고민별 지금 조심할 것 ────────────────────────────────────
const CONCERN: Record<string, { warn: string; note: string }> = {
  concept: {
    warn: "유행을 따라가면 2년 뒤 같은 고민을 다시 합니다",
    note: "지금 예쁜 것이 아니라 오래 설명되는 것을 골라야 합니다. 컨셉은 취향이 아니라 누구에게 무엇을 파는지에 대한 답입니다.",
  },
  budget: {
    warn: "권리금과 시설에 몰아 쓰면 정작 버틸 돈이 없습니다",
    note: "권리금·보증금·공사·장비·초기 운영비는 하나의 주머니에서 나갑니다. 오픈 직후 매출이 안 나오는 기간을 버틸 돈이 남아 있어야 합니다.",
  },
  trust: {
    warn: "말로 한 약속은 증거가 되지 않습니다",
    note: "범위·자재 등급·일정·하자보수가 문서에 없으면 나중에 기억이 서로 다르게 남습니다. 문서를 꺼리는 곳이라면 그것 자체가 정보입니다.",
  },
  location: {
    warn: "유동인구가 많은 자리가 좋은 자리는 아닙니다",
    note: "지나가는 사람이 많은 것과 내 가게에 들어올 사람이 많은 것은 다릅니다. 숫자가 아니라 상권의 성격을 봐야 합니다.",
  },
  sales: {
    warn: "원인을 나누기 전에 공사부터 하면 돈만 씁니다",
    note: "신규가 안 오면 바깥(노출·외관·상권) 문제, 재방문이 없으면 안(제품·서비스·경험) 문제입니다. 처방이 완전히 다릅니다.",
  },
};

// ── 규모별 한마디 ────────────────────────────────────────────
const SIZE: Record<string, string> = {
  under10:
    "작은 평수일수록 수납 설계가 승부를 가릅니다. 수납을 빼면 오픈 3개월 만에 상자가 쌓여 공간이 무너집니다.",
  "10to20":
    "가장 흔한 규모입니다. 좌석 수를 욕심내다 통로가 좁아지는 실수가 자주 나옵니다.",
  "20to50":
    "구역을 나눌 수 있는 크기입니다. 머무는 자리와 빨리 나가는 자리를 구분하면 회전과 체류를 동시에 잡을 수 있습니다.",
  over50:
    "넓을수록 빈 느낌이 위험합니다. 큰 공간은 존을 나눠 각 구역에 목적을 주어야 합니다.",
  unknown:
    "평수가 정해지지 않았다면 오히려 좋습니다. 컨셉에 맞는 크기를 역으로 정할 수 있습니다.",
};

// ── 이어서 읽을 글 (실제 존재하는 slug만) ────────────────────
const READS_BY_CONCERN: Record<string, string[]> = {
  concept: ["why-concept-first", "brand-concept-first", "store-naming"],
  budget: ["cafe-startup-cost", "key-money", "startup-government-funding"],
  trust: ["interior-contract", "interior-quote-guide", "choose-interior-company"],
  location: ["location-analysis", "commercial-lease-checklist", "key-money"],
  sales: ["store-renewal", "data-driven-operation", "store-flow-design"],
};

const READS_BY_STAGE: Record<string, string[]> = {
  idea: ["cafe-startup-order", "business-plan-before-construction"],
  looking: ["location-analysis", "commercial-lease-checklist"],
  contracted: ["restaurant-permit", "interior-timeline"],
  preconstruction: ["interior-contract", "interior-quote-guide"],
  operating: ["store-renewal", "data-driven-operation"],
};

const READS_BY_INDUSTRY: Record<string, string[]> = {
  cafe: ["cafe-startup-order", "small-cafe-branding"],
  bakery: ["large-cafe-trend"],
  restaurant: ["restaurant-checklist", "restaurant-permit"],
  beauty: ["beauty-salon-interior"],
  retail: ["store-flow-design"],
  other: ["why-concept-first"],
};

// 업종에 맞는 컨셉 예시 (lib/concepts.ts 의 slug)
const CONCEPTS_BY_INDUSTRY: Record<string, string[]> = {
  cafe: ["sora", "daon", "cityline"],
  bakery: ["mellow", "sodam"],
  restaurant: ["ember", "plate", "noir"],
  beauty: ["nest", "sodam"],
  retail: ["nest", "forestpaws", "cityline"],
  other: ["sora", "nest"],
};

export type Result = {
  headline: string;
  body: string;
  steps: string[];
  warn: string;
  warnNote: string;
  spaceNotes: string[];
  readSlugs: string[];
  conceptSlugs: string[];
  summary: string; // 상담 폼에 자동으로 담기는 요약
};

// 같은 글이 여러 곳에서 추천될 수 있으니 순서를 지키며 중복만 제거한다.
function unique(list: string[], limit: number): string[] {
  return Array.from(new Set(list)).slice(0, limit);
}

function labelOf(key: keyof Answers, value: string): string {
  const q = QUESTIONS.find((x) => x.key === key);
  return q?.options.find((o) => o.value === value)?.label ?? value;
}

export function diagnose(a: Answers): Result {
  const stage = STAGE[a.stage] ?? STAGE.idea;
  const concern = CONCERN[a.concern] ?? CONCERN.concept;

  const spaceNotes = [
    INDUSTRY[a.industry] ?? INDUSTRY.other,
    TARGET[a.target] ?? TARGET.local,
    SIZE[a.size] ?? SIZE.unknown,
  ];

  const readSlugs = unique(
    [
      ...(READS_BY_CONCERN[a.concern] ?? []),
      ...(READS_BY_STAGE[a.stage] ?? []),
      ...(READS_BY_INDUSTRY[a.industry] ?? []),
    ],
    4
  );

  // 대표님이 상담 전에 상황을 바로 파악할 수 있도록 한 문단으로 정리한다.
  const summary = [
    `[컨셉 진단 결과]`,
    `업종: ${labelOf("industry", a.industry)}`,
    `단계: ${labelOf("stage", a.stage)}`,
    `규모: ${labelOf("size", a.size)}`,
    `타깃: ${labelOf("target", a.target)}`,
    `고민: ${labelOf("concern", a.concern)}`,
  ].join("\n");

  return {
    headline: stage.headline,
    body: stage.body,
    steps: stage.steps,
    warn: concern.warn,
    warnNote: concern.note,
    spaceNotes,
    readSlugs,
    conceptSlugs: CONCEPTS_BY_INDUSTRY[a.industry] ?? CONCEPTS_BY_INDUSTRY.other,
    summary,
  };
}
