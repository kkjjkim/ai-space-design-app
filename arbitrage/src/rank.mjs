// 랭킹 — "할만한 제품"을 위로 올린다.
// 마진율, 건당 순이익, 수요(월 판매량)를 0~1로 정규화해 가중 합산.
import { SCORE_WEIGHTS, MIN_MARGIN_RATE } from "./config.mjs";

// 값 배열을 0~1로 정규화(min-max). 모두 같으면 0.5로.
function normalize(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 0.5);
  return values.map((v) => (v - min) / (max - min));
}

// computeMargin 결과 배열을 받아 점수와 추천여부를 붙이고 정렬해 반환.
export function rankProducts(items) {
  if (items.length === 0) return [];

  const marginNorm = normalize(items.map((i) => i.marginRate));
  const profitNorm = normalize(items.map((i) => i.netProfit));
  // 수요는 로그 스케일(판매량 편차가 크므로) 후 정규화
  const demandNorm = normalize(
    items.map((i) => Math.log10((Number(i.monthlySales) || 0) + 1)),
  );

  const scored = items.map((item, idx) => {
    const score =
      (SCORE_WEIGHTS.marginRate * marginNorm[idx] +
        SCORE_WEIGHTS.netProfit * profitNorm[idx] +
        SCORE_WEIGHTS.demand * demandNorm[idx]) *
      100;
    return {
      ...item,
      score,
      recommended: item.marginRate >= MIN_MARGIN_RATE && item.netProfit > 0,
    };
  });

  // 점수 내림차순
  scored.sort((a, b) => b.score - a.score);
  return scored;
}
