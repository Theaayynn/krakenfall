import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";

export async function GET() {
  const { error, status } = await requireAdminApi();
  if (error) return NextResponse.json({ error }, { status });

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalViews,
    views30d,
    unreadMessages,
    totalMessages,
    subscribers,
    crewCount,
    fruitCount,
    galleryCount,
    viewsByDay,
    topPagesRaw,
  ] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.contactMessage.count(),
    prisma.newsletterSubscriber.count({ where: { isSubscribed: true } }),
    prisma.crewMember.count(),
    prisma.devilFruit.count(),
    prisma.galleryItem.count(),
    prisma.pageView.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    }),
    prisma.pageView.groupBy({ by: ["path"], _count: { path: true }, orderBy: { _count: { path: "desc" } }, take: 8 }),
  ]);

  const topPages = topPagesRaw.map((p) => ({ path: p.path, count: p._count.path }));

  const dayBuckets: Record<string, number> = {};
  for (const v of viewsByDay) {
    const key = v.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dayBuckets[key] = (dayBuckets[key] ?? 0) + 1;
  }

  return NextResponse.json({
    totalViews,
    views30d,
    unreadMessages,
    totalMessages,
    subscribers,
    crewCount,
    fruitCount,
    galleryCount,
    viewsByDay: Object.entries(dayBuckets).map(([day, count]) => ({ day, count })),
    topPages,
  });
}
