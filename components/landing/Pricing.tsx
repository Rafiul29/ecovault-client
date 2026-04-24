import { Badge } from "@/components/ui/badge";
import type { ISubscriptionPlan } from "@/types/subscription";
import { PricingCard } from "./PricingCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PricingProps {
  plans: ISubscriptionPlan[];
  user: any;
  returnUrl?: string;
}

export function Pricing({ plans, user, returnUrl }: PricingProps) {
  return (
    <section id="pricing" className="py-32">
      <div className="mx-auto max-w-7xl px-2">
        {/* Show a contextual banner when coming from a subscription-expired redirect */}
        {returnUrl && (
          <div className="mb-10 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-amber-900 mb-0.5">Subscription Required</p>
              <p className="text-sm text-amber-700 font-medium leading-relaxed">
                Your subscription has expired. Please renew or upgrade your plan to access that page. After subscribing you&apos;ll be taken back automatically.
              </p>
            </div>
            <Link
              href={returnUrl}
              className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
          </div>
        )}

        <div className="mb-20 text-center">
          <Badge
            variant="outline"
            className="mb-4 bg-emerald-500/5 text-emerald-600 border-emerald-500/20 uppercase tracking-widest text-[10px] px-4"
          >
            Pricing Architecture
          </Badge>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight font-black text-neutral-900 font-heading">
            Simple, Transparent Plans <br className="hidden sm:block" /> for Every Stage
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-neutral-500 font-medium leading-relaxed">
            Start for free, scale when your ideas gain traction. No hidden fees.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} user={user} returnUrl={returnUrl} />
          ))}
        </div>
      </div>
    </section>
  );
}
