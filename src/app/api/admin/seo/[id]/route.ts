import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().min(5).max(300),
  ogImage: z.string().trim().url().optional().or(z.literal("")),
  keywords: z.array(z.string().trim().min(1)),
}).partial();

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { error, status, user } = await requireAdminApi();
  if (error || !user) return NextResponse.json({ error }, { status });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const { ogImage, ...rest } = parsed.data;
  const entry = await prisma.seoMeta
    .update({ where: { id }, data: { ...rest, ...(ogImage !== undefined ? { ogImage: ogImage || null } : {}) } })
    .catch(() => null);
  if (!entry) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ entry });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error, status, user } = await requireAdminApi();
  if (error || !user) return NextResponse.json({ error }, { status });
  const { id } = await params;
  await prisma.seoMeta.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ message: "Deleted." });
}
