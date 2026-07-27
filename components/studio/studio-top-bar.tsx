"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudioAuth } from "@/components/studio/auth-provider";

// 스튜디오 상단 바: 로고(내 작업으로) + 로그인한 이메일 + 로그아웃.
export function StudioTopBar() {
  const { session, signOut } = useStudioAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace("/studio/login");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/studio"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          카드뉴스 스튜디오
        </Link>
        <div className="flex items-center gap-3">
          {session?.user?.email ? (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session.user.email}
            </span>
          ) : null}
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </div>
    </header>
  );
}
