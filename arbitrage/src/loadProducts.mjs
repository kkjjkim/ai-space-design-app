// CSV 제품 입력을 읽어 들인다. (의존성 없이 간단 파서)
// 헤더: name,category,source,sourceCostKrw,weightKg,market,sellPriceLocal,monthlySales
import { readFileSync } from "node:fs";

// 따옴표로 감싼 필드(콤마 포함) 정도만 처리하는 미니 CSV 파서.
function parseLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const NUMERIC = new Set([
  "sourceCostKrw",
  "weightKg",
  "sellPriceLocal",
  "monthlySales",
]);

export function loadProductsFromCsv(path) {
  const text = readFileSync(path, "utf8");
  const lines = text
    .split(/\r?\n/)
    .filter((l) => l.trim() !== "" && !l.trim().startsWith("#"));
  if (lines.length < 2) return [];

  const header = parseLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const cells = parseLine(line);
    const obj = {};
    header.forEach((key, i) => {
      const raw = cells[i] ?? "";
      obj[key] = NUMERIC.has(key) ? Number(raw) : raw;
    });
    return obj;
  });
  return rows;
}
