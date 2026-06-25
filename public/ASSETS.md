# 미디어 자산 넣는 곳 (운영자용)

이 폴더에 파일을 넣고 아래 이름으로 맞추면 사이트에 바로 반영됩니다.
파일을 넣지 않으면 자리표시(placeholder)가 보입니다.

## 1) 메인 배너 영상 (히어로)
- `public/hero/banner.mp4` — 자동 재생/무음/반복되는 배경 영상 (3D 공간 워크스루 추천)
- `public/hero/poster.jpg` — 영상 로딩 전 첫 화면 이미지
- 권장: 가로형(16:9), 8~15초, 1080p, 5MB 내외(모바일 성능). 어두운 톤이면 글자가 잘 보입니다.

## 2) 컨셉 제안 이미지 (5종)
`public/concepts/` 에 아래 이름으로 넣으세요. (가로형 4:3 권장)
- `sora.jpg`   → SORA ROASTERS (프리미엄 로스터리 카페)
- `mellow.jpg` → MELLOW OVEN (감성 베이커리)
- `ember.jpg`  → EMBER TABLE (파인 캐주얼 레스토랑)
- `nest.jpg`   → NEST EDIT (라이프스타일 편집샵)
- `plate.jpg`  → PLATE LAB (프리미엄 패스트 캐주얼)
> 컨셉 텍스트는 `lib/concepts.ts` 에서 수정.
> ⚠️ 이 이미지들은 화면에 "컨셉 제안 예시"로 표기됩니다(실제 시공 사례 아님).

## 3) 포트폴리오 실사진
`public/portfolio/` 에 실사진을 넣고, `lib/portfolio.ts` 의 목록에서
각 항목의 `image` 경로와 `name` 을 채우세요. (예: `image: "/portfolio/projectA-01.jpg"`)
> ⚠️ 포트폴리오는 **실제 시공 사진(로고 없는 컷)**만 사용합니다.

## 4) 그 외 분위기 이미지
공감 섹션 등 분위기 컷은 각 컴포넌트의 `MediaFrame src` 에 경로를 넣으면 됩니다.

---
넣은 뒤 `pnpm build` 로 확인하세요. 이미지 용량이 크면 미리 웹용으로 최적화(80% 품질, 폭 1600px 내외) 권장.
