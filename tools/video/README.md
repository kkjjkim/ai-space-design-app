# 릴스·쇼츠 편집 작업장 (tools/video)

사이트(Next.js) 코드와 **완전히 분리된** 영상 작업 폴더다. 사이트 빌드·타입체크에는 영향이 없다.

## 깔려 있는 것 (세션 시작 훅이 자동 설치)
| 도구 | 용도 |
|---|---|
| ffmpeg 6.1 (libx264, libass, drawtext, xfade) | 컷편집·인코딩·9:16 변환·음량 정규화 |
| Remotion 4 + React 19 | 코드로 만드는 모션그래픽(타이틀·단어 자막·전환) 렌더러 |
| sherpa-onnx + SenseVoice(2024-07-17) + silero VAD | 음성 → 한국어 자막(단어 단위 타임스탬프). **네트워크 없이** 로컬에서 동작 |
| sherpa-onnx + Whisper large-v3-turbo ONNX | 더 정확한 인식이 필요할 때 `--engine whisper` (느림, 약 1GB, `scripts/get_models.sh --whisper`) |
| kiwipiepy | 인식 결과의 한국어 띄어쓰기 교정 |
| sherpa-onnx + mimic3 ko_KO | 로컬 한국어 TTS. 가이드 음성용. 발음이 투박해 최종 나레이션에는 vidIQ·Higgsfield 보이스를 쓴다 |
| PySceneDetect + OpenCV | 긴 영상에서 장면 전환 지점 찾기 (쇼츠로 자를 구간 고르기) |
| @remotion/captions | SRT 파싱, 틱톡 스타일 자막 묶기 |
| Pillow, numpy, ImageMagick | 썸네일·이미지 합성 |
| 한글 폰트 | Pretendard(9굵기), Noto Sans KR, Noto Serif KR, Black Han Sans, Do Hyeon, Gothic A1 Black |
| Chromium headless shell (`/opt/pw-browsers`) | Remotion 렌더용 브라우저. 별도 다운로드 없음 |

## 기본 작업 흐름
```bash
cd tools/video

# 1) 가로 원본이면 세로로 (중앙 크롭 또는 --blur 배경)
scripts/to_vertical.sh ~/원본.mp4 public/clip.mp4

# 2) 음량을 쇼츠 기준(-14 LUFS)으로
scripts/normalize_audio.sh public/clip.mp4 public/clip_norm.mp4

# 3) 자동 자막 (단어 타임스탬프 JSON + SRT). 기본 엔진은 로컬 SenseVoice 라 네트워크가 필요 없다
python3 scripts/transcribe.py public/clip_norm.mp4 public/clip_caps
#    더 정확히: --engine whisper  (models/ 에 whisper-turbo 가 있어야 함)
#    faster-whisper 를 쓰려면: --engine fw  (huggingface.co 허용 필요)
#    ※ 자동 자막은 반드시 사람이 읽고 오타를 고친다. 특히 고유명사·숫자

# (선택) 긴 원본에서 쇼츠로 자를 구간 찾기
python3 -m scenedetect -i 원본.mp4 -o out detect-adaptive list-scenes

# (선택) 가이드 나레이션 (로컬 TTS, 임시용)
python3 scripts/tts.py "첫 문장입니다." public/guide.wav --speed 1.05

# 4) props.json 작성
cat > props.json <<'JSON'
{
  "media": "clip_norm.mp4",
  "captions": [],             # ← clip_caps.json 의 lines 배열을 붙여넣거나 스크립트로 병합
  "hook": "매출 나는 매장은\n첫 설계부터 다릅니다",
  "brand": "원탑경영컨설팅",
  "accent": "#C9A961",
  "hookSeconds": 2.4
}
JSON

# 5) 렌더 (1080x1920, 30fps, h264 crf18)
pnpm render Shorts out/result.mp4 --props=./props.json --concurrency=4
```
자막 JSON을 props 에 넣을 때는 `node -e` 한 줄로 병합하면 편하다:
```bash
node -e 'const c=require("./public/clip_caps.json");const p=require("./props.json");p.captions=c.lines;require("fs").writeFileSync("props.json",JSON.stringify(p,null,1))'
```

## 모델 파일
`models/` 는 git 에 올리지 않는다. 세션 시작 훅이 `scripts/get_models.sh` 로 GitHub 릴리스에서 받는다 (약 310MB).
Whisper turbo 까지 받으려면 `scripts/get_models.sh --whisper`.
※ SenseVoice 2025-09-09 int8 판은 한국어를 중국어로 출력하는 불량이 있다. 2024-07-17 판을 쓴다.

## 템플릿 구조
- `src/compositions/Shorts.tsx` — 전체 레이아웃. 배경(영상/이미지 켄번즈) + 상단 진행바 + 브랜드 태그 + 훅 타이틀(명조) + 단어 자막
- `src/compositions/WordCaptions.tsx` — 말하는 단어만 골드로 켜지는 자막. 위치는 하단 420px (쇼츠 UI 안전영역)
- `src/lib/fonts.ts` — 폰트 스택. 제목 = Noto Serif KR, 본문·자막 = Pretendard
- 새 스타일이 필요하면 `compositions/` 에 파일을 추가하고 `Root.tsx` 에 `<Composition>` 을 하나 더 등록한다

## 품질 기준 (이전 결과물이 아쉬웠던 이유를 막기 위한 체크리스트)
1. **첫 1초에 훅 문장**이 화면에 떠 있어야 한다. 2줄 이내, 명조 90px 이상
2. 자막은 **한 줄 3~5단어**, 76px 이상, 흰 글자 + 그림자. 작은 글자로 길게 쓰지 않는다
3. 자막·타이틀은 **위 250px / 아래 400px 안전영역**을 피한다 (플랫폼 UI와 겹침)
4. 배경 위에는 **반드시 그라데이션**을 깔아 글자가 묻히지 않게 한다
5. 음량은 -14 LUFS, 피크 -1.5 dB. 목소리가 작으면 바로 이탈한다
6. 색은 **골드(#C9A961) 하나만** 포인트로. 사이트 디자인 톤과 같게
7. 정지 이미지를 쓸 땐 켄번즈(천천히 확대)라도 넣어 멈춘 느낌을 없앤다
8. 출력은 1080x1920 / 30fps / h264 / crf 18 / yuv420p / faststart

## 미리보기
```bash
pnpm still Shorts out/preview.png --frame=40   # 특정 프레임만 PNG로
pnpm render Shorts out/sample.mp4              # 기본 샘플(8.6초) 렌더, 약 25초 소요
```
