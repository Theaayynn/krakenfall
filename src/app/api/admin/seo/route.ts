import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";
import { z } from "zod";

const schema = z.object({
  path: z.string().trim().min(1).max(200),
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().min(5).max(300),
  ogImage: z.string().trim().url().optional().or(z.literal("")),
  keywords: z.array(z.string().trim().min(1)).default([]),
});

export async function GET() {
  const { error, status } = await requireAdminApi();
  if (error) return NextResponse.json({ error }, { status });
  const entries = await prisma.seoMeta.findMany({ orderBy: { path: "asc" } });
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  const { error, status, user } = await requireAdminApi();
  if (error || !user) return NextResponse.json({ error }, { status });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 400 });

  const existing = await prisma.seoMeta.findUnique({ where: { path: parsed.data.path } });
  if (existing) return NextResponse.json({ error: "SEO entry for this path already exists — edit it instead." }, { status: 409 });

  const { ogImage, ...rest } = parsed.data;
  const entry = await prisma.seoMeta.create({ data: { ...rest, ogImage: ogImage || undefined } });
  return NextResponse.json({ entry }, { status: 201 });
}
