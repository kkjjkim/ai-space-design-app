"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session } from "@supabase/supabase-js";
import {
  getSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/supabase-browser";

// 스튜디오 전용 로그인 상태 저장소.
// 화면 어디서든 useStudioAuth() 로 "지금 누가 로그인했는지" 알 수 있다.

type AuthState = {
  session: Session | null;
  loading: boolean; // 세션 확인 중(첫 로딩)
  configured: boolean; // Supabase 환경변수가 있는지
  signOut: () => Promise<void>;
};

const StudioAuthContext = createContext<AuthState | null>(null);

export function StudioAuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseBrowserConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 환경변수가 없으면(배포 전) 로딩만 끝내고 안내 화면을 보여준다.
    if (!configured) {
      setLoading(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();

    // 1) 저장돼 있던 세션을 먼저 읽는다.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // 2) 로그인/로그아웃이 일어나면 실시간으로 반영한다.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  const value = useMemo<AuthState>(
    () => ({
      session,
      loading,
      configured,
      signOut: async () => {
        if (!configured) return;
        await getSupabaseBrowserClient().auth.signOut();
      },
    }),
    [session, loading, configured]
  );

  return (
    <StudioAuthContext.Provider value={value}>
      {children}
    </StudioAuthContext.Provider>
  );
}

export function useStudioAuth(): AuthState {
  const ctx = useContext(StudioAuthContext);
  if (!ctx) {
    throw new Error("useStudioAuth 는 StudioAuthProvider 안에서만 쓸 수 있습니다.");
  }
  return ctx;
}
