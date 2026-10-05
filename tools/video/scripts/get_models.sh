#!/bin/bash
# 음성 인식·합성 모델을 GitHub 릴리스에서 받는다 (huggingface 막힌 환경용). 이미 있으면 건너뛴다.
# 사용: scripts/get_models.sh            # VAD + SenseVoice(한국어 인식) + 한국어 TTS  (약 310MB)
#       scripts/get_models.sh --whisper  # 위 + Whisper large-v3-turbo ONNX (추가 약 1GB, 더 정확하지만 느림)
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
M="$HERE/models"; mkdir -p "$M"; cd "$M"
B=https://github.com/k2-fsa/sherpa-onnx/releases/download

fetch_tar() { # $1=폴더이름 $2=URL
  if [ -d "$1" ]; then echo "[models] $1 있음"; return; fi
  echo "[models] 받는 중: $1"; curl -sSL -o "$1.tar.bz2" "$2"; tar xjf "$1.tar.bz2"; rm -f "$1.tar.bz2"
}

[ -f silero_vad.onnx ] || { echo "[models] 받는 중: silero_vad.onnx"; curl -sSL -o silero_vad.onnx "$B/asr-models/silero_vad.onnx"; }

# 주의: 2025-09-09 int8 판은 한국어를 중국어로 출력하는 불량이 있어 2024-07-17 판을 쓴다.
fetch_tar sherpa-onnx-sense-voice-zh-en-ja-ko-yue-2024-07-17 "$B/asr-models/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-2024-07-17.tar.bz2"
rm -f sherpa-onnx-sense-voice-zh-en-ja-ko-yue-2024-07-17/model.onnx   # int8만 쓴다 (품질 차이 없음, 700MB 절약)

fetch_tar vits-mimic3-ko_KO-kss_low "$B/tts-models/vits-mimic3-ko_KO-kss_low.tar.bz2"

if [ "${1:-}" = "--whisper" ]; then
  fetch_tar sherpa-onnx-whisper-turbo "$B/asr-models/sherpa-onnx-whisper-turbo.tar.bz2"
fi
echo "[models] 준비 완료"; du -sh "$M"/* 2>/dev/null
