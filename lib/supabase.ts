import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// 환경변수는 코드에 직접 쓰지 않는다 (AGENTS.md 7번). 모두 env 로만.
// service_role 키는 서버에서만. 공개 폼 제출은 anon 키 + RLS 로 안전하게.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(url && anonKey);
}

// 서버 라우트에서 사용하는 anon 클라이언트.
// (insert 만 허용하는 RLS 정책 위에서 동작하므로 anon 으로 충분하다.)
export function getSupabaseServerClient(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase 환경변수가 없습니다. NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 를 설정하세요."
    );
  }
  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}
