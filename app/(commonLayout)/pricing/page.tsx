import { getUserInfo } from "@/services/auth.service";
import { getAllSubscriptionPlans } from "@/services/subscription.service";
import { Pricing } from "@/components/landing/Pricing";

export default async function PricingPage({
    searchParams,
}: {
    searchParams: Promise<{ returnUrl?: string }>;
}) {
    const { returnUrl } = await searchParams;

    const user = await getUserInfo();
    const plansResponse = await getAllSubscriptionPlans("isActive=true&sortOrder=asc&sortBy=order");
    const plans = plansResponse?.data ?? [];

    return (
        <Pricing plans={plans as any} user={user} returnUrl={returnUrl} />
    );
}