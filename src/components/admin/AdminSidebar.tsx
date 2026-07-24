"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Compass,
  Gem,
  Images,
  ScrollText,
  Mail,
  Search,
  BarChart3,
  LogOut,
} from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/crew", label: "Crew", icon: Users },
  { href: "/admin/devil-fruits", label: "Devil Fruits", icon: Sparkles },
  { href: "/admin/journey", label: "Journey", icon: Compass },
  { href: "/admin/treasure", label: "Treasure", icon: Gem },
  { href: "/admin/gallery", label: "Gallery / Media", icon: Images },
  { href: "/admin/timeline", label: "Timeline", icon: ScrollText },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/seo", label: "SEO Editor", icon: Search },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="sticky top-6 flex h-fit w-56 shrink-0 flex-col gap-1 rounded-2xl border border-brass/15 bg-white/[0.03] p-3 backdrop-blur-xl">
      <p className="mb-2 px-3 py-2 font-display text-sm text-parchment">
        KRAKEN<span className="text-brass-soft">FALL</span>
      </p>
      {LINKS.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              active ? "bg-brass/15 text-parchment" : "text-parchment/60 hover:bg-white/5"
            }`}
          >
            <link.icon size={15} />
            {link.label}
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-parchment/50 hover:bg-white/5 hover:text-red-400"
      >
        <LogOut size={15} /> Sign out
      </button>
    </aside>
  );
}
