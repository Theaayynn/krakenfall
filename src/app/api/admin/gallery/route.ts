import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(1).max(150),
  mediaUrl: z.string().trim().url(),
  mediaType: z.enum(["IMAGE", "VIDEO", "AUDIO"]).default("IMAGE"),
  order: z.number().int().default(0),
});

export async function GET() {
  const { error, status } = await requireAdminApi();
  if (error) return NextResponse.json({ error }, { status });
  const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const { error, status, user } = await requireAdminApi();
  if (error || !user) return NextResponse.json({ error }, { status });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 400 });

  const item = await prisma.galleryItem.create({ data: parsed.data });
  await prisma.auditLog.create({ data: { userId: user.id, action: "GALLERY_CREATED", entityType: "GalleryItem", entityId: item.id } });
  return NextResponse.json({ item }, { status: 201 });
}
