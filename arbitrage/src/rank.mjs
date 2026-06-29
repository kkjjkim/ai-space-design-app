// 랭킹 — "마진 높고 잘 팔리는" 제품을 위로 올린다.
// 마진율·순이익·수요(+) 와 경쟁 셀러 수(−) 를 0~1로 정규화해 가중 합산.
import { SCORE_WEIGHTS, THRESHOLDS } from "./config.mjs";

// 값 배열을 0~1로 정규화(min-max). 모두 같으면 0.5로.
function normalize(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 0.5);
  return values.map((v) => (v - min) / (max - min));
}

// 마진 × 수요 2×2 등급. 이게 "마진 높고 잘 팔리는 것 찾기"의 핵심.
function classify(marginRate, monthlySales) {
  const { minMarginRate, goodMarginRate, hotMonthlySales } = THRESHOLDS;
  const hot = (Number(monthlySales) || 0) >= hotMonthlySales;
  if (marginRate < minMarginRate) {
    return { tier: "avoid", icon: "❌", label: "회피" };
  }
  if (marginRate >= goodMarginRate && hot) {
    return { tier: "star", icon: "⭐", label: "핵심(고마진+잘팔림)" };
  }
  if (marginRate >= goodMarginRate) {
    return { tier: "margin", icon: "💎", label: "고마진(소량)" };
  }
  if (hot) {
    return { tier: "volume", icon: "🔁", label: "박리다매" };
  }
  return { tier: "ok", icon: "✅", label: "무난" };
}

// computeMargin 결과 배열을 받아 점수·등급을 붙이고 정렬해 반환.
export function rankProducts(items) {
  if (items.length === 0) return [];

  const marginNorm = normalize(items.map((i) => i.marginRate));
  const profitNorm = normalize(items.map((i) => i.netProfit));
  // 수요는 로그 스케일(판매량 편차가 큼) 후 정규화
  const demandNorm = normalize(
    items.map((i) => Math.log10((Number(i.monthlySales) || 0) + 1)),
  );
  // 경쟁은 많을수록 나쁨 → 정규화 후 점수에서 뺀다(데이터 없으면 0)
  const compNorm = normalize(items.map((i) => Number(i.competitors) || 0));

  const scored = items.map((item, idx) => {
    const raw =
      SCORE_WEIGHTS.marginRate * marginNorm[idx] +
      SCORE_WEIGHTS.netProfit * profitNorm[idx] +
      SCORE_WEIGHTS.demand * demandNorm[idx] -
      SCORE_WEIGHTS.competition * compNorm[idx];
    const score = Math.max(0, raw) * 100;
    const cls = classify(item.marginRate, item.monthlySales);
    return {
      ...item,
      score,
      ...cls,
      // 추천 = 회피가 아니고 흑자
      recommended: cls.tier !== "avoid" && item.netProfit > 0,
    };
  });

  // 핵심(⭐) 먼저, 그 안에서 점수순
  const order = { star: 0, margin: 1, volume: 2, ok: 3, avoid: 4 };
  scored.sort((a, b) => {
    if (order[a.tier] !== order[b.tier]) return order[a.tier] - order[b.tier];
    return b.score - a.score;
  });
  return scored;
}
