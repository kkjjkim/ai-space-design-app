/** @type {import('next').NextConfig} */

// 보안 헤더. 스크립트 CSP(script-src)는 넣지 않았다 — GA4·메타 픽셀·Turnstile이 인라인 스크립트라
// nonce 없이 걸면 측정·캡차가 깨진다. 프레임 삽입(클릭재킹)·MIME 추측·레퍼러 유출·불필요한 기기 권한만 막는다.
// HSTS는 Vercel이 자동으로 붙인다.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig = {
  reactStrictMode: true,
  // 사진은 바뀌면 파일 이름을 바꾸는 방식이라 브라우저에 30일 보관시킨다.
  // 재방문·여러 페이지 이동 때 같은 사진을 다시 묻지 않아 요청·전송량이 준다(Vercel 비용 방어, 가치잇다 9월 교훈).
  async headers() {
    const longCache = [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }];
    return [
      { source: "/(.*)", headers: securityHeaders },
      { source: "/hero/:path*", headers: longCache },
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/concepts/:path*", headers: longCache },
      { source: "/insights/:file(.*\\.(?:jpg|png|webp))", headers: longCache },
      { source: "/interior/:file(.*\\.(?:jpg|png|webp))", headers: longCache },
    ];
  },
};

export default nextConfig;
