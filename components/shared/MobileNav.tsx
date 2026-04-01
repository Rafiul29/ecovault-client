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

interface NavLink {
  label: string;
  href: string;
}

interface MobileNavProps {
  links: NavLink[];
}

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        }
      />
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
                EcoValut
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
          </div>
        </div>
        <div className="mt-auto border-t bg-muted/30 p-6">
          <p className="text-xs text-muted-foreground">
            © 2026 EcoValut. Built for impact.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
