import { requireAdmin } from "@/lib/require-admin";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <main className="min-h-screen bg-abyss px-6 py-6">
      <div className="mx-auto flex max-w-7xl gap-6">
        <AdminSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  );
}
