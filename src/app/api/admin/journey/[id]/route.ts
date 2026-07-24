import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(2).max(150),
  location: z.string().trim().min(2).max(100),
  summary: z.string().trim().min(5).max(1000),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
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

  const { imageUrl, ...rest } = parsed.data;
  const chapter = await prisma.journeyChapter
    .update({ where: { id }, data: { ...rest, ...(imageUrl !== undefined ? { imageUrl: imageUrl || null } : {}) } })
    .catch(() => null);
  if (!chapter) return NextResponse.json({ error: "Not found." }, { status: 404 });
  await prisma.auditLog.create({ data: { userId: user.id, action: "JOURNEY_UPDATED", entityType: "JourneyChapter", entityId: id } });
  return NextResponse.json({ chapter });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error, status, user } = await requireAdminApi();
  if (error || !user) return NextResponse.json({ error }, { status });
  const { id } = await params;
  await prisma.journeyChapter.delete({ where: { id } }).catch(() => null);
  await prisma.auditLog.create({ data: { userId: user.id, action: "JOURNEY_DELETED", entityType: "JourneyChapter", entityId: id } });
  return NextResponse.json({ message: "Deleted." });
}
