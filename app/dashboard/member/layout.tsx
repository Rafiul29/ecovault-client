import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Home, Lightbulb, ShoppingCart, Users, Star, Settings, ShieldCheck } from "lucide-react";

export default function MemberDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarItems = [
    { name: "Dashboard", href: "/dashboard/member", icon: Home },
    { name: "My Profile", href: "/dashboard/member/profile", icon: ShieldCheck },
    { name: "My Ideas", href: "/dashboard/member/my-ideas", icon: Lightbulb },
    { name: "Purchased", href: "/dashboard/member/purchased-ideas", icon: ShoppingCart },
    { name: "Network", href: "/dashboard/member/network", icon: Users },
    { name: "Reviews", href: "/dashboard/member/reviews", icon: Star },
    { name: "Settings", href: "/dashboard/member/settings", icon: Settings },
  ];

  return (
    <div className="flex bg-neutral-50/50 min-h-screen font-sans antialiased text-neutral-900">
      <DashboardSidebar items={sidebarItems} title="EcoVault Member" />
      <main className="ml-64 flex-1 p-8 pt-20 transition-all duration-500 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
