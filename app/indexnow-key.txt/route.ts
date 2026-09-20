import { site } from "@/lib/site";

// IndexNow 키 파일.
// 규격상 키를 사이트 어딘가에 공개해 두고, 알림을 보낼 때 그 주소(keyLocation)를 같이 준다.
// 검색엔진은 이 파일을 읽어 "이 사이트 주인이 맞다"를 확인한다.
// 기본 규격은 /{키}.txt 지만, keyLocation 을 쓰면 파일 이름은 자유다.
// 파일명을 고정해 둬야 lib/site.ts 의 키만 바꿔도 알아서 따라간다.
export const dynamic = "force-static";

export function GET() {
  return new Response(site.indexNowKey, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
