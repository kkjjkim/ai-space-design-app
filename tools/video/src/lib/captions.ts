// scripts/transcribe.py 가 만드는 JSON 형식과 1:1로 맞춘다.
export type Word = { text: string; start: number; end: number };
export type CaptionLine = { start: number; end: number; words: Word[] };

export type CaptionsFile = {
  language: string;
  duration: number;
  lines: CaptionLine[];
};

export const findActiveLine = (lines: CaptionLine[], t: number) =>
  lines.find((l) => t >= l.start && t < l.end) ?? null;
