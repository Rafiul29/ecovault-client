"use client";

import * as React from "react";
import Link from "next/link";
import { Leaf, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import { logoutUser } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import type { UserInfo } from "@/types/user.types";
import { LogOut } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

interface MobileNavProps {
  links: NavLink[];
  user?: UserInfo;
}

export function MobileNav({ links, user }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    setOpen(false);
    router.push("/login");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col pr-0">
        <SheetHeader className="px-6 text-left">
          <SheetTitle>
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Leaf className="size-4" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight">
                EcoVault
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col py-6 px-6">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-semibold transition-colors hover:text-primary"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Separator className="my-6" />
          <div className="flex flex-col gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-lg font-semibold transition-colors hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/my-profile"
                  className="text-lg font-semibold transition-colors hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <Button
                  variant="destructive"
                  className="mt-2 flex items-center justify-center gap-2 rounded-lg py-6 text-lg font-bold"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-lg font-semibold transition-colors hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
                  onClick={() => setOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="mt-auto border-t bg-muted/30 p-6">
          <p className="text-xs text-muted-foreground">
            © 2026 EcoVault. Built for impact.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
