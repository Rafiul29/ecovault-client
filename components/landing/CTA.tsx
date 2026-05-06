"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="group relative overflow-hidden px-2 py-40">
      <Image
        src="https://images.pexels.com/photos/2833758/pexels-photo-2833758.jpeg"
        alt="Aerial view of lush green forest canopy"
        fill
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-secondary/95 backdrop-blur-[2px] transition-colors duration-500 dark:bg-primary/80" />

      <div className="pointer-events-none absolute -right-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-accent/20 blur-[120px] dark:bg-accent/30" />
      <div className="pointer-events-none absolute -left-20 top-0 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[100px] dark:bg-emerald-500/20" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="section-heading text-4xl text-foreground sm:text-5xl lg:text-7xl leading-tight dark:text-white">
          Ready to Build a <br className="hidden sm:block" /> Greener Future?
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed font-medium dark:text-white/80">
          Join 4,800+ innovators today and turn your eco-friendly ideas into
          real impact. Start for free — no credit card required.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group relative gap-2 px-10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
              "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30",
              "dark:bg-white dark:text-primary dark:shadow-black/20 dark:hover:bg-white/90 dark:hover:shadow-white/10",
            )}
          >
            Get Started Free
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/pricing"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "gap-2 px-10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
              "border-primary/20 text-primary hover:bg-primary/5",
              "dark:border-white/30 dark:bg-white/5 dark:text-white dark:backdrop-blur-md dark:hover:bg-white/10 dark:hover:border-white/50",
            )}
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
