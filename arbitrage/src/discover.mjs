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

// ── (3) 큐텐 크롤링 소스: 베스트셀러/검색 페이지에서 발굴 + 수요 신호 ──────
// 계정 불필요. 시장 전체에서 "잘 팔리는 한국제품"을 가져온다.
// 주의:
//  - Playwright 필요. 로컬에서 `pnpm add -D playwright` 후 실행.
//  - 큐텐 실제 DOM에 맞춰 EXTRACT 의 셀렉터를 1회 확정해야 한다(--debug 로 확인).
//  - 약관·차단 리스크가 있으니 과도한 호출 금지(아래는 단일 페이지, 지연 포함).
import { writeFileSync } from "node:fs";

// 브라우저 안에서 실행되는 추출 함수.
// ⚠️ 셀렉터는 실제 페이지로 확정 필요 — 지금은 "가격 텍스트가 보이는 상품 카드"를
//    폭넓게 긁는 best-effort. --debug 로 구조를 본 뒤 정교화한다.
function EXTRACT() {
  const out = [];
  // 상품 카드로 보이는 앵커들(가격 숫자를 포함한 링크) 수집
  const anchors = Array.from(document.querySelectorAll("a"));
  for (const a of anchors) {
    const text = (a.innerText || "").trim();
    const priceMatch = text.match(/([0-9][0-9,]{2,})\s*円?/);
    if (!priceMatch) continue;
    const name = text.split("\n")[0].slice(0, 80);
    if (name.length < 4) continue;
    out.push({
      name,
      priceText: priceMatch[1],
      link: a.href || null,
    });
    if (out.length >= 60) break;
  }
  return { items: out, title: document.title, htmlLen: document.body.innerHTML.length };
}

async function qoo10Discover(opts = {}) {
  const { query = "韓国 化粧品", limit = 30, debug = false } = opts;
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    throw new Error(
      "playwright 미설치 — 로컬에서 `pnpm add -D playwright && pnpm exec playwright install chromium` 후 실행하세요.",
    );
  }

  // 큐텐 재팬 검색 결과 페이지. (베스트셀러 URL 로 바꿔도 됨)
  const url = `https://www.qoo10.jp/gmkt.inc/Search/Search.aspx?keyword=${encodeURIComponent(query)}`;

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
    });
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1500); // 동적 로딩 여유

    const raw = await page.evaluate(EXTRACT);

    if (debug) {
      const html = await page.content();
      writeFileSync(new URL("../debug-qoo10.html", import.meta.url), html, "utf8");
      console.error(
        `🐛 debug: title="${raw.title}" htmlLen=${raw.htmlLen} 추출=${raw.items.length}건 → arbitrage/debug-qoo10.html 저장`,
      );
    }

    return raw.items.slice(0, limit).map((it) => ({
      name: it.name,
      category: "뷰티",
      market: "qoo10_jp",
      sellPriceLocal: Number(String(it.priceText).replace(/,/g, "")) || 0,
      monthlySales: 0, // 검색 페이지에서 판매량 신호 확보 시 채움(리뷰수/찜수 등)
      competitors: 0,
      weightKg: guessWeightKg("뷰티"),
      link: it.link,
    }));
  } finally {
    await browser.close();
  }
}

// 소스 선택 진입점.
export async function discoverProducts(opts = {}) {
  const source = opts.source || "mock";
  if (source === "mock") return mockDiscover(opts);
  if (source === "ebay") return ebayDiscover(opts);
  if (source === "qoo10") return qoo10Discover(opts);
  throw new Error(`알 수 없는 발굴 소스: ${source}`);
}
