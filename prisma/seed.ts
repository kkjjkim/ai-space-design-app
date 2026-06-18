import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SAMPLE = [
  {
    name: "김민지",
    phone: "010-2345-6789",
    region: "서울 마포구",
    buildingType: "아파트",
    areaPyeong: 24,
    budget: "3,000~5,000만원",
    desiredDate: "2개월 이내",
    message: "거실 확장과 주방 리모델링을 원해요.",
    source: "인스타그램",
    status: "NEW",
  },
  {
    name: "이준호",
    phone: "010-9876-5432",
    region: "경기 성남시 분당구",
    buildingType: "주택",
    areaPyeong: 45,
    budget: "1억원 이상",
    desiredDate: "올해 가을",
    message: "전체 리모델링 상담 원합니다.",
    source: "네이버 검색",
    status: "CONTACTED",
  },
  {
    name: "박서연",
    phone: "010-1111-2222",
    region: "서울 강남구",
    buildingType: "오피스텔",
    areaPyeong: 18,
    budget: "1,000~3,000만원",
    desiredDate: "1개월 이내",
    message: "원룸 인테리어 깔끔하게 하고 싶어요.",
    source: "오늘의집",
    status: "CONSULTING",
  },
  {
    name: "최동욱",
    phone: "010-3333-4444",
    region: "인천 연수구",
    buildingType: "상가",
    areaPyeong: 30,
    budget: "5,000만원~1억원",
    desiredDate: "협의",
    message: "카페 창업용 인테리어 문의드립니다.",
    source: "지인 소개",
    status: "CONTRACTED",
  },
];

async function main() {
  for (const s of SAMPLE) {
    await prisma.lead.create({ data: s });
  }
  console.log(`Seeded ${SAMPLE.length} leads.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
