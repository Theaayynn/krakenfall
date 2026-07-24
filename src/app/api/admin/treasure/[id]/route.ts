import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().min(5).max(500),
  rarity: z.enum(["common", "rare", "legendary"]),
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
  const item = await prisma.treasureItem
    .update({ where: { id }, data: { ...rest, ...(imageUrl !== undefined ? { imageUrl: imageUrl || null } : {}) } })
    .catch(() => null);
  if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
  await prisma.auditLog.create({ data: { userId: user.id, action: "TREASURE_UPDATED", entityType: "TreasureItem", entityId: id } });
  return NextResponse.json({ item });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error, status, user } = await requireAdminApi();
  if (error || !user) return NextResponse.json({ error }, { status });
  const { id } = await params;
  await prisma.treasureItem.delete({ where: { id } }).catch(() => null);
  await prisma.auditLog.create({ data: { userId: user.id, action: "TREASURE_DELETED", entityType: "TreasureItem", entityId: id } });
  return NextResponse.json({ message: "Deleted." });
}
