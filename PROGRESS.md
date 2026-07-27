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
- [x] 디자인 다듬기 — AvroKO 벤치마크 반영: 히어로 에디토리얼 레이아웃
      (좌 대형 명조 헤드라인 + 우 골드 이탤릭 인용구), 풀블리드 슬라이더 캡션 바
      (둥근 화살표 · 프로젝트명 · "01 OF 08"), 레터스페이싱 로고
- [x] 비주얼 중심 재구성 (ZORGE 시네마틱 벤치마크) — 텍스트 과다 해소
      · 시네마틱 풀블리드 영상 히어로(SiteHero) + 어두운 히어로 위 밝은 헤더
      · 풀블리드 시네마틱 밴드(CinematicBand): 진짜문제 / 가격 섹션
      · 우리 방식 = 이미지 타일 4단계, 공감 = 이미지+카피 분할
      · MediaFrame 공용 슬롯, 포트폴리오 데이터화(lib/portfolio.ts)
- [x] 컨셉 제안 5종(SORA/MELLOW/EMBER/NEST/PLATE) — lib/concepts.ts,
      홈 갤러리 + /concepts 상세 페이지. "실제 시공 사례 아님(컨셉 예시)" 명시 (AGENTS.md 7번 준수)
- [x] public/ASSETS.md — 영상/컨셉이미지/실사진 드롭인 가이드

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
