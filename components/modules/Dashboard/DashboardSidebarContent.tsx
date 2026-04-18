"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getIconComponent } from "@/lib/iconMapper"
import { cn } from "@/lib/utils"
import { NavSection } from "@/types/dashboard.types"
import { UserInfo } from "@/types/user.types"
import { Leaf } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardSidebarContentProps {
    userInfo: UserInfo,
    navItems: NavSection[],
    dashboardHome: string,
}

const DashboardSidebarContent = ({ dashboardHome, navItems, userInfo }: DashboardSidebarContentProps) => {
    console.log("userInfo", userInfo);
    const pathname = usePathname()
    return (
        <aside className="hidden md:flex h-full w-72 flex-col border-r border-gray-200 bg-white shadow-[1px_0_0_0_rgba(0,0,0,0.02)] transition-all duration-300">
            {/* Logo Area */}
            <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-2">
                <Link href={dashboardHome} className="flex items-center gap-4 group transition-all duration-500 hover:scale-[1.02]">
                    <div className="flex size-10 items-center justify-center rounded-[1.25rem] bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 transition-all duration-700 group-hover:rotate-[15deg] group-hover:bg-emerald-500 group-hover:shadow-emerald-500/40">
                        <Leaf className="size-5 transition-transform group-hover:scale-110" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display text-2xl font-black tracking-tight text-neutral-900 leading-none">
                            EcoVault
                        </span>
                    </div>
                </Link>
            </div>



            {/* Navigation Area */}
            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="space-y-6">
                    {navItems?.map((section, sectionId) => (
                        <div key={sectionId}>
                            {section.title && (
                                <h4 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {section.title}
                                </h4>
                            )}

                            <div className="space-y-1">
                                {section.items.map((item, id) => {
                                    const isActive = pathname === item.href;
                                    // Icon Mapper Function
                                    const Icon = getIconComponent(item.icon);

                                    return (
                                        <Link
                                            href={item.href}
                                            key={id}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                                                isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                            )}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    );
                                })}
                            </div>

                            {sectionId < navItems.length - 1 && (
                                <Separator className="my-4" />
                            )}
                        </div>
                    ))}
                </nav>
            </ScrollArea>

            {/* User Info At Bottom */}
            <div className="border-t px-3 py-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                            {userInfo?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{userInfo?.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                            {userInfo.role.toLocaleLowerCase().replace("_", " ")}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default DashboardSidebarContent;