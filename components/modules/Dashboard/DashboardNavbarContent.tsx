"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavSection } from "@/types/dashboard.types";
import { UserInfo } from "@/types/user.types";
import { Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import NotificationDropdown from "./NotificationDropdown";
import { UserDropdown } from "./UserDropdown";
import { ThemeToggle } from "@/components/shared/ThemeToggle";


interface DashboardNavbarProps {
    userInfo: UserInfo;
    navItems: NavSection[];
    dashboardHome: string
}

const DashboardNavbarContent = ({ dashboardHome, navItems, userInfo }: DashboardNavbarProps) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkSmallerScreen = () => {
            setIsMobile(window.innerWidth < 768);
        }

        checkSmallerScreen();
        window.addEventListener("resize", checkSmallerScreen);

        return () => {
            window.removeEventListener("resize", checkSmallerScreen);
        };
    }, []);

    return (
        <nav className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            {/* Mobile Menu Toggle */}
            <Sheet open={isOpen && isMobile} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="-m-2.5 p-2.5 text-muted-foreground md:hidden hover:bg-muted">
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 border-none shadow-2xl">
                    <DashboardMobileSidebar userInfo={userInfo} dashboardHome={dashboardHome} navItems={navItems} />
                </SheetContent>
            </Sheet>

            {/* Separator for mobile */}
            <div className="h-6 w-px bg-border md:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                {/* Search Component */}
                <div className="relative flex flex-1 items-center">
                    <div className="relative w-full max-w-md group">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" aria-hidden="true" />
                        </div>
                        <Input
                            type="search"
                            placeholder="Universal search..."
                            className="block w-full rounded-2xl border-0 py-1.5 pl-10 pr-12 text-foreground ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-muted/30 hover:bg-muted/50 transition-all shadow-sm"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    {/* Theme Toggle */}
                    <ThemeToggle />
                    {/* Notification */}
                    <NotificationDropdown />

                    {/* Separator */}
                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

                    {/* User Dropdown */}
                    <div className="flex items-center">
                        <UserDropdown user={userInfo} />
                        {/* <span className="hidden lg:flex lg:items-center ml-3">
                            <span className="text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                                {userInfo.name}
                            </span>
                        </span> */}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default DashboardNavbarContent