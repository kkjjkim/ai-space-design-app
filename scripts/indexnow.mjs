// 배포한 페이지를 빙·네이버·얀덱스에 즉시 알린다 (IndexNow).
// 한 곳에 보내면 참여 검색엔진끼리 공유한다. 구글은 참여하지 않는다(서치콘솔이 대신한다).
//
// 왜 필요한가:
// 챗지피티 검색은 자체 크롤러(OAI-SearchBot)와 빙 계열 색인을 함께 쓴다.
// 사이트맵만 올려두면 수집까지 몇 주가 걸리는데, 이걸로 새 페이지를 바로 밀어 넣는다.
//
// 쓰는 법: pnpm indexnow            (배포된 사이트맵 전체)
//          pnpm indexnow /answers /answers/key-money-calculation   (지정한 주소만)
//          pnpm indexnow --dry-run   (보내지 않고 무엇이 나갈지만 확인)
//
// 사이트맵은 배포된 사이트에서 읽는다. 아직 배포 안 된 주소를 알리면 오히려 감점이다.

import { readFileSync } from "node:fs";

// lib/site.ts 를 그대로 읽을 수 없어(타입스크립트) 필요한 두 값만 뽑아 쓴다.
// 값이 한 곳(lib/site.ts)에만 있게 유지하기 위함이다.
const siteSource = readFileSync(new URL("../lib/site.ts", import.meta.url), "utf8");
const pick = (key) => siteSource.match(new RegExp(`${key}:\\s*"([^"]+)"`))?.[1];

const siteUrl = pick("url");
const key = pick("indexNowKey");

if (!siteUrl || !key) {
  console.error("lib/site.ts 에서 url 또는 indexNowKey 를 찾지 못했습니다.");
  process.exit(1);
}

const host = new URL(siteUrl).host;
const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const args = argv.filter((a) => !a.startsWith("--"));

// 운영자가 읽을 메시지만 남기고 끝낸다 (스택 트레이스는 도움이 안 된다).
function fail(message) {
  console.error(message);
  process.exit(1);
}

async function collectUrls() {
  if (args.length > 0) {
    return args.map((path) =>
      path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
    );
  }
  const res = await fetch(`${siteUrl}/sitemap.xml`).catch(() => null);
  if (!res || !res.ok) {
    fail(
      `사이트맵을 읽지 못했습니다 (${res ? `HTTP ${res.status}` : "연결 실패"}).\n` +
        `  ${siteUrl}/sitemap.xml 이 브라우저에서 열리는지 먼저 확인하세요.`
    );
  }
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const urlList = await collectUrls();
if (urlList.length === 0) fail("알릴 주소가 없습니다.");

// 키 파일이 실제로 열리는지 먼저 확인한다. 안 열리면 검색엔진이 요청을 버린다.
const keyLocation = `${siteUrl}/indexnow-key.txt`;
const keyRes = await fetch(keyLocation).catch(() => null);
const served = keyRes && keyRes.ok ? (await keyRes.text()).trim() : "";
if (served !== key) {
  fail(
    `키 파일이 맞지 않습니다: ${keyLocation}\n` +
      `  받은 값: ${served || (keyRes ? `HTTP ${keyRes.status}` : "연결 실패")}\n` +
      `  기대한 값: ${key}\n` +
      `  키를 새로 넣었다면 먼저 배포하세요.`
  );
}

if (dryRun) {
  console.log(`확인만 합니다 — 보내지 않았습니다.`);
  console.log(`  host: ${host}`);
  console.log(`  keyLocation: ${keyLocation} (확인됨)`);
  console.log(`  주소 ${urlList.length}개:`);
  for (const u of urlList) console.log(`    ${u}`);
  process.exit(0);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList }),
}).catch(() => null);

if (!res) fail("IndexNow 서버에 연결하지 못했습니다.");

// 200/202 가 정상. 그 외에는 본문에 이유가 들어온다.
const body = await res.text();
if (!res.ok) fail(`IndexNow 전송 실패 (HTTP ${res.status}) ${body}`);

console.log(`IndexNow 전송 완료 — ${urlList.length}개 주소 (HTTP ${res.status})`);
console.log("빙·네이버·얀덱스가 공유합니다. 구글은 참여하지 않아 서치콘솔이 따로 처리합니다.");
