"use client";
import Link from "next/link";
import { Leaf, ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserNav } from "./UserNav";
import { MobileNav } from "./MobileNav";
import type { UserInfo } from "@/types/user.types";
import { useState, useEffect } from "react";

interface HeaderProps {
  user?: UserInfo;
}

const navLinks = [
  { label: "Ideas", href: "/ideas" },
  { label: "Explore", href: "/search" },
  { label: "Achievements", href: "/achievements" },
];

export function Header({ user }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    checkScroll();
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const headerClasses = cn(
    "fixed top-0 z-50 w-full transition-all duration-300",
    !mounted &&
    "bg-background/80 border-b border-border/50 py-3 backdrop-blur-xl", // Initial CSS state
    mounted &&
    isScrolled &&
    "bg-background/80 border-b border-border/50 py-3 backdrop-blur-xl",
    mounted && !isScrolled && "bg-transparent py-5",
  );

  return (
    <header className={headerClasses}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
              <Leaf className="size-4.5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              EcoValut
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-muted/50 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 sm:flex">
            {user ? (
              <>
                <Link
                  href="/ideas/create"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "gap-1.5 hidden md:inline-flex border-primary/20 hover:bg-primary/5 hover:text-primary",
                  )}
                >
                  <Plus className="size-3.5" />
                  Submit Idea
                </Link>
                <UserNav user={user} />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "hover:bg-muted font-medium text-muted-foreground hover:text-foreground",
                  )}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "gap-1.5 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0",
                  )}
                >
                  Get Started <ArrowRight className="size-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <MobileNav links={navLinks} />
        </div>
      </div>
    </header>
  );
}
