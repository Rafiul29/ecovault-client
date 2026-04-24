"use client";

import { useMutation } from "@tanstack/react-query";
import { subscribeToPlan } from "@/services/subscription.service";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ISubscriptionPlan } from "@/types/subscription";

interface PricingCardProps {
  plan: ISubscriptionPlan;
  user: any;
  returnUrl?: string;
}

export function PricingCard({ plan, user, returnUrl }: PricingCardProps) {
  const router = useRouter();

  const subscribeMutation = useMutation({
    mutationFn: (planId: string) => subscribeToPlan({ subscriptionPlanId: planId }),
    onSuccess: (res: any) => {
      if (res?.data?.url) {
        // Persist returnUrl so the post-payment success page can redirect back
        if (returnUrl && typeof window !== "undefined") {
          sessionStorage.setItem("subscriptionReturnUrl", returnUrl);
        }
        window.location.href = res.data.url;
      } else {
        toast.error(res?.message || "Failed to initiate subscription");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
    }
  });

  const handleSubscribe = (planId: string) => {
    if (!user) {
      toast.info("Please login to subscribe to a plan");
      router.push(`/login?redirect=${encodeURIComponent("/pricing" + (returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""))}`);
      return;
    }
    subscribeMutation.mutate(planId);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-[2rem] border p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-2",
        plan.isPopular
          ? "border-emerald-500/30 bg-emerald-500/2 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500/20"
          : "bg-white border-neutral-100",
      )}
    >
      {plan.isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge className="px-5 py-1 text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white border-none shadow-lg">
            Most Popular
          </Badge>
        </div>
      )}

      <div className="mb-8">
        <p className="font-display text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 group-hover:text-emerald-600 transition-colors">
          {plan.name} {plan.isActive ? "" : "(Inactive)"}
        </p>
        <div className="mt-4 flex items-baseline gap-1.5">
          <span className="font-display text-5xl font-black tracking-tighter text-neutral-900">
            ${plan.price}
          </span>
          <span className="text-sm font-bold text-neutral-400">
            /{plan.durationDays}d
          </span>
        </div>
        {plan.description && (
          <p className="mt-4 text-sm text-neutral-500 font-medium leading-relaxed">
            {plan.description}
          </p>
        )}
      </div>

      <Separator className="mb-8 bg-neutral-100" />

      <ul className="mb-10 flex-1 space-y-4">
        {plan.features.map((feat, idx) => (
          <li key={idx} className="flex items-start gap-3.5 text-sm">
            <div className="mt-0.5 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <CheckCircle className="size-3 text-emerald-600" strokeWidth={3} />
            </div>
            <span className="text-neutral-600 font-medium leading-snug">
              {feat}
            </span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => handleSubscribe(plan.id)}
        disabled={subscribeMutation.isPending || !plan.isActive}
        className={cn(
          buttonVariants({
            variant: plan.isPopular ? "default" : "outline",
            size: "lg",
          }),
          "w-full justify-center rounded-xl py-6 font-black shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]",
          plan.isPopular
            ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
            : "border-neutral-200 text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300"
        )}
      >
        {subscribeMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        {plan.buttonText || (plan.price === 0 ? "Get Started for Free" : `Join ${plan.name}`)}
      </Button>
    </div>
  );
}
