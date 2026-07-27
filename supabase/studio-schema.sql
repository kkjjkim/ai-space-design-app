-- 카드뉴스(캐러셀) 스튜디오 — 작업물 저장 테이블 + RLS(행 수준 보안)
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
--
-- 로그인은 Supabase Auth(이메일 + 비밀번호)를 씁니다.
--   1) Authentication > Providers > Email 을 켜세요.
--   2) 사용하는 사람이 몇 명뿐이라면 Authentication > Providers > Email 의
--      "Confirm email" 을 꺼두면, 가입하자마자 바로 로그인해서 쓸 수 있습니다.
--      (켜두면 가입 시 확인 메일을 눌러야 하며, 메일 발송 설정이 필요합니다.)

create table if not exists public.carousels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null default '제목 없는 카드뉴스',
  slides jsonb not null default '[]'::jsonb
);

-- 행 수준 보안 켜기: 켜야 아래 정책이 적용된다.
alter table public.carousels enable row level security;

-- 로그인한 사용자는 "자기 것(auth.uid() = user_id)"만 다룰 수 있다.
drop policy if exists "own carousels select" on public.carousels;
create policy "own carousels select" on public.carousels
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "own carousels insert" on public.carousels;
create policy "own carousels insert" on public.carousels
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "own carousels update" on public.carousels;
create policy "own carousels update" on public.carousels
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own carousels delete" on public.carousels;
create policy "own carousels delete" on public.carousels
  for delete to authenticated
  using (auth.uid() = user_id);

-- 내 작업 목록을 최신순으로 빠르게 불러오기 위한 인덱스
create index if not exists carousels_user_updated_idx
  on public.carousels (user_id, updated_at desc);
