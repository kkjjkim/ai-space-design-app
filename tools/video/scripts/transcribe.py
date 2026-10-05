#!/usr/bin/env python3
"""
영상/음성에서 한국어 자막을 단어 타임스탬프까지 뽑아낸다.
결과: <출력>.json (Remotion용), <출력>.srt (일반 편집기용)

사용:  python3 scripts/transcribe.py input.mp4 public/sample/captions
옵션:  --model large-v3-turbo  (기본. 한국어 정확도 좋음, CPU 4코어에서 60초 영상 약 1~2분)
       --model small           (빠르지만 오타 많음)
       --max-words 4           (한 줄에 보여줄 단어 수. 쇼츠는 3~5가 읽기 좋다)
"""
import argparse, json, sys, pathlib
from faster_whisper import WhisperModel

def fmt_srt(t: float) -> str:
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02}:{int(m):02}:{int(s):02},{int((s - int(s)) * 1000):03}"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("output", help="확장자 없는 출력 경로")
    ap.add_argument("--model", default="large-v3-turbo")
    ap.add_argument("--max-words", type=int, default=4)
    ap.add_argument("--language", default="ko")
    a = ap.parse_args()

    model = WhisperModel(a.model, device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        a.input, language=a.language, word_timestamps=True,
        vad_filter=True, beam_size=5,
    )

    words = []
    for seg in segments:
        for w in seg.words or []:
            text = w.word.strip()
            if text:
                words.append({"text": text, "start": round(w.start, 3), "end": round(w.end, 3)})

    # 단어를 max_words 개씩 묶어 한 줄로. 문장부호에서 끊어 읽기 쉽게.
    lines, cur = [], []
    for w in words:
        cur.append(w)
        ends_sentence = w["text"][-1] in ".?!。"
        if len(cur) >= a.max_words or ends_sentence:
            lines.append(cur); cur = []
    if cur:
        lines.append(cur)

    out_lines = []
    for ws in lines:
        out_lines.append({"start": ws[0]["start"], "end": ws[-1]["end"] + 0.15, "words": ws})
    # 줄 사이 공백을 없애 자막이 깜빡이지 않게: 다음 줄 시작까지 현재 줄을 유지
    for i in range(len(out_lines) - 1):
        out_lines[i]["end"] = max(out_lines[i]["end"], out_lines[i + 1]["start"])

    duration = info.duration or (out_lines[-1]["end"] if out_lines else 0)
    out = pathlib.Path(a.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.with_suffix(".json").write_text(
        json.dumps({"language": a.language, "duration": round(duration, 3), "lines": out_lines}, ensure_ascii=False, indent=1),
        encoding="utf-8",
    )
    with out.with_suffix(".srt").open("w", encoding="utf-8") as f:
        for i, l in enumerate(out_lines, 1):
            f.write(f"{i}\n{fmt_srt(l['start'])} --> {fmt_srt(l['end'])}\n{' '.join(w['text'] for w in l['words'])}\n\n")
    print(f"{len(words)} words / {len(out_lines)} lines -> {out}.json, {out}.srt", file=sys.stderr)

if __name__ == "__main__":
    main()
