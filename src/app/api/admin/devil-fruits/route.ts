import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(50),
  description: z.string().trim().min(5).max(500),
  powerLevel: z.number().int().min(1).max(5).default(1),
  iconUrl: z.string().trim().url().optional().or(z.literal("")),
  order: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export async function GET() {
  const { error, status } = await requireAdminApi();
  if (error) return NextResponse.json({ error }, { status });
  const fruits = await prisma.devilFruit.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ fruits });
}

export async function POST(req: NextRequest) {
  const { error, status, user } = await requireAdminApi();
  if (error || !user) return NextResponse.json({ error }, { status });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 400 });

  const { iconUrl, ...rest } = parsed.data;
  const fruit = await prisma.devilFruit.create({ data: { ...rest, iconUrl: iconUrl || undefined } });
  await prisma.auditLog.create({ data: { userId: user.id, action: "FRUIT_CREATED", entityType: "DevilFruit", entityId: fruit.id } });
  return NextResponse.json({ fruit }, { status: 201 });
}
