import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_CSS, FONT_SANS, FONT_SERIF } from "../lib/fonts";
import { CaptionLine } from "../lib/captions";
import { WordCaptions } from "./WordCaptions";

export type ShortsProps = {
  /** public/ 기준 경로. mp4/mov면 영상, jpg/png면 이미지(켄번즈) */
  media: string;
  /** 자막 JSON (scripts/transcribe.py 결과의 lines). 없으면 자막 생략 */
  captions: CaptionLine[];
  /** 첫 1초에 박히는 훅 문장. 2줄 이내 */
  hook: string;
  /** 왼쪽 위 작은 브랜드 태그. 비우면 생략 */
  brand: string;
  /** 별도 음성/배경음 (public/ 기준). 없으면 media 소리 사용 */
  audio?: string;
  accent: string;
  /** 훅 문장이 머무는 시간(초) */
  hookSeconds: number;
};

const HookTitle: React.FC<{ text: string; accent: string; seconds: number }> = ({ text, accent, seconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inAnim = spring({ frame, fps, config: { damping: 16, stiffness: 140 } });
  const outStart = seconds * fps - 10;
  const out = interpolate(frame, [outStart, outStart + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(inAnim, [0, 1], [40, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 300,
        left: 72,
        right: 72,
        opacity: inAnim * out,
        transform: `translateY(${y}px)`,
      }}
    >
      <div style={{ width: 120, height: 6, background: accent, marginBottom: 28, borderRadius: 3 }} />
      <div
        style={{
          fontFamily: FONT_SERIF,
          fontWeight: 800,
          fontSize: 96,
          lineHeight: 1.18,
          color: "#FFFFFF",
          wordBreak: "keep-all",
          textShadow: "0 6px 30px rgba(0,0,0,0.6)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const ProgressBar: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const w = interpolate(frame, [0, durationInFrames], [0, 100]);
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 10, background: "rgba(255,255,255,0.15)" }}>
      <div style={{ width: `${w}%`, height: "100%", background: accent }} />
    </div>
  );
};

const Background: React.FC<{ media: string; audio?: string }> = ({ media, audio }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const isImage = /\.(jpe?g|png|webp)$/i.test(media);
  // 이미지일 땐 천천히 확대(켄번즈)해서 정지화면 느낌을 없앤다
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.12]);
  return (
    <AbsoluteFill style={{ background: "#0F0E0C" }}>
      {isImage ? (
        <Img src={staticFile(media)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
      ) : (
        <OffthreadVideo src={staticFile(media)} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted={Boolean(audio)} />
      )}
      {audio ? <Audio src={staticFile(audio)} /> : null}
      {/* 위·아래 그라데이션: 글자 가독성 확보 */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Shorts: React.FC<ShortsProps> = ({ media, captions, hook, brand, audio, accent, hookSeconds }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: FONT_SANS }}>
      <style>{FONT_CSS}</style>
      <Background media={media} audio={audio} />
      <ProgressBar accent={accent} />
      {brand ? (
        <div
          style={{
            position: "absolute",
            top: 150,
            left: 72,
            fontFamily: FONT_SANS,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: 2,
            color: "rgba(255,255,255,0.85)",
            padding: "10px 20px",
            border: "2px solid rgba(255,255,255,0.5)",
            borderRadius: 999,
          }}
        >
          {brand}
        </div>
      ) : null}
      {hook ? (
        <Sequence from={0} durationInFrames={Math.round(hookSeconds * fps)} layout="none">
          <HookTitle text={hook} accent={accent} seconds={hookSeconds} />
        </Sequence>
      ) : null}
      <WordCaptions lines={captions} accent={accent} />
    </AbsoluteFill>
  );
};
