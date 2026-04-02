import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Features } from "@/components/landing/Features";
import { Process } from "@/components/landing/Process";
import { FeaturedIdeas } from "@/components/landing/FeaturedIdeas";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { getAllSubscriptionPlans } from "@/services/subscription.service";
import { getIdeas } from "@/services/idea.service";
import { getUserInfo } from "@/services/auth.service";

export default async function LandingPage() {
  const user = await getUserInfo();
  // Fetch featured ideas from the backend
  const ideasResponse = await getIdeas("status=APPROVED&page=1&isFeatured=true&limit=3");
  const featuredIdeas = ideasResponse?.data ?? [];

  // Fetch active subscription plans from the backend
  const plansResponse = await getAllSubscriptionPlans("isActive=true&sortOrder=asc&sortBy=order");
  const plans = plansResponse?.data ?? [];

  return (
    <>
      <Hero featuredIdeas={featuredIdeas as any} />
      <Stats />
      <Features />
      <Process />
      <FeaturedIdeas ideas={featuredIdeas as any} />
      <Testimonials />
      <Pricing plans={plans as any} user={user} />
      <CTA />
    </>
  );
}
