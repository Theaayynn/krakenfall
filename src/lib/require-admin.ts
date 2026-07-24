import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

export async function requireAdmin(allowed: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR"]) {
  const payload = await getCurrentUser();
  if (!payload) redirect("/admin/login");
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) redirect("/admin/login");
  if (!allowed.includes(user.role)) redirect("/admin");
  return user;
}

export async function requireAdminApi(allowed: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR"]) {
  const payload = await getCurrentUser();
  if (!payload) return { error: "Not authenticated.", status: 401 as const, user: null };
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) return { error: "Not authenticated.", status: 401 as const, user: null };
  if (!allowed.includes(user.role)) return { error: "Forbidden.", status: 403 as const, user: null };
  return { error: null, status: 200 as const, user };
}
