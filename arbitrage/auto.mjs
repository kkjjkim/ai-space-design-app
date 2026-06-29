// 자동 소싱 파이프라인 — 제품 목록 입력 없이 "소싱할 리스트"를 뽑는다.
//
//   발굴(해외 인기 한국제품) → 원가(네이버 최저가) → 마진 → 등급 → 리스트
//
// 사용법:
//   node arbitrage/auto.mjs --mock                      # 키 없이 전체 흐름 점검
//   node arbitrage/auto.mjs --source=ebay --query="korean skincare"
//   (실제: EBAY_CLIENT_ID/SECRET, NAVER_CLIENT_ID/SECRET 환경변수 필요)
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { discoverProducts } from "./src/discover.mjs";
import {
  getNaverCreds,
  hasNaverCreds,
  searchLowestPrice,
  mockLowestPrice,
} from "./src/naver.mjs";
import { computeAll } from "./src/margin.mjs";
import { rankProducts } from "./src/rank.mjs";
import { writeHtmlReport } from "./src/report.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const getFlag = (name, def) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : def;
};
const useMock = argv.includes("--mock");
const source = getFlag("source", useMock ? "mock" : "ebay");
const query = getFlag("query", "korean skincare");
const limit = Number(getFlag("limit", "30"));

const won = (n) => Math.round(n).toLocaleString("ko-KR").padStart(9) + "원";
const pct = (n) => (n * 100).toFixed(1).padStart(5) + "%";

async function main() {
  // ── 1) 발굴: 해외에서 잘 팔리는 한국제품 후보 ──────────────
  console.log(`\n🛰️  발굴 — source=${source}${source === "ebay" ? ` q="${query}"` : ""}`);
  let candidates;
  try {
    candidates = await discoverProducts({ source, query, limit });
  } catch (e) {
    console.error(`발굴 실패: ${e.message}`);
    process.exit(1);
  }
  console.log(`   후보 ${candidates.length}개 확보\n`);

  // ── 2) 원가: 후보마다 한국 최저가 자동 매칭 ────────────────
  let fetchPrice;
  if (useMock) {
    fetchPrice = mockLowestPrice;
    console.log("⚠️  --mock: 원가도 가짜값으로 점검합니다.");
  } else if (hasNaverCreds()) {
    const creds = getNaverCreds();
    fetchPrice = (q) => searchLowestPrice(q, creds);
  } else {
    console.error("❌ 네이버 키 없음(NAVER_CLIENT_ID/SECRET). --mock 으로 점검 가능.");
    process.exit(1);
  }

  console.log("💴 한국 최저가(사입가) 매칭 중...");
  for (const c of candidates) {
    const q = c.name.replace(/\d+매|\d+개|선물세트|멀티팩/g, "").trim();
    try {
      const r = await fetchPrice(q || c.name);
      c.source = "네이버최저가";
      c.sourceCostKrw = r.price || 0;
      c.koreanMatches = r.productCount;
    } catch (e) {
      c.source = "매칭실패";
      c.sourceCostKrw = 0;
      c.note = e.message;
    }
  }

  // ── 3) 마진 + 4) 등급/정렬 ────────────────────────────────
  const priced = candidates.filter((c) => c.sourceCostKrw > 0);
  const ranked = rankProducts(computeAll(priced));

  // ── 5) 소싱 리스트 출력 ──────────────────────────────────
  console.log(`\n📋 소싱 추천 리스트 (잘 팔리고 마진 좋은 순)\n`);
  console.log("   등급            점수  마진율   ROI   순이익    원가→판매(원)   월판매  제품");
  console.log("  " + "─".repeat(92));
  ranked.forEach((r) => {
    const badge = `${r.icon} ${r.label}`.padEnd(16);
    const flow = `${Math.round(r.sourceCostKrw).toLocaleString("ko-KR")}→${Math.round(r.sellPriceKrw).toLocaleString("ko-KR")}`.padStart(13);
    console.log(
      `  ${badge} ${String(Math.round(r.score)).padStart(3)}  ${pct(r.marginRate)} ${pct(r.roi)} ${won(r.netProfit)}  ${flow}  ${String(r.monthlySales || 0).padStart(5)}  ${r.name}`,
    );
  });

  const stars = ranked.filter((r) => r.tier === "star");
  const buy = ranked.filter((r) => r.recommended);
  console.log("\n  " + "─".repeat(92));
  console.log(`  ⭐ 핵심 ${stars.length}개 · ✅ 소싱가치 있음(흑자&합격) ${buy.length}/${ranked.length}개`);
  if (stars.length) console.log(`     → 먼저 소싱: ${stars.map((s) => s.name).join(", ")}`);
  console.log("");

  const outPath = join(here, "report.html");
  writeHtmlReport(ranked, outPath);
  console.log(`📄 리포트: ${outPath}\n`);
}

main();
