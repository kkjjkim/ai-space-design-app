#!/bin/bash
# Claude Code 클라우드 세션이 시작될 때 돌아가는 설치 스크립트.
# 목적: 사이트 개발 의존성 + 릴스·쇼츠 편집 도구(한글 폰트, Remotion, 자동 자막)를 매 세션 준비해 둔다.
# 로컬에서는 아무것도 하지 않는다. 여러 번 실행해도 안전하다.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
VIDEO_DIR="$ROOT/tools/video"
FONT_DIR="$HOME/.fonts"

log() { echo "[session-start] $*"; }

# 1) 사이트 의존성 (pnpm install은 캐시를 재사용하므로 두 번째부터는 빠르다)
log "pnpm install (site)"
(cd "$ROOT" && pnpm install --prefer-offline --frozen-lockfile 2>&1 | tail -1)

# 2) 한글 폰트: Pretendard + Noto Sans/Serif KR + 쇼츠 제목용 디스플레이 폰트
#    없으면 자막·타이틀이 깨진 네모(두부)로 렌더된다.
if ! fc-list : family 2>/dev/null | grep -q "^Pretendard"; then
  log "installing Korean fonts"
  mkdir -p "$FONT_DIR"
  TMP="$(mktemp -d)"
  curl -sSL -o "$TMP/pretendard.zip" \
    https://github.com/orioncactus/pretendard/releases/download/v1.3.9/Pretendard-1.3.9.zip
  unzip -qo "$TMP/pretendard.zip" -d "$TMP/pretendard"
  find "$TMP/pretendard" -name "Pretendard*.otf" -path "*public/static*" -exec cp {} "$FONT_DIR/" \;
  for family in "Noto+Sans+KR:wght@100..900" "Noto+Serif+KR:wght@200..900" "Black+Han+Sans" "Do+Hyeon" "Gothic+A1:wght@900"; do
    name="$(echo "$family" | tr -d '+:@.' | cut -c1-20)"
    curl -sSL -A "Mozilla/5.0" "https://fonts.googleapis.com/css2?family=$family&display=swap" \
      | grep -oE "https://[^)]+\.(ttf|otf)" | sort -u \
      | while read -r url; do curl -sSL -o "$FONT_DIR/${name}_$(basename "$url")" "$url"; done
  done
  fc-cache -f >/dev/null
  rm -rf "$TMP"
else
  log "Korean fonts already present"
fi

# 3) Remotion(모션그래픽 렌더러) — 사이트 코드와 분리된 tools/video 에만 설치
if [ -f "$VIDEO_DIR/package.json" ]; then
  log "pnpm install (tools/video)"
  (cd "$VIDEO_DIR" && pnpm install --prefer-offline 2>&1 | tail -1)
  # Remotion 안에서 @font-face 로 쓰도록 Pretendard를 public/fonts 에 복사 (git에는 올리지 않음)
  mkdir -p "$VIDEO_DIR/public/fonts"
  cp -n "$FONT_DIR"/Pretendard-*.otf "$VIDEO_DIR/public/fonts/" 2>/dev/null || true
fi

# 4) 자동 자막(faster-whisper) + 이미지 처리 라이브러리
log "pip install (faster-whisper, pillow, numpy)"
pip3 install -q --user --disable-pip-version-check pillow numpy faster-whisper 2>&1 | grep -v "WARNING: Running pip" || true

log "done"
