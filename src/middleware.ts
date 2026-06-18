import { NextRequest, NextResponse } from "next/server";

// auth.ts 는 node 전용 모듈(crypto)을 import 하므로 edge 미들웨어에서 가져오지 않는다.
const SESSION_COOKIE_NAME = "admin_session";

// 가벼운 게이트: 쿠키 존재 여부만 확인한다.
// 실제 서명 검증은 node 런타임의 서버 컴포넌트/라우트(isAuthenticated)에서 수행한다.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
