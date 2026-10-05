#!/bin/bash
# 쇼츠 기준 음량(-14 LUFS)으로 맞추고 피크를 잡는다. 목소리가 작게 들리는 문제를 없앤다.
# 사용: scripts/normalize_audio.sh input.mp4 output.mp4
set -euo pipefail
ffmpeg -y -i "$1" -af "loudnorm=I=-14:TP=-1.5:LRA=11,highpass=f=80" -c:v copy -c:a aac -b:a 192k "$2"
echo "-> $2"
