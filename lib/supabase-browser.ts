"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// 브라우저(사모님·사장님 화면)에서 쓰는 Supabase 클라이언트.
// 로그인 세션을 localStorage 에 저장(persistSession)해서
// 창을 닫았다 다시 열어도 로그인 상태와 작업물이 유지된다.
//
// 여기서도 anon 키만 쓴다. 각 사용자는 RLS(행 수준 보안) 덕분에
// "자기 작업물"만 읽고/쓰고/지울 수 있다. (supabase/studio-schema.sql 참고)
// service_role 키는 절대 브라우저로 내보내지 않는다. (AGENTS.md 7번)

let client: SupabaseClient | null = null;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseBrowserConfigured(): boolean {
  return Boolean(url && anonKey);
}

// 싱글턴으로 한 번만 만든다(세션·리스너 중복 방지).
export function getSupabaseBrowserClient(): SupabaseClient {
  if (client) return client;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase 환경변수가 없습니다. NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 를 설정하세요."
    );
  }
  client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}
