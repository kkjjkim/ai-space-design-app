import { NextResponse } from "next/server";
import { site } from "@/lib/site";
import { getAllInsights } from "@/lib/insights";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// IndexNow — 예약 글이 공개되는 날 네이버·빙 등에 "새 글 생겼다"를 바로 알린다.
// 로봇이 알아서 오길 기다리면 며칠 걸리고, 공개 직전에 수동 요청하면 404·400을 받는다
// (10/6 store-branding-order 가 네이버에서 400 수집 오류). 그래서 vercel.json 크론이
// 공개일 아침(KST 10시, ISR 6시간이 지난 뒤)에 이 주소를 부르고, 실제 200이 확인된 글만 보낸다.
// 키는 공개 정보다(키 파일이 public/ 에 그대로 있어야 소유 확인이 된다).
const INDEXNOW_KEY = "2740de808630a6f8be9760f407abeccf";
const ENDPOINTS = [
  "https://searchadvisor.naver.com/indexnow",
  "https://api.indexnow.org/indexnow",
];

function kstDate(offsetDays = 0): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000 + offsetDays * 86400000)
    .toISOString()
    .slice(0, 10);
}

export async function GET(request: Request) {
  // Vercel 크론은 CRON_SECRET 이 설정돼 있으면 Bearer 로 보낸다. 설정돼 있을 때만 검사.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  // 오늘·어제 공개분(크론이 하루 빠져도 다음 날 잡히게).
  const days = new Set([kstDate(0), kstDate(-1)]);
  const candidates = getAllInsights()
    .filter((p) => days.has(p.date))
    .map((p) => `${site.url}/insights/${p.slug}`);

  // 실제로 열리는 글만 보낸다 — 이 요청이 ISR 캐시도 데워 준다.
  const live: string[] = [];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) live.push(url);
    } catch {
      /* 다음 날 다시 시도된다 */
    }
  }
  if (live.length === 0) {
    return NextResponse.json(
      { ok: true, sent: [], candidates },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
  // 목록 페이지도 바뀌었으니 같이 알린다.
  const urlList = [...live, `${site.url}/insights`];

  const body = JSON.stringify({
    host: new URL(site.url).host,
    key: INDEXNOW_KEY,
    keyLocation: `${site.url}/${INDEXNOW_KEY}.txt`,
    urlList,
  });
  const results = await Promise.all(
    ENDPOINTS.map(async (endpoint) => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body,
        });
        return { endpoint, status: res.status };
      } catch (err) {
        return { endpoint, error: err instanceof Error ? err.message : String(err) };
      }
    })
  );
  return NextResponse.json(
    { ok: true, sent: urlList, results },
    { headers: { "Cache-Control": "no-store" } }
  );
}
