// .env 파일 로더 — 의존성 없이 키를 파일에서 읽어 process.env 에 넣는다.
// OS별 환경변수 설정 삽질을 없애기 위함. arbitrage/.env → 저장소루트 .env 순으로 찾는다.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

function parseEnv(text) {
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const s = line.trim();
    if (!s || s.startsWith("#")) continue;
    const eq = s.indexOf("=");
    if (eq === -1) continue;
    const key = s.slice(0, eq).trim();
    let val = s.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

// 이미 실제 환경변수로 준 값이 있으면 그것을 우선한다(파일이 덮어쓰지 않음).
export function loadEnv() {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(here, "..", ".env"), // arbitrage/.env (권장)
    join(here, "..", "..", ".env"), // 저장소 루트 .env
  ];
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    const vars = parseEnv(readFileSync(p, "utf8"));
    for (const [k, v] of Object.entries(vars)) {
      if (process.env[k] === undefined || process.env[k] === "") {
        process.env[k] = v;
      }
    }
  }
}
