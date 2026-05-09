import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] h-screen gap-4 w-full bg-neutral-50 text-neutral-900">
      <aside className="h-full">
        <Sidebar />
      </aside>

      <main className="overflow-y-auto p-4">{children}</main>
    </div>
  );
}
