"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative overflow-hidden px-2 py-40">
      <img
        src="https://images.pexels.com/photos/2833758/pexels-photo-2833758.jpeg"
        alt="Aerial view of lush green forest canopy by Kelly on Pexels"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-primary/80 backdrop-blur-[2px]" />

      <div className="pointer-events-none absolute -right-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-accent/30 blur-[120px]" />
      <div className="pointer-events-none absolute -left-20 top-0 h-[400px] w-[400px] rounded-full bg-emerald-500/20 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="section-heading text-4xl text-white sm:text-5xl lg:text-7xl leading-tight">
          Ready to Build a <br className="hidden sm:block" /> Greener Future?
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg text-white/80 leading-relaxed font-medium">
          Join 4,800+ innovators today and turn your eco-friendly ideas into
          real impact. Start for free — no credit card required.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group gap-2 bg-white px-10 text-primary hover:bg-white/95 hover:scale-105 transition-all shadow-2xl shadow-black/20",
            )}
          >
            Get Started Free{" "}
            <ArrowRight className="size-4.5 transition-transform group-hover:translate-x-1.5" />
          </Link>
          <Link
            href="/pricing"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "gap-2 border-white/30 bg-white/5 px-10 text-white backdrop-blur-md hover:bg-white/10 hover:text-white transition-all hover:border-white/50",
            )}
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
