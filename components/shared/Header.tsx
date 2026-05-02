"use client";
import Link from "next/link";
import { Leaf, ArrowRight, Plus, Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserNav } from "./UserNav";
import { MobileNav } from "./MobileNav";
import type { UserInfo } from "@/types/user.types";
import { useState, useEffect } from "react";
import { GlobalSearch } from "../search/GlobalSearch";
import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  user?: UserInfo;
}

const navLinks = [
  { label: "Ideas", href: "/ideas" },
  { label: "Explore", href: "/feeds" },
  { label: "Achievements", href: "/achievements" },
];

export function Header({ user }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    checkScroll();
    window.addEventListener("scroll", checkScroll);
    return () => {
      window.removeEventListener("scroll", checkScroll);
      document.removeEventListener("keydown", down);
    };
  }, []);

  const headerClasses = cn(
    "fixed top-0 z-50 left-0 right-0 transition-[background-color,border-color] duration-300",
    !mounted && "bg-transparent py-5", // Initial SSR state matching top-of-page
    mounted &&
    isScrolled &&
    "bg-background/80 border-b border-border/50 py-3 backdrop-blur-xl",
    mounted && !isScrolled && "bg-transparent py-5",
  );

  return (
    <header className={headerClasses}>
      <div className="wrapper  flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
              <Leaf className="size-4.5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              EcoVault
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex ml-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-muted-foreground/80 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search - Press Ctrl+K to search"
            className="flex h-10 items-center gap-2 rounded-full border border-border/50 bg-background/50 hover:bg-background px-4 pr-12 text-sm text-muted-foreground transition-all hover:border-primary/30 hover:ring-4 hover:ring-primary/5 hidden lg:flex shadow-sm group"
          >
            <SearchIcon className="size-4 group-hover:text-primary transition-colors" />
            <span className="font-medium">Search for innovations...</span>
            <kbd className="absolute right-4 hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search"
            className="flex h-10 items-center gap-2 rounded-full border border-border/50 bg-background/50 hover:bg-background px-3 pr-8 text-sm text-muted-foreground transition-all hover:border-primary/30 lg:hidden hidden md:flex shadow-sm"
          >
            <SearchIcon className="size-4" />
            <span>Search...</span>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search"
            className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-muted/30 text-muted-foreground transition-all hover:bg-muted/50 md:hidden"
          >
            <SearchIcon className="size-4" />
          </button>

          <ThemeToggle />

          <div className="hidden items-center gap-3 sm:flex">
            {user ? (
              <>
                {/* <Link
                  href="/ideas/create"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "gap-1.5 hidden md:inline-flex border-primary/20 hover:bg-primary/5 hover:text-primary",
                  )}
                >
                  <Plus className="size-3.5" />
                  Submit Idea
                </Link> */}
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
          <MobileNav links={navLinks} user={user} />
        </div>
      </div>

      <GlobalSearch isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
}
