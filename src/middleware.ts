import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import type { Role } from "@prisma/client";

const encodedSecret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET as string);
const ACCESS_COOKIE = "kf_access_token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(ACCESS_COOKIE)?.value;

  let payload: { sub: string; role: Role } | null = null;
  if (token) {
    try {
      const { payload: verified } = await jwtVerify(token, encodedSecret);
      payload = verified as unknown as { sub: string; role: Role };
    } catch {
      payload = null;
    }
  }

  if (pathname === "/admin/login" && payload) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!payload) return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
