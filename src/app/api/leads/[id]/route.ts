import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadUpdateSchema } from "@/lib/validation";
import { isAuthenticated } from "@/lib/auth";

// 관리자: 리드 상태/메모 수정
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const parsed = leadUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "입력값을 확인해주세요." }, { status: 422 });
  }

  try {
    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json({ ok: true, lead });
  } catch {
    return NextResponse.json({ error: "대상을 찾을 수 없습니다." }, { status: 404 });
  }
}

// 관리자: 리드 삭제
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.lead.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "대상을 찾을 수 없습니다." }, { status: 404 });
  }
}
