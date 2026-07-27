"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudioAuth } from "@/components/studio/auth-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type Mode = "login" | "signup";

export default function StudioLoginPage() {
  const { session, loading, configured } = useStudioAuth();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // 이미 로그인돼 있으면 내 작업 목록으로 보낸다.
  useEffect(() => {
    if (!loading && session) {
      router.replace("/studio");
    }
  }, [loading, session, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      setError("비밀번호는 6자 이상으로 정하세요.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = getSupabaseBrowserClient();
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        // "이메일 확인"이 켜져 있으면 세션이 바로 생기지 않는다.
        if (!data.session) {
          setNotice(
            "가입 확인 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인하세요."
          );
          setMode("login");
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
      router.replace("/studio");
    } catch (err) {
      setError(translateAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  // 아직 세션 확인 중
  if (loading) {
    return <CenteredMessage>불러오는 중…</CenteredMessage>;
  }

  // 환경변수가 없을 때(배포 전) — 무엇을 해야 하는지 안내
  if (!configured) {
    return (
      <CenteredMessage>
        <div className="max-w-md space-y-3 text-left">
          <h1 className="text-lg font-semibold text-foreground">
            아직 준비 중이에요
          </h1>
          <p className="text-sm text-muted-foreground">
            로그인 저장소(Supabase) 연결이 필요합니다. 배포할 때 환경변수{" "}
            <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
            과{" "}
            <code className="rounded bg-muted px-1">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{" "}
            를 넣고, <code className="rounded bg-muted px-1">supabase/studio-schema.sql</code>{" "}
            를 실행하면 켜집니다.
          </p>
        </div>
      </CenteredMessage>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            카드뉴스 스튜디오
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login"
              ? "로그인하면 내가 만든 작업물이 그대로 남아 있어요."
              : "이메일과 비밀번호로 계정을 만드세요."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
          {notice ? (
            <p className="text-sm text-primary">{notice}</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting
              ? "잠시만요…"
              : mode === "login"
                ? "로그인"
                : "계정 만들기"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <button
              type="button"
              className="underline underline-offset-4 hover:text-foreground"
              onClick={() => {
                setMode("signup");
                setError(null);
                setNotice(null);
              }}
            >
              처음이세요? 계정 만들기
            </button>
          ) : (
            <button
              type="button"
              className="underline underline-offset-4 hover:text-foreground"
              onClick={() => {
                setMode("login");
                setError(null);
                setNotice(null);
              }}
            >
              이미 계정이 있어요, 로그인
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CenteredMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

// Supabase 인증 에러를 사람이 읽기 쉬운 한국어로 바꾼다.
function translateAuthError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (/Invalid login credentials/i.test(message)) {
    return "이메일 또는 비밀번호가 맞지 않아요.";
  }
  if (/already registered|already exists/i.test(message)) {
    return "이미 가입된 이메일이에요. 로그인해 주세요.";
  }
  if (/rate limit/i.test(message)) {
    return "잠시 후 다시 시도해 주세요.";
  }
  return message || "문제가 생겼어요. 다시 시도해 주세요.";
}
