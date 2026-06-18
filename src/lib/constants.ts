// 리드 진행 상태 정의
export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "CONSULTING",
  "CONTRACTED",
  "CLOSED",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "신규",
  CONTACTED: "연락완료",
  CONSULTING: "상담중",
  CONTRACTED: "계약",
  CLOSED: "종료",
};

export const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-amber-100 text-amber-700",
  CONSULTING: "bg-purple-100 text-purple-700",
  CONTRACTED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-gray-200 text-gray-600",
};

// 폼 선택지
export const BUILDING_TYPES = [
  "아파트",
  "주택",
  "빌라",
  "오피스텔",
  "상가",
  "사무실",
  "기타",
] as const;

export const BUDGET_RANGES = [
  "1,000만원 이하",
  "1,000~3,000만원",
  "3,000~5,000만원",
  "5,000만원~1억원",
  "1억원 이상",
  "미정",
] as const;

export const SOURCES = [
  "인스타그램",
  "네이버 검색",
  "유튜브",
  "지인 소개",
  "오늘의집",
  "기타",
] as const;
