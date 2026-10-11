/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 사진은 바뀌면 파일 이름을 바꾸는 방식이라 브라우저에 30일 보관시킨다.
  // 재방문·여러 페이지 이동 때 같은 사진을 다시 묻지 않아 요청·전송량이 준다(Vercel 비용 방어, 가치잇다 9월 교훈).
  async headers() {
    const longCache = [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }];
    return [
      { source: "/hero/:path*", headers: longCache },
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/concepts/:path*", headers: longCache },
      { source: "/insights/:file(.*\\.(?:jpg|png|webp))", headers: longCache },
      { source: "/interior/:file(.*\\.(?:jpg|png|webp))", headers: longCache },
    ];
  },
};

export default nextConfig;
