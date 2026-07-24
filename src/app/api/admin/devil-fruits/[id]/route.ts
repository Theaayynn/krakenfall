import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(50),
  description: z.string().trim().min(5).max(500),
  powerLevel: z.number().int().min(1).max(5),
  iconUrl: z.string().trim().url().optional().or(z.literal("")),
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

  const { iconUrl, ...rest } = parsed.data;
  const fruit = await prisma.devilFruit
    .update({ where: { id }, data: { ...rest, ...(iconUrl !== undefined ? { iconUrl: iconUrl || null } : {}) } })
    .catch(() => null);
  if (!fruit) return NextResponse.json({ error: "Not found." }, { status: 404 });
  await prisma.auditLog.create({ data: { userId: user.id, action: "FRUIT_UPDATED", entityType: "DevilFruit", entityId: id } });
  return NextResponse.json({ fruit });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error, status, user } = await requireAdminApi();
  if (error || !user) return NextResponse.json({ error }, { status });
  const { id } = await params;
  await prisma.devilFruit.delete({ where: { id } }).catch(() => null);
  await prisma.auditLog.create({ data: { userId: user.id, action: "FRUIT_DELETED", entityType: "DevilFruit", entityId: id } });
  return NextResponse.json({ message: "Deleted." });
}
