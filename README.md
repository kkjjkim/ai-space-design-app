# [브랜드명] — 사업기획 + 공간브랜딩 상담 신청 사이트

고급 매장·레스토랑·대형카페를 준비하는 사장에게 **"경영지도사 + 디자인드비가
창업 첫걸음부터 매출까지 함께한다"**를 보여주고, **무료 컨셉 상담 신청(고객 DB)**을
모으는 사이트입니다. 모든 화면은 이 한 가지 행동(상담 신청)을 위해 존재합니다.

> 기획·카피·디자인 방향은 `PRD.md`, 개발 규약은 `AGENTS.md` 참고.

## 화면
- **메인** (`/`) — 원페이지 스크롤(히어로 → 공감 → 진짜문제 → 비교 → 우리방식 → 증거 → 가격 → 신청폼)
- **포트폴리오** (`/portfolio`) — 시공 사례(실사진 자리)
- **회사·신뢰** (`/company`)
- **서비스** (`/service`) — 경영지도사 × 디자인드비
- **신청 완료** (`/complete`)
- 공통: 상단 내비 + 스크롤 따라다니는 고정 "무료 상담" 버튼

## 기술 스택
- **Next.js 14** (App Router) · **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (AvroKO 톤: 아이보리/차콜/골드, 명조+Pretendard)
- **Supabase** (`leads` 테이블 저장, anon + RLS)
- **Resend** (신청 시 운영자 알림 메일)
- 배포: **Vercel**
- 패키지 매니저: **pnpm** (고정), Node 20.x

## 빠른 시작
```bash
pnpm install
cp .env.example .env.local   # 키 입력 (아래 참고)
pnpm dev                     # http://localhost:3000
```
> 키가 없어도 사이트는 동작합니다. 폼 제출은 **데모 모드**(저장·메일 건너뜀)로 완료 페이지까지 흐름을 보여줍니다.

## 검증 (작업 완료 기준 — AGENTS.md 4번)
```bash
pnpm typecheck   # 타입체크
pnpm lint        # 린트
pnpm build       # 빌드
```

## 연동 설정

### 1) Supabase
1. supabase.com 에서 프로젝트 생성
2. SQL Editor 에 `supabase/schema.sql` 붙여넣어 실행 (leads 테이블 + RLS: anon INSERT만 허용)
3. Settings → API 에서 URL/anon 키를 `.env.local` 에 입력
4. 신청 목록은 **Supabase 대시보드 Table Editor 에서 직접 확인** (v1은 별도 관리자 화면 없음)

### 2) Resend (알림 메일)
1. resend.com 가입 → 도메인 인증
2. `RESEND_API_KEY`, `LEAD_NOTIFY_TO`(받는 사람), `LEAD_NOTIFY_FROM`(인증 도메인) 입력

## 환경변수 (`.env.example` 참고)
| 변수 | 설명 | 노출 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 공개 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public 키 | 공개 |
| `RESEND_API_KEY` | Resend API 키 | **서버 전용** |
| `LEAD_NOTIFY_TO` | 알림 받을 이메일(쉼표 다중) | 서버 |
| `LEAD_NOTIFY_FROM` | 발신 주소 | 서버 |

> service_role 키는 사용하지 않습니다. 공개 폼은 anon + RLS 로만 동작합니다.
> 비밀키는 절대 코드/깃에 올리지 마세요.

## 운영자가 채울 자리 (지어내지 않음)
- `lib/site.ts` 의 `[브랜드명]`, 실적 숫자 `[ ]`, 로고
- 히어로 배경 이미지/영상, 포트폴리오 **실사진**(로고 없는 컷)
- 푸터 사업자 정보, OG 대표 이미지, `app/layout.tsx` 의 `metadataBase` 배포 도메인

## 구조
```
app/            라우트 (page/layout, api/leads)
components/      ui(shadcn) · layout · 섹션 · 폼
lib/            supabase · leads(zod) · site 설정 · utils
supabase/       schema.sql
PRD.md AGENTS.md PROGRESS.md
```
