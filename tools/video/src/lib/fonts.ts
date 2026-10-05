import { staticFile } from "remotion";

// 폰트 파일은 public/fonts/ 에 있어야 한다 (setup 스크립트가 복사함, git에는 올리지 않음).
// 시스템 fontconfig(~/.fonts)에도 같은 폰트가 있어 둘 중 하나만 있어도 렌더된다.
export const FONT_CSS = `
@font-face { font-family: "Pretendard"; font-weight: 900; src: url("${staticFile("fonts/Pretendard-Black.otf")}") format("opentype"); }
@font-face { font-family: "Pretendard"; font-weight: 800; src: url("${staticFile("fonts/Pretendard-ExtraBold.otf")}") format("opentype"); }
@font-face { font-family: "Pretendard"; font-weight: 700; src: url("${staticFile("fonts/Pretendard-Bold.otf")}") format("opentype"); }
@font-face { font-family: "Pretendard"; font-weight: 600; src: url("${staticFile("fonts/Pretendard-SemiBold.otf")}") format("opentype"); }
@font-face { font-family: "Pretendard"; font-weight: 500; src: url("${staticFile("fonts/Pretendard-Medium.otf")}") format("opentype"); }
@font-face { font-family: "Pretendard"; font-weight: 400; src: url("${staticFile("fonts/Pretendard-Regular.otf")}") format("opentype"); }
`;

export const FONT_SANS = `"Pretendard", "Noto Sans KR", sans-serif`;
export const FONT_SERIF = `"Noto Serif KR", serif`;
export const FONT_DISPLAY = `"Black Han Sans", "Pretendard", sans-serif`;
