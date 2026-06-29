// 랭킹 결과를 사람이 보기 좋은 HTML 리포트로 출력.
import { writeFileSync } from "node:fs";

const won = (n) => Math.round(n).toLocaleString("ko-KR") + "원";
const pct = (n) => (n * 100).toFixed(1) + "%";

const TIER_BG = {
  star: "#fff7e0",
  margin: "#eef6ff",
  volume: "#eefaf0",
  ok: "#fff",
  avoid: "#fbeeee",
};

export function writeHtmlReport(ranked, outPath) {
  const rows = ranked
    .map((r, i) => {
      return `<tr style="background:${TIER_BG[r.tier] || "#fff"}">
        <td>${i + 1}</td>
        <td><span class="tier">${r.icon} ${r.label}</span></td>
        <td>
          <div class="name">${r.name}</div>
          <div class="sub">${r.category} · ${r.source}</div>
        </td>
        <td class="num">${won(r.sourceCostKrw)}</td>
        <td class="num">${won(r.sellPriceKrw)}</td>
        <td class="num ${r.netProfit >= 0 ? "pos" : "neg"}">${won(r.netProfit)}</td>
        <td class="num">${pct(r.marginRate)}</td>
        <td class="num">${pct(r.roi)}</td>
        <td class="num">${(r.monthlySales || 0).toLocaleString("ko-KR")}</td>
        <td class="num">${(r.competitors || 0).toLocaleString("ko-KR")}</td>
        <td class="num"><b>${r.score.toFixed(0)}</b></td>
      </tr>`;
    })
    .join("\n");

  const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>큐텐 재팬 마진 분석</title>
<style>
  body{font-family:-apple-system,'Pretendard',sans-serif;background:#faf8f4;color:#2b2b2b;margin:0;padding:24px}
  h1{font-size:22px;margin:0 0 4px}
  p.desc{color:#777;margin:0 0 16px;font-size:14px}
  .legend{margin:0 0 16px;font-size:13px;color:#555}
  .legend b{margin-right:12px}
  table{border-collapse:collapse;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)}
  th,td{padding:9px 11px;text-align:left;font-size:13px;border-bottom:1px solid #f0ece4}
  th{background:#f4efe7;font-weight:600;color:#555;white-space:nowrap}
  td.num{text-align:right;font-variant-numeric:tabular-nums}
  .name{font-weight:600}
  .sub{color:#999;font-size:12px}
  .tier{white-space:nowrap;font-weight:600;font-size:12px}
  .pos{color:#1a7f37}.neg{color:#c0392b}
  .foot{margin-top:14px;font-size:12px;color:#999}
</style></head><body>
<h1>한국제품 → 큐텐 재팬 마진 분석</h1>
<p class="desc">한국 사입가 + 모든 비용(수수료·일본행 배송·메가와리 쿠폰·반품충당)을 뺀 건당 순이익 기준.</p>
<p class="legend">
  <b>⭐ 핵심</b>고마진+잘팔림 &nbsp; <b>💎 고마진</b>마진 좋지만 소량 &nbsp;
  <b>🔁 박리다매</b>잘 팔리나 마진 얇음 &nbsp; <b>✅ 무난</b> &nbsp; <b>❌ 회피</b>적자/마진 미달
</p>
<table>
<thead><tr>
  <th>#</th><th>등급</th><th>제품</th><th>사입가</th><th>판매가(원)</th><th>순이익</th>
  <th>마진율</th><th>ROI</th><th>월판매</th><th>경쟁셀러</th><th>점수</th>
</tr></thead>
<tbody>
${rows}
</tbody></table>
<p class="foot">※ 환율·수수료·배송비·판매량은 가정값입니다. 실제 정산은 큐텐 정산서로 확인하세요. 설정은 src/config.mjs 에서 조정.</p>
</body></html>`;

  writeFileSync(outPath, html, "utf8");
}
