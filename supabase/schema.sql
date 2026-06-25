-- 인테리어 상담 신청(leads) 테이블 + RLS
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  industry text,        -- 업종
  location text,        -- 매장 위치·평수
  budget text,          -- 예산대(선택)
  message text,         -- 하고 싶은 가게 한 줄
  source text           -- 유입 참고(UTM 등, 선택)
);

-- 행 수준 보안 켜기
alter table public.leads enable row level security;

-- 공개 폼은 anon 으로 INSERT 만 허용. (SELECT/UPDATE/DELETE 불가)
-- 신청 목록 확인은 운영자가 Supabase 대시보드(service_role)에서 직접 본다.
drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- 최신순 조회를 위한 인덱스
create index if not exists leads_created_at_idx
  on public.leads (created_at desc);
