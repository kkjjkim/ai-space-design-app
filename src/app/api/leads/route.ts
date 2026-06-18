import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadCreateSchema } from "@/lib/validation";
import { isAuthenticated } from "@/lib/auth";

// 공개: 상담 신청 접수
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const parsed = leadCreateSchema.safeParse(body);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.";
    return NextResponse.json({ error: message }, { status: 422 });
  }

  const d = parsed.data;
  const lead = await prisma.lead.create({
    data: {
      name: d.name,
      phone: d.phone,
      region: d.region || null,
      buildingType: d.buildingType || null,
      areaPyeong: d.areaPyeong ?? null,
      budget: d.budget || null,
      desiredDate: d.desiredDate || null,
      message: d.message || null,
      source: d.source || null,
    },
  });

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}

// 관리자: 리드 목록 (검색/필터/페이지네이션)
export async function GET(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const q = searchParams.get("q")?.trim() || undefined;
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = 20;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { phone: { contains: q } },
      { region: { contains: q } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.lead.count({ where }),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}
