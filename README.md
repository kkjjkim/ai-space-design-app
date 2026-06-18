# 공간디자인 — 인테리어 상담 DB 창출 웹앱

인테리어 잠재고객(리드)을 수집하고 관리하는 풀스택 웹앱입니다.
방문자가 **무료 상담 신청 랜딩페이지**에서 정보를 남기면, **관리자 대시보드**에서
리드를 조회·필터·상태관리하고 CSV로 내보낼 수 있습니다.

## 주요 기능

### 공개 랜딩페이지 (`/`)
- 히어로 + 신뢰 지표 + 특징 소개로 구성된 마케팅 랜딩
- 상담 신청 폼: 이름·연락처(필수), 지역·건물유형·평수·예산·희망시기·유입경로·요청사항
- 개인정보 수집 동의 체크, 제출 후 접수 완료 안내
- 서버 측 Zod 검증

### 관리자 대시보드 (`/admin`)
- 비밀번호 로그인 (HMAC 서명 세션 쿠키, 미들웨어 보호)
- 상태별 집계 카드(전체/이번 달/신규/연락완료/상담중/계약/종료)
- 이름·연락처·지역 검색, 상태 필터, 페이지네이션
- 행에서 바로 상태 변경, 상세 패널에서 내부 메모 작성·전화 걸기·삭제
- 리드 목록 CSV 내보내기(엑셀 호환, UTF-8 BOM)

## 기술 스택
- **Next.js 14** (App Router) + **TypeScript**
- **Prisma** + **SQLite**(개발) — 운영 시 `DATABASE_URL`만 바꾸면 Postgres 등으로 전환
- **Tailwind CSS**
- **Zod** 입력 검증

## 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정 (.env)
cp .env.example .env
#   ADMIN_PASSWORD, AUTH_SECRET 를 안전한 값으로 변경하세요.

# 3. 데이터베이스 생성
npx prisma db push

# 4. (선택) 샘플 데이터 주입
npm run db:seed

# 5. 개발 서버 실행
npm run dev
```

- 랜딩페이지: http://localhost:3000
- 관리자: http://localhost:3000/admin  (기본 비밀번호: `.env`의 `ADMIN_PASSWORD`)

## 환경변수

| 변수 | 설명 |
| --- | --- |
| `DATABASE_URL` | DB 접속 문자열 (기본: `file:./dev.db`) |
| `ADMIN_PASSWORD` | 관리자 로그인 비밀번호 |
| `AUTH_SECRET` | 세션 쿠키 서명용 시크릿 (긴 랜덤 문자열) |

## 디렉터리 구조

```
prisma/
  schema.prisma        # Lead 모델
  seed.ts              # 샘플 데이터
src/
  app/
    page.tsx           # 랜딩페이지
    admin/page.tsx     # 관리자 대시보드(서버: 인증+집계)
    admin/login/       # 관리자 로그인
    api/leads/         # 리드 생성(공개)/목록(관리자)/수정/삭제
    api/admin/login/   # 로그인·로그아웃
  components/
    LeadForm.tsx       # 상담 신청 폼
    AdminDashboard.tsx # 대시보드 UI
  lib/                 # prisma, auth, 검증, 상수
  middleware.ts        # /admin 보호
```

## 운영 전 체크리스트
- [ ] `ADMIN_PASSWORD`, `AUTH_SECRET`를 강력한 값으로 교체
- [ ] `DATABASE_URL`을 운영 DB(예: Postgres)로 전환 후 `prisma migrate deploy`
- [ ] HTTPS 환경에서 배포(쿠키 `secure` 자동 적용)
