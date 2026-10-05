---
name: shorts-edit
description: 릴스·쇼츠·숏폼 영상을 편집·렌더링할 때 사용. 사용자가 "쇼츠 편집", "릴스 만들어", "세로 영상", "자막 넣어줘", "숏폼 렌더" 같은 요청을 하거나 영상·음성 파일을 주면서 짧은 영상을 만들어 달라고 하면 반드시 이 스킬을 따른다. tools/video 의 Remotion 템플릿, ffmpeg 스크립트, 한글 폰트를 쓰고 품질 체크리스트를 통과시킨다. 대본만 필요하면 kimkj-shorts-voice 를 쓴다.
---

# 쇼츠·릴스 편집

작업장은 `tools/video/` 다. 세부 명령은 `tools/video/README.md` 를 먼저 읽는다.
사이트 코드(app/, components/)는 건드리지 않는다. 사이트 package.json 에 영상 라이브러리를 넣지 않는다.

## 시작 전 확인 (매번)
```bash
fc-list : family | grep -c Pretendard        # 0이면 .claude/hooks/session-start.sh 를 먼저 실행
ls tools/video/node_modules/.bin/remotion    # 없으면 (cd tools/video && pnpm install)
```

## 순서
1. **재료 정리**: 영상·사진·음성 파일을 `tools/video/public/` 에 복사한다. 가로 영상은 `scripts/to_vertical.sh` 로 9:16 으로 바꾼다. 인물이 중앙에 없으면 `--blur` 를 쓴다.
2. **소리**: `scripts/normalize_audio.sh` 로 -14 LUFS 에 맞춘다. 건너뛰지 않는다.
3. **자막**: 음성이 있으면 `scripts/transcribe.py` 로 단어 타임스탬프를 뽑는다. huggingface.co 가 막혀 있으면 사용자에게 대본을 받아 `public/sample/captions.json` 형식으로 직접 타이밍을 적는다. 오타·띄어쓰기는 반드시 사람이 읽는 것처럼 고친다.
4. **훅 문장**: 첫 1초에 뜰 한 줄을 정한다. 사용자 대본에 없으면 핵심 주장 한 문장을 뽑아 제안한다. 2줄, 각 줄 10자 안팎.
5. **props.json 작성 → 렌더**: `pnpm render Shorts out/<이름>.mp4 --props=./props.json --concurrency=4`
6. **눈으로 검수**: 렌더 전후로 `pnpm still Shorts out/check.png --frame=N` 으로 훅 구간·자막 구간·마지막 구간 프레임을 3장 뽑아 Read 로 직접 본다. 글자 잘림, 폰트 깨짐, 안전영역 침범이 있으면 고치고 다시 렌더한다.
7. **전달**: 완성 mp4 를 SendUserFile 로 보낸다. 어떤 훅 문장·자막 스타일을 썼는지 두 줄로 알린다.

## 품질 기준 (하나라도 어기면 다시 만든다)
- 출력 1080x1920, 30fps, h264, crf 18, yuv420p, faststart
- 첫 1초 안에 훅 문장. 명조(Noto Serif KR) 90px 이상
- 자막 한 줄 3~5단어, Pretendard 800, 76px 이상, 흰 글자 + 그림자. 말하는 단어만 골드(#C9A961)
- 위 250px, 아래 400px 은 비운다 (플랫폼 UI 영역)
- 배경 위에 그라데이션 없이 글자를 올리지 않는다
- 포인트 색은 골드 하나. 사이트 디자인 톤과 같게. 순백 배경 금지
- 정지 이미지는 켄번즈 적용. 멈춘 화면 금지
- 무거운 효과 남발 금지. 전환은 컷 또는 짧은 페이드만
- 30초 이하를 기본으로. 길어지면 사용자에게 먼저 묻는다

## 하지 말 것
- 사이트 CLAUDE.md 금지선은 여기서도 유효하다: "비교견적" 문구 금지, AI 생성 인테리어를 실제 시공 사례처럼 쓰지 않기, 숫자·실적 지어내지 않기
- 자막을 못 뽑았다고 자막 없이 내보내지 않는다. 사용자에게 대본을 요청한다
- 렌더 결과를 보지 않고 "완성"이라고 하지 않는다
