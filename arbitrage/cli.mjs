// 실행 진입점.
//   node arbitrage/cli.mjs [csv경로]
// CSV를 읽어 마진을 계산하고, 점수 순으로 콘솔 표 + HTML 리포트를 만든다.
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

  const computed = computeAll(products);
  const ranked = rankProducts(computed);

  console.log(`\n📊 한국제품 해외판매 마진 분석 — ${products.length}개 후보\n`);
  console.log(
    "  # 점수  마진율   ROI   순이익      제품 (마켓)",
  );
  console.log("  " + "─".repeat(64));
  ranked.forEach((r, i) => {
    const tag = r.recommended ? "✅" : "  ";
    const rank = String(i + 1).padStart(2);
    console.log(
      `${tag}${rank} ${String(Math.round(r.score)).padStart(3)}  ${pct(r.marginRate)} ${pct(r.roi)} ${won(r.netProfit)}  ${r.name} (${r.marketLabel})`,
    );
  });

  const recCount = ranked.filter((r) => r.recommended).length;
  console.log("\n  " + "─".repeat(64));
  console.log(`  ✅ 추천(마진율 15%+ & 흑자): ${recCount} / ${ranked.length}개\n`);

  const outPath = join(here, "report.html");
  writeHtmlReport(ranked, outPath);
  console.log(`📄 리포트 저장: ${outPath}\n`);
}

main();
