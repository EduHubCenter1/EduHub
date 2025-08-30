import AdminSidebar from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 overflow-y-auto w-full">{children}</main>
    </div>
  );
}