#!/usr/bin/env python3
"""
영상/음성에서 한국어 자막을 단어 타임스탬프까지 뽑아낸다.
결과: <출력>.json (Remotion용), <출력>.srt (일반 편집기용)

엔진 (기본 auto: sensevoice → faster-whisper 순으로 가능한 것을 쓴다)
  --engine sensevoice   로컬 모델(models/), 네트워크 불필요. CPU에서 빠르다. 토큰 타임스탬프 지원
  --engine whisper      로컬 whisper-turbo ONNX(models/). 더 정확하지만 느리고 메모리 많이 씀
  --engine fw           faster-whisper. huggingface.co 가 열려 있어야 모델을 받는다

사용:  python3 scripts/transcribe.py input.mp4 public/clip_caps
옵션:  --max-words 4   (한 줄 단어 수. 쇼츠는 3~5가 읽기 좋다)
"""
import argparse, json, pathlib, subprocess, sys, tempfile

HERE = pathlib.Path(__file__).resolve().parent.parent
MODELS = HERE / "models"

def to_wav16k(src: str) -> str:
    """어떤 입력이든 16kHz 모노 wav로. ffmpeg가 디코딩을 맡는다."""
    out = tempfile.NamedTemporaryFile(suffix=".wav", delete=False).name
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", src, "-ac", "1", "-ar", "16000", "-f", "wav", out], check=True)
    return out

def read_wav(path):
    import soundfile as sf
    samples, sr = sf.read(path, dtype="float32")
    if samples.ndim > 1:
        samples = samples.mean(axis=1)
    return samples, sr

def vad_segments(samples, sr):
    """silero VAD로 말하는 구간만 자른다. 긴 영상도 안정적으로 처리하기 위해서."""
    import sherpa_onnx
    cfg = sherpa_onnx.VadModelConfig()
    cfg.silero_vad.model = str(MODELS / "silero_vad.onnx")
    cfg.silero_vad.threshold = 0.5
    cfg.silero_vad.min_silence_duration = 0.35
    cfg.silero_vad.min_speech_duration = 0.25
    cfg.silero_vad.max_speech_duration = 20
    cfg.sample_rate = sr
    vad = sherpa_onnx.VoiceActivityDetector(cfg, buffer_size_in_seconds=120)
    window = cfg.silero_vad.window_size
    segs = []
    for i in range(0, len(samples), window):
        vad.accept_waveform(samples[i:i + window])
        while not vad.empty():
            s = vad.front
            segs.append((s.start / sr, s.samples))
            vad.pop()
    vad.flush()
    while not vad.empty():
        s = vad.front
        segs.append((s.start / sr, s.samples))
        vad.pop()
    return segs

def fix_spacing(text):
    """SenseVoice 는 한국어 띄어쓰기를 자주 틀린다. kiwi(형태소 분석기)로 교정한다. 없으면 그대로 둔다."""
    global _KIWI
    try:
        if _KIWI is None:
            from kiwipiepy import Kiwi
            _KIWI = Kiwi()
        return _KIWI.space(text)
    except Exception:
        return text
_KIWI = None

def tokens_to_words(text, tokens, stamps, offset, seg_end):
    """문장(띄어쓰기 교정됨)의 글자 하나하나에 토큰 타임스탬프를 붙인 뒤 단어로 묶는다."""
    char_times = []
    for tok, ts in zip(tokens, stamps):
        for ch in tok.replace("▁", "").replace(" ", ""):
            char_times.append((ch, ts))
    words, ci = [], 0
    for w in text.split():
        chars = [c for c in w if not c.isspace()]
        start = char_times[ci][1] if ci < len(char_times) else (words[-1]["start"] + 0.2 if words else 0.0)
        ci += len(chars)
        words.append({"text": w, "start": round(offset + start, 3), "end": None})
    for i, w in enumerate(words):
        nxt = words[i + 1]["start"] if i + 1 < len(words) else round(offset + seg_end, 3)
        w["end"] = round(max(w["start"] + 0.12, nxt), 3)
    return words

def run_sensevoice(wav, max_words):
    import sherpa_onnx
    mdir = next(MODELS.glob("sherpa-onnx-sense-voice*"))
    rec = sherpa_onnx.OfflineRecognizer.from_sense_voice(
        model=str(next(mdir.glob("model*.onnx"))), tokens=str(mdir / "tokens.txt"),
        num_threads=4, language="ko", use_itn=True,
    )
    import numpy as np
    samples, sr = read_wav(wav)
    pad = 0.6  # 구간 앞뒤 무음. 짧은 구간에서 띄어쓰기가 무너지는 걸 크게 줄인다
    words = []
    for start, seg in vad_segments(samples, sr):
        z = np.zeros(int(pad * sr), dtype=np.float32)
        s = rec.create_stream(); s.accept_waveform(sr, np.concatenate([z, seg, z])); rec.decode_stream(s)
        r = s.result
        if not r.text.strip():
            continue
        text = fix_spacing(r.text)
        if r.timestamps:
            words += tokens_to_words(text, r.tokens, [max(0.0, t - pad) for t in r.timestamps], start, len(seg) / sr)
        else:  # 타임스탬프가 없으면 구간 길이를 글자 수 비례로 나눈다
            parts = text.split(); dur = len(seg) / sr; n = sum(len(p) for p in parts) or 1; t = start
            for p in parts:
                d = dur * len(p) / n; words.append({"text": p, "start": round(t, 3), "end": round(t + d, 3)}); t += d
    return words, len(samples) / sr

