import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Home, LayoutGrid, Tags, ClipboardList, History, User } from "lucide-react";

export default function ModeratorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarItems = [
    { name: "Dashboard", href: "/dashboard/moderator", icon: Home },
    { name: "Categories", href: "/dashboard/moderator/categories", icon: LayoutGrid },
    { name: "Tags", href: "/dashboard/moderator/tags", icon: Tags },
    { name: "Review Ideas", href: "/dashboard/moderator/reviews", icon: ClipboardList },
    { name: "Audit Trail", href: "/dashboard/moderator/history", icon: History },
    { name: "My Profile", href: "/dashboard/moderator/profile", icon: User },
  ];

  return (
    <div className="flex bg-neutral-50/50 min-h-screen font-sans antialiased text-neutral-900">
      <DashboardSidebar items={sidebarItems} title="EcoVault Moderator" />
      <main className="ml-64 flex-1 p-8 pt-20 transition-all duration-500 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
