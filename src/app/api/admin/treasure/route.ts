import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().min(5).max(500),
  rarity: z.enum(["common", "rare", "legendary"]).default("common"),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  order: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export async function GET() {
  const { error, status } = await requireAdminApi();
  if (error) return NextResponse.json({ error }, { status });
  const items = await prisma.treasureItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const { error, status, user } = await requireAdminApi();
  if (error || !user) return NextResponse.json({ error }, { status });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 400 });

  const { imageUrl, ...rest } = parsed.data;
  const item = await prisma.treasureItem.create({ data: { ...rest, imageUrl: imageUrl || undefined } });
  await prisma.auditLog.create({ data: { userId: user.id, action: "TREASURE_CREATED", entityType: "TreasureItem", entityId: item.id } });
  return NextResponse.json({ item }, { status: 201 });
}
