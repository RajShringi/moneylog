import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] h-screen gap-4 w-full p-4 text-neutral-800">
      <aside className="h-full">
        <Sidebar />
      </aside>

      <main className="overflow-y-auto">{children}</main>
    </div>
  );
}
