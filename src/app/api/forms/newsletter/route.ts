import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({ email: z.string().trim().toLowerCase().email() });

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`newsletter:${ip}`, { windowMs: 60 * 60 * 1000, max: 20 });
  if (!limit.success) return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    update: { isSubscribed: true },
    create: { email: parsed.data.email },
  });

  return NextResponse.json({ message: "Subscribed." }, { status: 201 });
}
