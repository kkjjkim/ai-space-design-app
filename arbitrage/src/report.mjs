// 랭킹 결과를 사람이 보기 좋은 HTML 리포트로 출력.
import { writeFileSync } from "node:fs";

const won = (n) => Math.round(n).toLocaleString("ko-KR") + "원";
const pct = (n) => (n * 100).toFixed(1) + "%";

export function writeHtmlReport(ranked, outPath) {
  const rows = ranked
    .map((r, i) => {
      const cls = r.recommended ? "ok" : "no";
      return `<tr class="${cls}">
        <td>${i + 1}</td>
        <td>
          <div class="name">${r.name}</div>
          <div class="sub">${r.category} · ${r.source} → ${r.marketLabel}</div>
        </td>
        <td>${won(r.sourceCostKrw)}</td>
        <td>${won(r.sellPriceKrw)}</td>
        <td class="num ${r.netProfit >= 0 ? "pos" : "neg"}">${won(r.netProfit)}</td>
        <td class="num">${pct(r.marginRate)}</td>
        <td class="num">${pct(r.roi)}</td>
        <td class="num">${(r.monthlySales || 0).toLocaleString("ko-KR")}</td>
        <td class="num"><b>${r.score.toFixed(0)}</b></td>
        <td>${r.recommended ? "✅ 추천" : "—"}</td>
      </tr>`;
    })
    .join("\n");

  const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>한국제품 해외판매 마진 분석</title>
<style>
  body{font-family:-apple-system,'Pretendard',sans-serif;background:#faf8f4;color:#2b2b2b;margin:0;padding:24px}
  h1{font-size:22px;margin:0 0 4px}
  p.desc{color:#777;margin:0 0 20px;font-size:14px}
  table{border-collapse:collapse;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)}
  th,td{padding:10px 12px;text-align:left;font-size:14px;border-bottom:1px solid #f0ece4}
  th{background:#f4efe7;font-weight:600;color:#555}
  td.num{text-align:right;font-variant-numeric:tabular-nums}
  .name{font-weight:600}
  .sub{color:#999;font-size:12px}
  .pos{color:#1a7f37}.neg{color:#c0392b}
  tr.no{opacity:.55}
  .legend{margin-top:14px;font-size:12px;color:#999}
</style></head><body>
<h1>한국제품 해외판매 마진 분석 리포트</h1>
<p class="desc">한국 원가 + 모든 비용(수수료·국제배송·결제·반품충당)을 뺀 건당 순이익 기준. 점수 높은 순.</p>
<table>
<thead><tr>
  <th>#</th><th>제품</th><th>원가</th><th>판매가(원)</th><th>순이익</th>
  <th>마진율</th><th>ROI</th><th>월판매</th><th>점수</th><th>추천</th>
</tr></thead>
<tbody>
${rows}
</tbody></table>
<p class="legend">※ 환율·수수료·배송비는 가정값입니다. 실제 정산은 각 마켓 정산서로 확인하세요. 설정은 src/config.mjs 에서 조정.</p>
</body></html>`;

  writeFileSync(outPath, html, "utf8");
}
