-- 방문자에게 보여줄 "최근 상담 신청" (소셜 프루프) — 익명·안전 컬럼만 반환.
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
--
-- 보안: leads 테이블은 RLS로 잠겨 있어 anon 이 직접 읽지 못한다.
-- 이 함수는 SECURITY DEFINER 로 동작하되, 이름을 마스킹하고
-- 연락처·메시지·예산·위치 같은 민감 정보는 아예 반환하지 않는다.
-- (누가 anon 키로 직접 호출해도 마스킹된 안전 데이터만 나온다.)

create or replace function public.recent_leads_masked(max_rows int default 12)
returns table (masked_name text, industry text, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select
    case
      when name is null or length(trim(name)) = 0 then '고객님'
      else left(name, 1) || '○○'
    end as masked_name,
    industry,
    created_at
  from public.leads
  order by created_at desc
  limit greatest(1, least(max_rows, 30));
$$;

-- 공개 폼과 동일하게 anon 이 실행할 수 있게 허용 (반환값이 이미 안전하므로 OK)
grant execute on function public.recent_leads_masked(int) to anon;
