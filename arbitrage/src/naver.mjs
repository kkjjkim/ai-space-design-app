// 네이버 쇼핑 검색 API 커넥터 — 한국 최저가(사입가 후보)를 가져온다.
// 키는 환경변수로만 받는다(코드에 직접 쓰지 않음).
// 발급: https://developers.naver.com > 애플리케이션 등록 > "검색" API.

const ENDPOINT = "https://openapi.naver.com/v1/search/shop.json";

export function getNaverCreds(env = process.env) {
  return {
    clientId: env.NAVER_CLIENT_ID,
    clientSecret: env.NAVER_CLIENT_SECRET,
  };
}

export function hasNaverCreds(env = process.env) {
  const c = getNaverCreds(env);
  return Boolean(c.clientId && c.clientSecret);
}

// 응답 제목의 <b> 태그 등을 제거.
export function stripTags(s) {
  return String(s || "").replace(/<[^>]+>/g, "");
}

// 검색 결과에서 "현실적인 최저가"를 고른다.
// 중고·비정상 초저가(미끼)를 거르려고 중앙값의 30% 미만은 버린 뒤 최저가를 취한다.
export function pickSourcePrice(items) {
  const prices = items
    .map((i) => Number(i.lprice))
    .filter((p) => p > 0)
    .sort((a, b) => a - b);
  if (prices.length === 0) return null;
  const median = prices[Math.floor(prices.length / 2)];
  const cleaned = prices.filter((p) => p >= median * 0.3);
  return cleaned[0] ?? prices[0];
}

// 제품명으로 한국 최저가를 조회한다.
// 반환: { query, price, productCount, sampleTitle, sampleMall }
export async function searchLowestPrice(query, opts = {}) {
  const {
    clientId,
    clientSecret,
    fetchImpl = fetch,
    display = 10,
  } = opts;
  if (!clientId || !clientSecret) {
    throw new Error("네이버 API 키가 없습니다 (NAVER_CLIENT_ID/SECRET).");
  }

  const url = `${ENDPOINT}?query=${encodeURIComponent(query)}&display=${display}&sort=asc`;
  const res = await fetchImpl(url, {
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`네이버 API 오류 ${res.status}: ${body.slice(0, 160)}`);
  }
  const data = await res.json();
  const items = Array.isArray(data.items) ? data.items : [];
  const top = items[0] || {};
  return {
    query,
    price: pickSourcePrice(items),
    productCount: Number(data.total) || items.length,
    sampleTitle: top.title ? stripTags(top.title) : null,
    sampleMall: top.mallName || null,
  };
}
