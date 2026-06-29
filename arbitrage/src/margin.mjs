// 마진 엔진 — 이 프로그램의 두뇌.
// 한국 원가 + 모든 비용을 빼고 "건당 실제로 남는 돈"을 계산한다.
import {
  FX_KRW,
  MARKETPLACES,
  intlShippingKrw,
  PACKAGING_KRW,
} from "./config.mjs";

// 한 제품의 손익을 계산한다.
// product: { name, category, source, sourceCostKrw, weightKg,
//            market, sellPriceLocal, monthlySales }
export function computeMargin(product) {
  const mp = MARKETPLACES[product.market];
  if (!mp) {
    throw new Error(`알 수 없는 마켓: ${product.market}`);
  }
  const fx = FX_KRW[mp.currency];
  if (!fx) {
    throw new Error(`환율 미설정 통화: ${mp.currency}`);
  }

  // 판매가를 원화로 환산
  const sellPriceKrw = Number(product.sellPriceLocal) * fx;

  // 비용 항목들
  const cogs = Number(product.sourceCostKrw); // 한국에서 산 원가(소비자가, VAT 포함)
  const marketFee = sellPriceKrw * mp.feeRate;
  const paymentFee = sellPriceKrw * mp.payRate;
  const shipping = intlShippingKrw(product.weightKg);
  const packaging = PACKAGING_KRW;
  const returnReserve = sellPriceKrw * mp.returnRate;

  const totalCost =
    cogs + marketFee + paymentFee + shipping + packaging + returnReserve;

  const netProfit = sellPriceKrw - totalCost;
  const marginRate = sellPriceKrw > 0 ? netProfit / sellPriceKrw : 0; // 판매가 대비 남는 비율
  const roi = cogs > 0 ? netProfit / cogs : 0; // 투입 원가 대비 수익률

  return {
    ...product,
    currency: mp.currency,
    marketLabel: mp.label,
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
