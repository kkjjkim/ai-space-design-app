// 카드뉴스(캐러셀) 스튜디오의 데이터 모양.
// 지금은 뼈대 단계라 슬라이드는 제목(heading)+본문(body) 텍스트만 담는다.
// 다음 단계에서 색·이미지·배경 등을 이 안에 넓혀 나간다.

export type Slide = {
  id: string; // 슬라이드 구분용 (crypto.randomUUID)
  heading: string;
  body: string;
};

export type Carousel = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slides: Slide[];
};

// 새 슬라이드 기본값
export function emptySlide(): Slide {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now()),
    heading: "",
    body: "",
  };
}
