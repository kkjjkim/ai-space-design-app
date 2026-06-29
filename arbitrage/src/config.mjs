// 설정값 한 곳 모음 — 환율/수수료/배송비 가정.
// 실제 운영 시 이 숫자만 바꾸면 전체 계산이 따라 바뀐다.
// 숫자는 모두 "대략값"이며, 정확한 정산은 각 마켓 정산서로 확인해야 한다.

// 1 외화 = ? 원. (수동 갱신용 기본값. 나중에 환율 API로 교체 가능)
export const FX_KRW = {
  JPY: 9.3, // 100엔 ≈ 930원
  USD: 1350.0,
  SGD: 1000.0,
  KRW: 1.0,
};

// 마켓별 기본 가정.
// feeByCategory: 카테고리별 판매수수료(판매가 대비). default 는 없는 카테고리용.
// payRate: 결제/정산 수수료. returnRate: 반품·분쟁 충당분. currency: 표시 통화.
export const MARKETPLACES = {
  qoo10_jp: {
    label: "큐텐 재팬",
    currency: "JPY",
    feeByCategory: {
      뷰티: 0.1, // 큐텐 일본 카테고리 수수료(대략)
      식품: 0.12,
      패션: 0.1,
      생활: 0.1,
      default: 0.1,
    },
    payRate: 0.0, // 통상 수수료에 포함
    returnRate: 0.03,
  },
  ebay_us: {
    label: "eBay (미국)",
    currency: "USD",
    feeByCategory: { default: 0.1325 }, // final value fee 평균
    payRate: 0.0,
    returnRate: 0.05,
  },
  shopee_sg: {
    label: "쇼피 (싱가포르)",
    currency: "SGD",
    feeByCategory: { default: 0.1 },
    payRate: 0.0,
    returnRate: 0.04,
  },
};

// 국제 소형 배송비(원). 마켓(목적지)별로 다르다.
// 일본행이 가장 싸다 — 이게 큐텐이 유리한 핵심 이유.
const SHIP_BRACKETS = {
  // 한국 → 일본 (Qxpress/등기소형 대략)
  qoo10_jp: [
    [0.1, 2800],
    [0.3, 4200],
    [0.5, 6000],
    [1.0, 9000],
    [2.0, 15000],
  ],
  // 한국 → 미국 (비싸다)
  ebay_us: [
    [0.3, 9000],
    [0.5, 13000],
    [1.0, 19000],
    [2.0, 30000],
  ],
  // 한국 → 싱가포르
  shopee_sg: [
    [0.3, 7000],
    [0.5, 10000],
    [1.0, 15000],
    [2.0, 24000],
  ],
};

export function intlShippingKrw(weightKg, market) {
  const w = Number(weightKg) || 0.3;
  const table = SHIP_BRACKETS[market] || SHIP_BRACKETS.qoo10_jp;
  for (const [maxKg, cost] of table) {
    if (w <= maxKg) return cost;
  }
  // 마지막 구간 초과분은 kg당 추가
  const [lastKg, lastCost] = table[table.length - 1];
  return lastCost + Math.ceil(w - lastKg) * 8000;
}

// 한 건당 고정 부대비용(원): 포장재 + 라벨 + 국내 픽업/입고 등.
export const PACKAGING_KRW = 1500;

// 발굴된 제품에 무게 정보가 없을 때 카테고리로 추정(kg).
const CATEGORY_WEIGHTS_KG = {
  뷰티: 0.15,
  식품: 0.5,
  패션: 0.3,
  생활: 0.3,
  default: 0.3,
};
export function guessWeightKg(category) {
  return CATEGORY_WEIGHTS_KG[category] ?? CATEGORY_WEIGHTS_KG.default;
}

// 랭킹 점수 가중치. 마진율·순이익·수요는 +, 경쟁(셀러 수)은 −.
export const SCORE_WEIGHTS = {
  marginRate: 0.4, // 남는 비율
  netProfit: 0.2, // 건당 순이익 절대액
  demand: 0.3, // 월 판매량(수요 신호)
  competition: 0.1, // 경쟁 셀러 많을수록 감점
};

// 등급/필터 기준선.
export const THRESHOLDS = {
  minMarginRate: 0.15, // 이 미만이면 흑자라도 합격선 미달
  goodMarginRate: 0.25, // 이 이상이면 "고마진"
  hotMonthlySales: 800, // 이 이상이면 "잘 팔림"
};
