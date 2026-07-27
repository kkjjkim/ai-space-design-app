import type { Metadata } from "next";
import { StudioAuthProvider } from "@/components/studio/auth-provider";

// 스튜디오는 사장님·사모님이 로그인해서 쓰는 도구다.
// 검색엔진에 노출될 필요가 없으므로 색인을 막는다.
export const metadata: Metadata = {
  title: "카드뉴스 스튜디오",
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudioAuthProvider>
      <div className="min-h-screen bg-background text-foreground">{children}</div>
    </StudioAuthProvider>
  );
}
