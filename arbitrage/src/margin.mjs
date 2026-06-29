// 마진 엔진 — 이 프로그램의 두뇌.
// 한국 원가 + 모든 비용을 빼고 "건당 실제로 남는 돈"을 계산한다.
import {
  FX_KRW,
  MARKETPLACES,
  intlShippingKrw,
  PACKAGING_KRW,
} from "./config.mjs";

// 카테고리별 수수료율을 고른다(없으면 default).
function feeRateFor(mp, category) {
  const t = mp.feeByCategory;
  return t[category] ?? t.default;
}

// 한 제품의 손익을 계산한다.
// product: { name, category, source, sourceCostKrw, weightKg,
//            market, sellPriceLocal, promoRate?, monthlySales?, competitors? }
export function computeMargin(product) {
  const mp = MARKETPLACES[product.market];
  if (!mp) throw new Error(`알 수 없는 마켓: ${product.market}`);
  const fx = FX_KRW[mp.currency];
  if (!fx) throw new Error(`환율 미설정 통화: ${mp.currency}`);

  // 메가와리 같은 쿠폰 할인 부담분만큼 실수령 판매가가 깎인다.
  const promoRate = Number(product.promoRate) || 0;
  const effectiveLocal = Number(product.sellPriceLocal) * (1 - promoRate);
  const sellPriceKrw = effectiveLocal * fx; // 쿠폰 반영 후 원화 판매가

  // 비용 항목들
  const cogs = Number(product.sourceCostKrw); // 한국 구매 원가(사입가 권장)
  const feeRate = feeRateFor(mp, product.category);
  const marketFee = sellPriceKrw * feeRate;
  const paymentFee = sellPriceKrw * mp.payRate;
  const shipping = intlShippingKrw(product.weightKg, product.market);
  const packaging = PACKAGING_KRW;
  const returnReserve = sellPriceKrw * mp.returnRate;

  const totalCost =
    cogs + marketFee + paymentFee + shipping + packaging + returnReserve;

  const netProfit = sellPriceKrw - totalCost;
  const marginRate = sellPriceKrw > 0 ? netProfit / sellPriceKrw : 0;
  const roi = cogs > 0 ? netProfit / cogs : 0;

  return {
    ...product,
    currency: mp.currency,
    marketLabel: mp.label,
    feeRate,
    promoRate,
    sellPriceKrw,
    breakdown: {
      cogs,
      marketFee,
      paymentFee,
      shipping,
      packaging,
      returnReserve,
    },
    totalCost,
    netProfit,
    marginRate,
    roi,
  };
}

export function computeAll(products) {
  return products.map(computeMargin);
}
