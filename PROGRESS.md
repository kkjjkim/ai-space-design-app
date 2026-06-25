# PROGRESS

## 끝낸 것
- [x] 0단계 — 셋업 전환: pnpm 전환, Prisma/관리자 제거, 루트 `app/components/lib` 구조,
      디자인 토큰(AvroKO: 아이보리/차콜/골드 + Noto Serif KR/Pretendard), shadcn/ui 기본 컴포넌트,
      Supabase 클라이언트, zod 스키마, `.env.example`, ESLint
- [x] 1단계 — 공통 레이아웃: 상단 내비(`site-header`) + 스크롤 고정 CTA(`floating-cta`) + 푸터
- [x] 2단계 — 메인 원페이지(섹션 1~8): 히어로/공감/진짜문제/비교표/우리방식/증거+포트폴리오/가격뒤집기/신청폼
      (카피는 PRD 그대로)
- [x] 3단계 — 서브 페이지: 포트폴리오 / 회사·신뢰 / 서비스 / 신청 완료
- [x] 4단계 — 폼 + Supabase 저장 + Resend 알림(`/api/leads`). 키 없으면 데모 모드로 흐름만 동작.
- [x] 검증 루프: typecheck / lint / build 통과

## 다음 할 것 (운영자/대표님)
- [ ] Supabase 프로젝트 생성 → `supabase/schema.sql` 실행 → `.env.local` 에 URL/anon 키 입력
- [ ] Resend 가입 → 도메인 인증 → `RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_FROM` 입력
- [ ] `lib/site.ts` 의 `[브랜드명]`, 실적 숫자 `[ ]` 채우기 / 로고 교체
- [ ] 히어로 배경 이미지·영상, 포트폴리오 실사진(로고 없는 컷) 넣기
- [ ] OG 대표 이미지(`/og.jpg`)와 `metadataBase` 배포 도메인 교체
- [ ] Vercel 배포 + 환경변수 등록

## 지켜야 할 선 (AGENTS.md)
- "비교견적" 기능·문구 금지 / AI 가짜 인테리어를 실제 사례처럼 쓰지 않기
- 비밀키는 환경변수로만, service_role 키는 서버에서만
