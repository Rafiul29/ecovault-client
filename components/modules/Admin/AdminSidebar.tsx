"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
    LayoutDashboard, 
    Lightbulb, 
    Tags, 
    Layers, 
    Users, 
    Settings, 
    LogOut,
    ShieldCheck,
    CreditCard,
    MessageSquare
} from "lucide-react"

const sidebarLinks = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard
    },
    {
        title: "Idea Management",
        href: "/admin/dashboard/idea-management",
        icon: Lightbulb
    },
    {
        title: "Category Management",
        href: "/admin/dashboard/category-management",
        icon: Layers
    },
    {
        title: "Tag Management",
        href: "/admin/dashboard/tag-management",
        icon: Tags
    },
    {
        title: "Member Management",
        href: "/admin/dashboard/member-management",
        icon: Users
    },
    {
        title: "Moderator Management",
        href: "/admin/dashboard/moderator-management",
        icon: ShieldCheck
    },
    {
        title: "Payment Management",
        href: "/admin/dashboard/payament-management",
        icon: CreditCard
    },
    {
        title: "Comment Management",
        href: "/admin/dashboard/comment-management",
        icon: MessageSquare
    },
]

const AdminSidebar = () => {
    const pathname = usePathname()

    return (
        <aside className="w-72 border-r bg-white flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="text-white h-6 w-6" />
                </div>
                <div>
                    <h2 className="font-black text-neutral-900 tracking-tight leading-none">EcoVault</h2>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Admin Panel</span>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                isActive 
                                ? "bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100/50" 
                                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                            }`}
                        >
                            <link.icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-neutral-400"}`} />
                            {link.title}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t space-y-1">
                <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-all"
                >
                    <Settings className="h-5 w-5 text-neutral-400" />
                    System Settings
                </Link>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </aside>
    )
}

export default AdminSidebar
