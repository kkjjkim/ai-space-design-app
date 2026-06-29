// 실행 진입점.
//   node arbitrage/cli.mjs [csv경로]
// CSV를 읽어 마진을 계산하고, 마진×수요 등급 + 점수 순으로 표 + HTML 리포트를 만든다.
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { loadProductsFromCsv } from "./src/loadProducts.mjs";
import { computeAll } from "./src/margin.mjs";
import { rankProducts } from "./src/rank.mjs";
import { writeHtmlReport } from "./src/report.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const csvPath = resolve(
  process.argv[2] || join(here, "data", "sample-products.csv"),
);

const won = (n) => Math.round(n).toLocaleString("ko-KR").padStart(9) + "원";
const pct = (n) => (n * 100).toFixed(1).padStart(5) + "%";

function main() {
  const products = loadProductsFromCsv(csvPath);
  if (products.length === 0) {
    console.error(`제품이 없습니다: ${csvPath}`);
    process.exit(1);
  }

  const ranked = rankProducts(computeAll(products));

  console.log(`\n📊 한국제품 → 큐텐 재팬 마진 분석 — ${products.length}개 후보\n`);
  console.log("   등급            점수  마진율   ROI   순이익      월판매  제품");
  console.log("  " + "─".repeat(76));
  ranked.forEach((r) => {
    const badge = `${r.icon} ${r.label}`.padEnd(16);
    console.log(
      `  ${badge} ${String(Math.round(r.score)).padStart(3)}  ${pct(r.marginRate)} ${pct(r.roi)} ${won(r.netProfit)}  ${String(r.monthlySales || 0).padStart(5)}  ${r.name}`,
    );
  });

  const stars = ranked.filter((r) => r.tier === "star");
  console.log("\n  " + "─".repeat(76));
  console.log(
    `  ⭐ 핵심(고마진+잘팔림): ${stars.length}개` +
      (stars.length ? "  →  " + stars.map((s) => s.name).join(", ") : ""),
  );
  console.log("");

  const outPath = join(here, "report.html");
  writeHtmlReport(ranked, outPath);
  console.log(`📄 리포트 저장: ${outPath}\n`);
}

main();
