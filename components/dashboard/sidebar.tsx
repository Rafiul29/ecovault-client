"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  title: string;
}

export function DashboardSidebar({ items, title }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background/50 backdrop-blur-xl transition-transform dark:border-neutral-800">
      <div className="flex flex-col h-full bg-white/80 dark:bg-black/50">
        <div className="flex h-16 items-center px-6 border-b dark:border-neutral-800">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              {title}
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 p-4 pt-10">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
                    : "text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-emerald-600")} />
                {item.name}
                {isActive && (
                   <span className="ml-auto flex h-2 w-2 rounded-full bg-emerald-300 ring-2 ring-emerald-500 opacity-80" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4 dark:border-neutral-800">
          <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900 border">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-emerald-100 shadow-sm border border-emerald-200" />
            <div className="flex flex-col overflow-hidden">
               <span className="truncate text-sm font-bold">User Name</span>
               <span className="truncate text-xs text-muted-foreground italic uppercase">Role</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
