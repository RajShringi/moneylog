import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] h-screen w-full bg-neutral-50 text-neutral-700">
      <aside className="h-full">
        <Sidebar />
      </aside>

      <main className="overflow-y-auto">{children}</main>
    </div>
  );
}
