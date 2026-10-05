#!/usr/bin/env python3
"""
한국어 텍스트 → 음성(wav). 네트워크 없이 로컬 모델(sherpa-onnx)로 돌아간다.
가이드 음성·임시 나레이션용. 최종 나레이션은 vidIQ/Higgsfield 보이스가 더 자연스럽다.

사용:  python3 scripts/tts.py "안녕하세요. 원탑경영컨설팅입니다." public/voice.wav
옵션:  --speed 1.1   (1.0 기본, 쇼츠는 1.05~1.15가 듣기 좋다)
       --model models/<다른 sherpa-onnx vits 모델 폴더>
"""
import argparse, pathlib, sys
import sherpa_onnx, soundfile as sf

HERE = pathlib.Path(__file__).resolve().parent.parent
DEFAULT_MODEL = HERE / "models" / "vits-mimic3-ko_KO-kss_low"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("text")
    ap.add_argument("output")
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--model", default=str(DEFAULT_MODEL))
    a = ap.parse_args()
    m = pathlib.Path(a.model)
    onnx = next(m.glob("*.onnx"))
    cfg = sherpa_onnx.OfflineTtsConfig(
        model=sherpa_onnx.OfflineTtsModelConfig(
            vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                model=str(onnx), tokens=str(m / "tokens.txt"),
                data_dir=str(m / "espeak-ng-data") if (m / "espeak-ng-data").exists() else "",
                lexicon=str(m / "lexicon.txt") if (m / "lexicon.txt").exists() else "",
            ),
            num_threads=4, provider="cpu",
        ),
        max_num_sentences=1,
    )
    tts = sherpa_onnx.OfflineTts(cfg)
    audio = tts.generate(a.text, sid=0, speed=a.speed)
    out = pathlib.Path(a.output); out.parent.mkdir(parents=True, exist_ok=True)
    sf.write(str(out), audio.samples, audio.sample_rate)
    print(f"{len(audio.samples)/audio.sample_rate:.1f}s -> {out}", file=sys.stderr)

if __name__ == "__main__":
    main()
