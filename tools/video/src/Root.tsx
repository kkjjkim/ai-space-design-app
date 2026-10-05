import React from "react";
import { Composition, staticFile } from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";
import { Shorts, ShortsProps } from "./compositions/Shorts";
import sampleCaptions from "../public/sample/captions.json";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/*
        사용법: pnpm render Shorts out/result.mp4 --props=./props.json
        props.json 에 media / captions / hook 등을 넣으면 길이는 미디어 길이에 맞춰 자동 계산된다.
      */}
      <Composition<any, ShortsProps>
        id="Shorts"
        component={Shorts}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 8}
        defaultProps={{
          media: "sample/bg.jpg",
          captions: sampleCaptions.lines,
          hook: "매출 나는 매장은\n첫 설계부터 다릅니다",
          brand: "원탑경영컨설팅",
          accent: "#C9A961",
          hookSeconds: 2.4,
        }}
        calculateMetadata={async ({ props }) => {
          const isVideo = /\.(mp4|mov|webm|m4v)$/i.test(props.media);
          let seconds = sampleCaptions.duration;
          if (isVideo) {
            const meta = await getVideoMetadata(staticFile(props.media));
            seconds = meta.durationInSeconds;
          } else if (props.captions.length > 0) {
            seconds = props.captions[props.captions.length - 1].end + 0.6;
          }
          return { durationInFrames: Math.max(FPS, Math.round(seconds * FPS)) };
        }}
      />
    </>
  );
};
