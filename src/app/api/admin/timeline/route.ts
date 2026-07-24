import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";
import { z } from "zod";

const schema = z.object({
  year: z.string().trim().min(1).max(30),
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().min(5).max(500),
  order: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export async function GET() {
  const { error, status } = await requireAdminApi();
  if (error) return NextResponse.json({ error }, { status });
  const events = await prisma.timelineEvent.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const { error, status, user } = await requireAdminApi();
  if (error || !user) return NextResponse.json({ error }, { status });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 400 });

  const event = await prisma.timelineEvent.create({ data: parsed.data });
  await prisma.auditLog.create({ data: { userId: user.id, action: "TIMELINE_CREATED", entityType: "TimelineEvent", entityId: event.id } });
  return NextResponse.json({ event }, { status: 201 });
}
