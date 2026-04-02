import { Badge } from "@/components/ui/badge";
import type { ISubscriptionPlan } from "@/types/subscription";
import { PricingCard } from "./PricingCard";

interface PricingProps {
  plans: ISubscriptionPlan[];
  user: any;
}

export function Pricing({ plans, user }: PricingProps) {
  return (
    <section id="pricing" className="py-32 px-6">
      <div className="mx-auto max-w-6xl">
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
            <PricingCard key={plan.id} plan={plan} user={user} />
          ))}
        </div>
      </div>
    </section>
  );
}
