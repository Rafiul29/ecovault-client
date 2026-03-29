import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Home, Users, UserCog, ShieldCheck, DollarSign, Package, PieChart, Settings } from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarItems = [
    { name: "Dashboard", href: "/dashboard/admin", icon: Home },
    { name: "Admins", href: "/dashboard/admin/admins", icon: ShieldCheck },
    { name: "Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Moderators", href: "/dashboard/admin/moderators", icon: UserCog },
    { name: "Plans", href: "/dashboard/admin/plans", icon: Package },
    { name: "Transactions", href: "/dashboard/admin/payments", icon: DollarSign },
    { name: "Analytics", href: "/dashboard/admin/stats", icon: PieChart },
    { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex bg-neutral-50/50 min-h-screen font-sans antialiased text-neutral-900">
      <DashboardSidebar items={sidebarItems} title="EcoVault Core Admin" />
      <main className="ml-64 flex-1 p-8 pt-20 transition-all duration-500 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
