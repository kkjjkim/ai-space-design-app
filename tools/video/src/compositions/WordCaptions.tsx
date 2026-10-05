import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { FONT_SANS } from "../lib/fonts";
import { CaptionLine, findActiveLine } from "../lib/captions";

type Props = {
  lines: CaptionLine[];
  /** 화면 아래에서 띄우는 거리(px). 쇼츠 UI(캡션·버튼)와 겹치지 않게 기본 420 */
  bottom?: number;
  accent?: string;
};

/**
 * 말하는 단어가 차례로 켜지는 "단어 강조형" 자막.
 * 쇼츠에서 가장 시청 유지율이 좋은 방식이라 기본값으로 둔다.
 */
export const WordCaptions: React.FC<Props> = ({ lines, bottom = 420, accent = "#C9A961" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const line = findActiveLine(lines, t);
  if (!line) return null;

  const lineAge = (t - line.start) * fps;
  const pop = spring({ frame: lineAge, fps, config: { damping: 14, stiffness: 180, mass: 0.6 } });
  const scale = interpolate(pop, [0, 1], [0.92, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        display: "flex",
        justifyContent: "center",
        padding: "0 72px",
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_SANS,
          fontWeight: 800,
          fontSize: 76,
          lineHeight: 1.25,
          textAlign: "center",
          color: "#FFFFFF",
          wordBreak: "keep-all",
          textShadow: "0 4px 24px rgba(0,0,0,0.55), 0 0 2px rgba(0,0,0,0.9)",
          WebkitTextStroke: "2px rgba(0,0,0,0.35)",
        }}
      >
        {line.words.map((w, i) => {
          const active = t >= w.start && t < w.end;
          const spoken = t >= w.end;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                margin: "0 10px",
                color: active ? accent : spoken ? "#FFFFFF" : "rgba(255,255,255,0.55)",
                transform: active ? "scale(1.08)" : "scale(1)",
                transition: "none",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
