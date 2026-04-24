"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const platformLinks = [
  { label: "Browse Ideas", href: "/ideas" },
  { label: "Explore", href: "/search" },
  // { label: "Watchlist", href: "/watchlist" },
];

const companyLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "Sign In", href: "/login" },
  { label: "Register", href: "/register" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/40">
      <div className="mx-auto max-w-7xl py-16 px-2 ">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:gap-16">
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                <Leaf className="size-5" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                EcoValut
              </span>
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              The premier marketplace for eco-innovations. We connect creators,
              investors, and visionaries to build a more sustainable world, one
              idea at a time.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex -space-x-2">
                {["alex-rivera", "priya-nair", "marco-chen"].map((u) => (
                  <Avatar
                    key={u}
                    className="size-7 ring-2 ring-background ring-offset-1 ring-offset-muted/20"
                  >
                    <AvatarImage
                      src={`https://i.pravatar.cc/80?u=${u}`}
                      alt={u}
                    />
                    <AvatarFallback className="text-[8px] bg-secondary text-primary font-bold">
                      {u[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <p className="text-xs font-semibold text-muted-foreground">
                <span className="text-foreground">4,800+</span> innovators
                joined the mission
              </p>
            </div>
          </div>

          {/* Platform links */}
          <div className="space-y-6 text-sm">
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">
              Platform
            </h4>
            <ul className="space-y-4">
              {platformLinks?.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-muted-foreground transition-all hover:text-primary hover:pl-1"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="space-y-6 text-sm">
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">
              Company
            </h4>
            <ul className="space-y-4">
              {companyLinks?.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-muted-foreground transition-all hover:text-primary hover:pl-1"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-12 border-border/40" />

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-xs font-medium text-muted-foreground">
            © 2026 EcoValut Inc. All rights reserved. Built with impact.
          </p>
          <div className="flex gap-8 text-xs font-semibold text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
