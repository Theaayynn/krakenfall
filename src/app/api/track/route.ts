import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ path: z.string().trim().min(1).max(300) });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  await prisma.pageView.create({
    data: {
      path: parsed.data.path,
      referrer: req.headers.get("referer") || undefined,
    },
  }).catch(() => null);

  return NextResponse.json({ ok: true });
}
