// 사입가 자동수집 — 네이버 쇼핑 API로 한국 최저가를 채운다.
//
//   node arbitrage/enrich.mjs [입력.csv] [출력.csv]      # 실제 API (키 필요)
//   node arbitrage/enrich.mjs --only-missing             # sourceCostKrw 비어있는 것만
//   node arbitrage/enrich.mjs --mock                     # 키 없이 파이프라인 점검(가짜가격)
//
// 키는 .env 가 아니라 환경변수로: NAVER_CLIENT_ID, NAVER_CLIENT_SECRET
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { writeFileSync } from "node:fs";
import {
  loadProductsFromCsv,
  serializeProductsCsv,
} from "./src/loadProducts.mjs";
import { getNaverCreds, hasNaverCreds, searchLowestPrice } from "./src/naver.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith("--")));
const paths = argv.filter((a) => !a.startsWith("--"));

const inPath = resolve(paths[0] || join(here, "data", "sample-products.csv"));
const outPath = resolve(paths[1] || inPath); // 기본: 제자리 덮어쓰기
const onlyMissing = flags.has("--only-missing");
const useMock = flags.has("--mock");

// 키 없이 파이프라인을 검증하기 위한 결정적(deterministic) 가짜 가격.
// 제품명 글자코드 합으로 8,000~24,000원 사이를 만든다.
function mockFetchPrice(query) {
  let h = 0;
  for (const ch of query) h = (h + ch.codePointAt(0)) % 100000;
  const price = 8000 + (h % 161) * 100; // 8000 ~ 24000
  return Promise.resolve({
    query,
    price,
    productCount: 50 + (h % 950),
    sampleTitle: query,
    sampleMall: "(mock)",
  });
}

function printNoCredsHelp() {
  console.error(
    [
      "",
      "❌ 네이버 API 키가 없습니다.",
      "   1) https://developers.naver.com 에서 애플리케이션을 등록하고 '검색' API를 추가하세요.",
      "   2) 발급된 키를 환경변수로 넣고 다시 실행:",
      "        NAVER_CLIENT_ID=... NAVER_CLIENT_SECRET=... node arbitrage/enrich.mjs",
      "",
      "   키 없이 동작만 확인하려면:  node arbitrage/enrich.mjs --mock",
      "",
    ].join("\n"),
  );
}

async function main() {
  const products = loadProductsFromCsv(inPath);
  if (products.length === 0) {
    console.error(`제품이 없습니다: ${inPath}`);
    process.exit(1);
  }

  let fetchPrice;
  if (useMock) {
    fetchPrice = mockFetchPrice;
    console.log("⚠️  --mock 모드: 가짜 가격으로 파이프라인만 점검합니다.\n");
  } else {
    if (!hasNaverCreds()) {
      printNoCredsHelp();
      process.exit(1);
    }
    const creds = getNaverCreds();
    fetchPrice = (q) => searchLowestPrice(q, creds);
  }

  console.log(`🔎 사입가 자동수집 — ${products.length}개 (출처: ${inPath})\n`);

  let updated = 0;
  for (const p of products) {
    if (onlyMissing && Number(p.sourceCostKrw) > 0) {
      console.log(`  · ${p.name} — 건너뜀(이미 ${p.sourceCostKrw}원)`);
      continue;
    }
    // 검색어는 제품명. 묶음 표현은 빼는 게 매칭이 좋아 단순화한다.
    const query = p.name.replace(/\d+개.*$|묶음|선물세트|대용량/g, "").trim();
    try {
      const r = await fetchPrice(query || p.name);
      if (r.price && r.price > 0) {
        const before = p.sourceCostKrw;
        p.sourceCostKrw = r.price;
        updated++;
        console.log(
          `  ✓ ${p.name}\n      최저가 ${r.price.toLocaleString("ko-KR")}원` +
            ` (이전 ${before || "-"}) · 검색결과 ${r.productCount}건 · ${r.sampleMall || ""}`,
        );
      } else {
        console.log(`  ? ${p.name} — 가격 못 찾음(유지: ${p.sourceCostKrw || "-"})`);
      }
    } catch (e) {
      console.log(`  ! ${p.name} — 실패: ${e.message}`);
    }
  }

  writeFileSync(outPath, serializeProductsCsv(products), "utf8");
  console.log(`\n💾 ${updated}개 갱신 → ${outPath}`);
  console.log(`   이어서 분석:  node arbitrage/cli.mjs ${outPath}\n`);
}

main();
