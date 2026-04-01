"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { SubscriptionPlan } from "@/lib/types";

interface PricingProps {
  plans: SubscriptionPlan[];
}

export function Pricing({ plans }: PricingProps) {
  return (
    <section className="py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-20 text-center">
          <Badge
            variant="outline"
            className="mb-4 bg-primary/5 uppercase tracking-widest text-[10px]"
          >
            Pricing
          </Badge>
          <h2 className="section-heading text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            Simple, Transparent Plans <br className="hidden sm:block" /> for
            Every Stage
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground leading-relaxed">
            Start free, scale when your ideas gain traction. No hidden fees.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "group relative flex flex-col rounded-3xl border p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/40 hover:-translate-y-1.5",
                plan.isPopular
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "bg-card",
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="px-5 py-1 text-[10px] font-bold uppercase tracking-widest border-2 border-background shadow-lg">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="mb-8">
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 group-hover:text-primary transition-colors">
                  {plan.name}
                </p>
                <div className="mt-4 flex items-baseline gap-1.5">
                  {plan.price === 0 ? (
                    <span className="font-display text-5xl font-bold tracking-tighter">
                      Free
                    </span>
                  ) : (
                    <>
                      <span className="font-display text-5xl font-bold tracking-tighter">
                        ${plan.price}
                      </span>
                      <span className="text-sm font-semibold text-muted-foreground">
                        /mo
                      </span>
                    </>
                  )}
                </div>
                {plan.description && (
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    {plan.description}
                  </p>
                )}
              </div>

              <Separator className="mb-8 border-border/60" />

              <ul className="mb-10 flex-1 space-y-4">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3.5 text-sm">
                    <CheckCircle className="mt-0.5 size-4.5 shrink-0 text-primary transition-transform group-hover:scale-110" />
                    <span className="text-muted-foreground leading-snug">
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={cn(
                  buttonVariants({
                    variant: plan.isPopular ? "default" : "outline",
                    size: "lg",
                  }),
                  "w-full justify-center rounded-2xl py-6 font-bold shadow-md shadow-primary/5 hover:shadow-lg hover:shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]",
                )}
              >
                {plan.price === 0
                  ? "Get Started for Free"
                  : `Subscribe to ${plan.name}`}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
