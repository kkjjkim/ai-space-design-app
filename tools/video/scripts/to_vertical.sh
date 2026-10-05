#!/bin/bash
# 가로 영상을 9:16(1080x1920)으로 바꾼다. 기본은 중앙 크롭, --blur 를 주면 위아래 블러 배경.
# 사용: scripts/to_vertical.sh input.mp4 public/clip.mp4 [--blur]
set -euo pipefail
in="$1"; out="$2"; mode="${3:-crop}"
if [ "$mode" = "--blur" ]; then
  ffmpeg -y -i "$in" -filter_complex \
    "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:8[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2" \
    -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "$out"
else
  ffmpeg -y -i "$in" -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
    -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "$out"
fi
echo "-> $out"
