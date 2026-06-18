import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LEAD_STATUSES } from "@/lib/constants";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAuthenticated()) {
    redirect("/admin/login?from=/admin");
  }

  // 상태별 집계
  const grouped = await prisma.lead.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const counts: Record<string, number> = {};
  for (const s of LEAD_STATUSES) counts[s] = 0;
  let total = 0;
  for (const g of grouped) {
    counts[g.status] = g._count._all;
    total += g._count._all;
  }

  // 이번 달 신규 리드 수
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const thisMonth = await prisma.lead.count({
    where: { createdAt: { gte: startOfMonth } },
  });

  return (
    <AdminDashboard initialStats={{ counts, total, thisMonth }} />
  );
}
