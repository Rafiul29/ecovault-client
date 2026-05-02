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
      <SheetContent side="left" className="flex flex-col p-0 border-r-0 bg-background/95 backdrop-blur-xl w-[300px] sm:w-[350px]">
        <div className="absolute top-0 right-0 -z-10 h-64 w-64 translate-x-[30%] -translate-y-[30%] rounded-full bg-primary/5 blur-3xl" />
        
        <SheetHeader className="px-6 pt-8 pb-4 text-left">
          <SheetTitle>
            <Link
              href="/"
              className="flex items-center gap-3"
              onClick={() => setOpen(false)}
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-95">
                <Leaf className="size-5" />
              </div>
              <span className="font-display text-2xl font-black tracking-tighter text-foreground">
                EcoVault
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6 scrollbar-hidden">
          <div className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            Navigation
          </div>
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center rounded-xl px-3 py-2 text-base font-bold text-foreground/80 transition-all hover:text-primary active:scale-[0.98]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Separator className="my-8 bg-border/50" />

          <div className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            Account
          </div>
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center rounded-xl px-3 py-2 text-base font-bold text-foreground/80 transition-all hover:text-primary active:scale-[0.98]"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/my-profile"
                  className="flex items-center rounded-xl px-3 py-2 text-base font-bold text-foreground/80 transition-all hover:text-primary active:scale-[0.98]"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <Button
                  variant="ghost"
                  className="mt-4 flex w-full items-center justify-start gap-3 rounded-xl px-3 py-6 text-base font-bold text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleLogout}
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10">
                    <LogOut className="h-4 w-4" />
                  </div>
                  Log out
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/login"
                  className="flex h-12 items-center justify-center rounded-xl border border-border bg-background text-sm font-bold text-foreground transition-all hover:bg-muted active:scale-[0.98]"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex h-12 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]"
                  onClick={() => setOpen(false)}
                >
                  Get Started
                </Link>
              </div>
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
