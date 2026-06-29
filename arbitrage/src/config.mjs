// 설정값 한 곳 모음 — 환율/수수료/배송비 가정.
// 실제 운영 시 이 숫자만 바꾸면 전체 계산이 따라 바뀐다.
// 숫자는 모두 "대략값"이며, 정확한 정산은 각 마켓 정산서로 확인해야 한다.

// 1 외화 = ? 원. (수동 갱신용 기본값. 나중에 환율 API로 교체 가능)
export const FX_KRW = {
  JPY: 9.0, // 100엔 ≈ 900원
  USD: 1350.0,
  SGD: 1000.0,
  KRW: 1.0,
};

// 마켓별 기본 가정.
// feeRate: 판매수수료(판매가 대비). payRate: 결제/정산 수수료.
// returnRate: 반품·분쟁으로 떼이는 비율(충당분).
// currency: 그 마켓의 표시 통화.
export const MARKETPLACES = {
  qoo10_jp: {
    label: "큐텐 재팬",
    currency: "JPY",
    feeRate: 0.1, // 카테고리별 6~12%, 평균 가정
    payRate: 0.0, // 통상 수수료에 포함
    returnRate: 0.03,
  },
  ebay_us: {
    label: "eBay (미국)",
    currency: "USD",
    feeRate: 0.1325, // final value fee 평균
    payRate: 0.0, // FVF에 결제수수료 포함 구조
    returnRate: 0.05,
  },
  shopee_sg: {
    label: "쇼피 (싱가포르)",
    currency: "SGD",
    feeRate: 0.1, // 수수료 + 결제수수료 합산 가정
    payRate: 0.0,
    returnRate: 0.04,
  },
};

// 국제 소형 배송비(원). 무게(kg) 구간별 대략값 — K-패킷/등기소형 기준.
// 마켓/국가별로 다르지만 MVP에선 단순 구간 테이블로 시작.
export function intlShippingKrw(weightKg) {
  const w = Number(weightKg) || 0.3;
  if (w <= 0.3) return 6000;
  if (w <= 0.5) return 8500;
  if (w <= 1.0) return 13000;
  if (w <= 2.0) return 21000;
  return 21000 + Math.ceil(w - 2) * 9000;
}

// 한 건당 고정 부대비용(원): 포장재 + 라벨 + 국내 픽업/입고 등.
export const PACKAGING_KRW = 1500;

// 랭킹 점수 가중치. 마진율·순이익·수요를 섞어 0~100 점으로.
export const SCORE_WEIGHTS = {
  marginRate: 0.45, // 남는 비율
  netProfit: 0.35, // 건당 순이익 절대액
  demand: 0.2, // 월 판매량(수요 신호)
};

// 이 마진율 미만이면 "추천 제외"로 표시(걸러내기 기준).
export const MIN_MARGIN_RATE = 0.15;
