import { Config } from "@remotion/cli/config";
import { existsSync } from "node:fs";

// 클라우드 컨테이너에 미리 깔린 Playwright용 headless shell을 그대로 쓴다 (매번 다운로드 방지).
// 일반 Chromium 바이너리는 구형 headless 모드가 빠져 Remotion이 띄우지 못한다.
const preinstalledHeadlessShell = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (existsSync(preinstalledHeadlessShell)) {
  Config.setBrowserExecutable(preinstalledHeadlessShell);
}

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// 쇼츠는 세로 1080x1920, 30fps 고정 (compositions에서 정의)
Config.setCodec("h264");
Config.setCrf(18); // 플랫폼 재압축을 고려해 화질 여유를 둔다
