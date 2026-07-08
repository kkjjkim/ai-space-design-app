-- leads 테이블에 상태 컬럼 추가 (정상 / 의심 / 스팸 구분용).
-- ⚠️ 실행 전 운영자 확인 필요. Supabase 대시보드 > SQL Editor 에서 실행.
--
-- 이 컬럼이 없어도 코드는 정상 동작한다(의심 건도 저장되고 알림만 안 감).
-- 컬럼을 추가하면, Table Editor 에서 각 신청의 정상/의심 여부를 눈으로 확인할 수 있다.

alter table public.leads
  add column if not exists status text not null default '정상';

-- 의심 건만 빠르게 보기 위한 인덱스(선택)
create index if not exists leads_status_idx on public.leads (status);
