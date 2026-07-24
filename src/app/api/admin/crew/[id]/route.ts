import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  title: z.string().trim().min(2).max(150),
  bio: z.string().trim().min(5).max(500),
  portraitUrl: z.string().trim().url().optional().or(z.literal("")),
  order: z.number().int().default(0),
  isPublished: z.boolean().default(true),
}).partial();

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { error, status, user } = await requireAdminApi();
  if (error || !user) return NextResponse.json({ error }, { status });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const { portraitUrl, ...rest } = parsed.data;
  const member = await prisma.crewMember
    .update({ where: { id }, data: { ...rest, ...(portraitUrl !== undefined ? { portraitUrl: portraitUrl || null } : {}) } })
    .catch(() => null);
  if (!member) return NextResponse.json({ error: "Not found." }, { status: 404 });
  await prisma.auditLog.create({ data: { userId: user.id, action: "CREW_UPDATED", entityType: "CrewMember", entityId: id } });
  return NextResponse.json({ member });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error, status, user } = await requireAdminApi();
  if (error || !user) return NextResponse.json({ error }, { status });
  const { id } = await params;
  await prisma.crewMember.delete({ where: { id } }).catch(() => null);
  await prisma.auditLog.create({ data: { userId: user.id, action: "CREW_DELETED", entityType: "CrewMember", entityId: id } });
  return NextResponse.json({ message: "Deleted." });
}
