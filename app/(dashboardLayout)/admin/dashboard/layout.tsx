import AdminSidebar from "@/components/modules/Admin/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-neutral-50/20 overflow-hidden font-sans">
      {/* Sidebar Section */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header/Topbar can be added here later */}
        <section className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-neutral-50/50">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
