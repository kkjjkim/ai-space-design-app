// 제품 발굴(discovery) — "해외에서 잘 팔리는 한국제품 후보"를 자동으로 가져온다.
// 이게 자동 소싱의 출발점: 내가 목록을 넣는 게 아니라 마켓 데이터가 후보를 만든다.
//
// 반환 후보 형식:
//   { name, category, market, sellPriceLocal, monthlySales?, competitors?, link? }
// (원가 sourceCostKrw 는 다음 단계에서 네이버로 채운다)
import { guessWeightKg } from "./config.mjs";

// ── (1) Mock 소스: 큐텐 재팬 인기 한국제품을 흉내낸 고정 후보 ──────────────
// 키/계정 없이 전체 자동 흐름을 검증하기 위한 시드.
const MOCK_QOO10_BESTSELLERS = [
  { name: "토리든 다이브인 세럼", category: "뷰티", sellPriceLocal: 3400, monthlySales: 1600, competitors: 30 },
  { name: "조선미녀 릴리프 선크림", category: "뷰티", sellPriceLocal: 1890, monthlySales: 2200, competitors: 65 },
  { name: "코스알엑스 스네일 96 에센스", category: "뷰티", sellPriceLocal: 2300, monthlySales: 1300, competitors: 45 },
  { name: "아누아 어성초 토너", category: "뷰티", sellPriceLocal: 2700, monthlySales: 1450, competitors: 38 },
  { name: "라네즈 립 슬리핑 마스크", category: "뷰티", sellPriceLocal: 2600, monthlySales: 900, competitors: 80 },
  { name: "메디힐 마스크팩 30매", category: "뷰티", sellPriceLocal: 3900, monthlySales: 1000, competitors: 70 },
  { name: "삐아 라스트 벨벳 틴트", category: "뷰티", sellPriceLocal: 1500, monthlySales: 760, competitors: 55 },
  { name: "닥터지 레드 블레미쉬 크림", category: "뷰티", sellPriceLocal: 2900, monthlySales: 680, competitors: 42 },
  { name: "롬앤 쥬시 래스팅 틴트", category: "뷰티", sellPriceLocal: 1700, monthlySales: 1900, competitors: 90 },
  { name: "구달 청귤 비타C 세럼", category: "뷰티", sellPriceLocal: 2400, monthlySales: 1100, competitors: 36 },
  { name: "불닭볶음면 멀티팩", category: "식품", sellPriceLocal: 1850, monthlySales: 1200, competitors: 95 },
  { name: "비비고 김 선물세트", category: "식품", sellPriceLocal: 1600, monthlySales: 300, competitors: 25 },
];

async function mockDiscover({ limit = 50 }) {
  return MOCK_QOO10_BESTSELLERS.slice(0, limit).map((c) => ({
    ...c,
    market: "qoo10_jp",
    weightKg: guessWeightKg(c.category),
    link: null,
  }));
}

// ── (2) eBay Browse 소스: 무료 개발자 토큰만으로 검색 가능(셀러계정 불필요) ──
// client credentials OAuth → item_summary/search. 현재 시세(판매가)를 가져온다.
// 주의: Browse API 는 "실제 판매량"을 주지 않는다 → monthlySales 는 비움(0).
//       판매량까지 받으려면 Marketplace Insights(승인 필요)가 필요하다.
const EBAY_OAUTH = "https://api.ebay.com/identity/v1/oauth2/token";
const EBAY_BROWSE = "https://api.ebay.com/buy/browse/v1/item_summary/search";

async function ebayAppToken({ clientId, clientSecret, fetchImpl = fetch }) {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetchImpl(EBAY_OAUTH, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=" +
      encodeURIComponent("https://api.ebay.com/oauth/api_scope"),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`eBay 토큰 오류 ${res.status}: ${t.slice(0, 160)}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function ebayDiscover({ query = "korean skincare", limit = 30, env = process.env, fetchImpl = fetch }) {
  const clientId = env.EBAY_CLIENT_ID;
  const clientSecret = env.EBAY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("eBay 키가 없습니다 (EBAY_CLIENT_ID/SECRET).");
  }
  const token = await ebayAppToken({ clientId, clientSecret, fetchImpl });

  const url = `${EBAY_BROWSE}?q=${encodeURIComponent(query)}&limit=${Math.min(limit, 200)}`;
  const res = await fetchImpl(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
    },
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`eBay Browse 오류 ${res.status}: ${t.slice(0, 160)}`);
  }
  const data = await res.json();
  const items = Array.isArray(data.itemSummaries) ? data.itemSummaries : [];
  return items
    .filter((it) => it.price && Number(it.price.value) > 0)
    .slice(0, limit)
    .map((it) => ({
      name: it.title,
      category: "뷰티", // 검색어 기준 가정. 정교화 가능.
      market: "ebay_us",
      sellPriceLocal: Number(it.price.value), // USD
      monthlySales: 0, // Browse 는 판매량 미제공
      competitors: 0,
      weightKg: guessWeightKg("뷰티"),
      link: it.itemWebUrl || null,
    }));
}

// 소스 선택 진입점.
export async function discoverProducts(opts = {}) {
  const source = opts.source || "mock";
  if (source === "mock") return mockDiscover(opts);
  if (source === "ebay") return ebayDiscover(opts);
  throw new Error(`알 수 없는 발굴 소스: ${source}`);
}