def run_whisper_onnx(wav, max_words):
    import sherpa_onnx
    mdir = next(MODELS.glob("sherpa-onnx-whisper-*"))
    enc = next(mdir.glob("*encoder*.onnx")); dec = next(mdir.glob("*decoder*.onnx"))
    rec = sherpa_onnx.OfflineRecognizer.from_whisper(
        encoder=str(enc), decoder=str(dec), tokens=str(next(mdir.glob("*tokens.txt"))),
        language="ko", task="transcribe", num_threads=4, enable_token_timestamps=True,
    )
    samples, sr = read_wav(wav)
    words = []
    for start, seg in vad_segments(samples, sr):
        s = rec.create_stream(); s.accept_waveform(sr, seg); rec.decode_stream(s)
        r = s.result
        if not r.text.strip():
            continue
        # whisper 토큰은 바이트 단위라 한글이 쪼개질 수 있어 문장 단위 길이 비례로 배분한다
        parts = r.text.split(); dur = len(seg) / sr; n = sum(len(p) for p in parts) or 1; t = start
        for p in parts:
            d = dur * len(p) / n; words.append({"text": p, "start": round(t, 3), "end": round(t + d, 3)}); t += d
    return words, len(samples) / sr

def run_faster_whisper(src, model):
    from faster_whisper import WhisperModel
    m = WhisperModel(model, device="cpu", compute_type="int8")
    segments, info = m.transcribe(src, language="ko", word_timestamps=True, vad_filter=True, beam_size=5)
    words = []
    for seg in segments:
        for w in seg.words or []:
            if w.word.strip():
                words.append({"text": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})
    return words, info.duration

def group_lines(words, max_words):
    lines, cur = [], []
    for w in words:
        cur.append(w)
        if len(cur) >= max_words or w["text"][-1] in ".?!。":
            lines.append(cur); cur = []
    if cur:
        lines.append(cur)
    out = [{"start": ws[0]["start"], "end": ws[-1]["end"] + 0.15, "words": ws} for ws in lines]
    # 줄끼리 겹치지 않게 하고, 1초 이내 간격이면 다음 줄 시작까지 유지해 자막이 깜빡이지 않게 한다
    for i in range(len(out) - 1):
        nxt = out[i + 1]["start"]
        if out[i]["end"] > nxt or nxt - out[i]["end"] < 1.0:
            out[i]["end"] = nxt
    return out

def fmt_srt(t):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02}:{int(m):02}:{int(s):02},{int((s - int(s)) * 1000):03}"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input"); ap.add_argument("output", help="확장자 없는 출력 경로")
    ap.add_argument("--engine", default="auto", choices=["auto", "sensevoice", "whisper", "fw"])
    ap.add_argument("--fw-model", default="large-v3-turbo")
    ap.add_argument("--max-words", type=int, default=4)
    a = ap.parse_args()

    engine = a.engine
    if engine == "auto":
        engine = "sensevoice" if list(MODELS.glob("sherpa-onnx-sense-voice*")) else "fw"
    print(f"engine: {engine}", file=sys.stderr)

    if engine == "fw":
        words, duration = run_faster_whisper(a.input, a.fw_model)
    else:
        wav = to_wav16k(a.input)
        words, duration = (run_sensevoice if engine == "sensevoice" else run_whisper_onnx)(wav, a.max_words)
        pathlib.Path(wav).unlink(missing_ok=True)

    lines = group_lines(words, a.max_words)
    out = pathlib.Path(a.output); out.parent.mkdir(parents=True, exist_ok=True)
    out.with_suffix(".json").write_text(
        json.dumps({"language": "ko", "duration": round(duration, 3), "lines": lines}, ensure_ascii=False, indent=1), encoding="utf-8")
    with out.with_suffix(".srt").open("w", encoding="utf-8") as f:
        for i, l in enumerate(lines, 1):
            f.write(f"{i}\n{fmt_srt(l['start'])} --> {fmt_srt(l['end'])}\n{' '.join(w['text'] for w in l['words'])}\n\n")
    print(f"{len(words)} words / {len(lines)} lines -> {out}.json, {out}.srt", file=sys.stderr)
    print(" ".join(w["text"] for w in words))

if __name__ == "__main__":
    main()
