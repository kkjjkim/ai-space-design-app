// 홈 "업종별 컨셉 보드" — 상담에서 실제로 만드는 컨셉 보드의 축약판.
// 예쁜 사진 한 장이 아니라 "고민 → 컨셉 문장 → 공간으로 푸는 법 → 키워드·색·재료"를 한 장에 보여준다.
// 실제 시공 사례가 아닌 컨셉 분위기 예시(이미지: 힉스필드 GPT Image 2.5, 2026-10-09).
// 실제 상호와 겹치지 않게 브랜드 이름 대신 컨셉 문장을 제목으로 쓴다.

export type ConceptBoard = {
  slug: string;
  industry: string; // 탭 이름
  title: string; // 컨셉 한 문장
  problem: string; // 사장님의 고민
  move: string; // 공간으로 푸는 법
  keywords: string[];
  palette: string[]; // 4색
  materials: string[];
  image: string; // /concepts/board-{slug}
  href: string; // 업종 랜딩 또는 상담
};

export const CONCEPT_BOARDS: ConceptBoard[] = [
  {
    slug: "roastery",
    industry: "대형 카페",
    title: "머무는 시간을 파는 로스터리",
    problem: "넓은 평수인데 좌석은 비어 보이고, 동선은 길어 직원이 지칩니다.",
    move: "로스터를 유리 안 무대로 세워 들어서자마자 보이게 하고, 좌석은 높낮이가 다른 구역으로 나눠 빈자리가 눈에 띄지 않게 합니다.",
    keywords: ["체류 시간", "로스팅이 보이는 무대", "구역 나누기"],
    palette: ["#E9E1D3", "#B9A58A", "#7A5A3C", "#2B2622"],
    materials: ["라임 플라스터", "오크", "블랙 스틸"],
    image: "/concepts/board-roastery",
    href: "/interior/large-cafe",
  },
  {
    slug: "bakery",
    industry: "베이커리",
    title: "굽는 냄새가 간판이 되는 빵집",
    problem: "진열은 풍성해야 하는데 작업실이 좁고, 선물 손님이 머물 자리가 없습니다.",
    move: "가운데 아일랜드로 한 바퀴 둘러보게 하고, 작업실 창으로 굽는 과정을 보여 신뢰를 만듭니다. 선물 포장은 계산대 옆 동선에 둡니다.",
    keywords: ["아일랜드 진열", "보이는 오븐", "선물 동선"],
    palette: ["#F4EEE6", "#E7CDB4", "#C47A54", "#9C7A55"],
    materials: ["테라코타 플라스터", "트래버틴", "오크"],
    image: "/concepts/board-bakery",
    href: "/interior/bakery",
  },
  {
    slug: "dining",
    industry: "레스토랑",
    title: "불 앞의 카운터가 객단가를 정하는 다이닝",
    problem: "테이블 회전보다 객단가를 올려야 하는 저녁 매장입니다.",
    move: "화덕을 정면에 두고 셰프 카운터를 가장 좋은 자리로 만듭니다. 코스와 페어링 주문이 자연스럽게 따라옵니다.",
    keywords: ["오픈 키친", "셰프 카운터", "낮은 조도"],
    palette: ["#D9C7AE", "#B98A5A", "#4A3B30", "#1F1B18"],
    materials: ["훈연 오크", "차콜 플라스터", "가죽"],
    image: "/concepts/board-dining",
    href: "/interior/restaurant",
  },
  {
    slug: "salon",
    industry: "미용실",
    title: "세 시간을 앉아 있어도 편한 살롱",
    problem: "시술이 길고, 대기석과 샴푸 공간의 소리가 그대로 섞입니다.",
    move: "거울 조명은 얼굴이 가장 좋아 보이는 각도로, 샴푸 구역은 물결 유리 뒤로 분리해 조용히 쉬는 시간을 만듭니다.",
    keywords: ["얼굴 조명", "프라이버시", "구역 분리"],
    palette: ["#F2EBE4", "#E8CFC5", "#C9A48F", "#8C5E3C"],
    materials: ["핑크 라임 플라스터", "트래버틴", "코냑 가죽"],
    image: "/concepts/board-salon",
    href: "/interior/beauty-salon",
  },
  {
    slug: "select",
    industry: "편집숍",
    title: "덜 진열해서 더 파는 편집숍",
    problem: "상품은 많은데 매장이 고급스러워 보이지 않습니다.",
    move: "입구에서 걸음을 멈추게 하는 가운데 진열대 하나에 힘을 주고, 벽은 숨 쉴 만큼만 채워 상품 하나하나가 보이게 합니다.",
    keywords: ["여백", "가운데 진열대", "갤러리 조명"],
    palette: ["#F1ECE4", "#D8CCBC", "#8B7B6A", "#2E2A26"],
    materials: ["라임스톤", "트래버틴", "스틸"],
    image: "/concepts/board-select",
    href: "/interior/retail",
  },
  {
    slug: "winebar",
    industry: "와인바",
    title: "문을 열면 다른 시간이 흐르는 와인바",
    problem: "작은 평수에서 높은 객단가와 재방문을 함께 만들어야 합니다.",
    move: "와인 벽을 조명으로 세워 고르는 시간 자체를 경험으로 만들고, 깊은 부스석으로 오래 머물 이유를 줍니다.",
    keywords: ["와인 월", "부스석", "촛불 조도"],
    palette: ["#C8A86B", "#6E5134", "#234036", "#14171A"],
    materials: ["블랙 마블", "벨벳", "브라스"],
    image: "/concepts/board-winebar",
    href: "/#apply",
  },
];
