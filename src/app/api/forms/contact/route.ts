import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, contactNotificationTemplate } from "@/lib/email";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  message: z.string().trim().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`contact:${ip}`, { windowMs: 60 * 60 * 1000, max: 15 });
  if (!limit.success) return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 400 });

  const message = await prisma.contactMessage.create({ data: parsed.data });

  if (process.env.ADMIN_EMAIL) {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New message from ${parsed.data.name}`,
      html: contactNotificationTemplate(parsed.data.name, parsed.data.email, parsed.data.message),
    }).catch((err) => console.error("[contact] Admin notification failed:", err));
  }

  return NextResponse.json({ message: "Message sent.", id: message.id }, { status: 201 });
}
