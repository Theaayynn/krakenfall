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
});

export async function GET() {
  const { error, status } = await requireAdminApi();
  if (error) return NextResponse.json({ error }, { status });
  const crew = await prisma.crewMember.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ crew });
}

export async function POST(req: NextRequest) {
  const { error, status, user } = await requireAdminApi();
  if (error || !user) return NextResponse.json({ error }, { status });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 400 });

  const { portraitUrl, ...rest } = parsed.data;
  const member = await prisma.crewMember.create({ data: { ...rest, portraitUrl: portraitUrl || undefined } });
  await prisma.auditLog.create({ data: { userId: user.id, action: "CREW_CREATED", entityType: "CrewMember", entityId: member.id } });
  return NextResponse.json({ member }, { status: 201 });
}
