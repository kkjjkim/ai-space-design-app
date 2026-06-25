// 포트폴리오 슬라이드 목록. 운영자가 실사진을 /public/portfolio/ 에 넣고
// 아래 image 경로와 name 을 채우면 슬라이더/그리드에 자동 반영된다.
// (AGENTS.md 7번: 포트폴리오는 실사진만. AI 생성 가짜 금지.)
// image 를 비워두면 "사진 자리" 플레이스홀더가 표시된다.

export type Project = {
  name: string;
  category?: "리테일" | "F&B" | "명품·뷰티";
  image?: string; // 예: "/portfolio/nuri-01.jpg"
};

export const PROJECTS: Project[] = [
  { name: "프로젝트 01 — 운영자 입력" },
  { name: "프로젝트 02 — 운영자 입력" },
  { name: "프로젝트 03 — 운영자 입력" },
  { name: "프로젝트 04 — 운영자 입력" },
  { name: "프로젝트 05 — 운영자 입력" },
  { name: "프로젝트 06 — 운영자 입력" },
  { name: "프로젝트 07 — 운영자 입력" },
  { name: "프로젝트 08 — 운영자 입력" },
];
