import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";
import { z } from "zod";

const schema = z.object({
  year: z.string().trim().min(1).max(30),
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().min(5).max(500),
  order: z.number().int(),
  isPublished: z.boolean(),
}).partial();

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { error, status, user } = await requireAdminApi();
  if (error || !user) return NextResponse.json({ error }, { status });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const event = await prisma.timelineEvent.update({ where: { id }, data: parsed.data }).catch(() => null);
  if (!event) return NextResponse.json({ error: "Not found." }, { status: 404 });
  await prisma.auditLog.create({ data: { userId: user.id, action: "TIMELINE_UPDATED", entityType: "TimelineEvent", entityId: id } });
  return NextResponse.json({ event });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error, status, user } = await requireAdminApi();
  if (error || !user) return NextResponse.json({ error }, { status });
  const { id } = await params;
  await prisma.timelineEvent.delete({ where: { id } }).catch(() => null);
  await prisma.auditLog.create({ data: { userId: user.id, action: "TIMELINE_DELETED", entityType: "TimelineEvent", entityId: id } });
  return NextResponse.json({ message: "Deleted." });
}
