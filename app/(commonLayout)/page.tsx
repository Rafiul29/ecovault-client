import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Features } from "@/components/landing/Features";
import { Process } from "@/components/landing/Process";
import { FeaturedIdeas } from "@/components/landing/FeaturedIdeas";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { mockIdeas, mockPlans } from "@/lib/mock-data";

export default function LandingPage() {
  const featuredIdeas = mockIdeas
    .filter((i) => i.status === "PUBLISHED")
    .slice(0, 3);

  return (
    <>
      <Hero featuredIdeas={featuredIdeas} />
      <Stats />
      <Features />
      <Process />
      <FeaturedIdeas ideas={featuredIdeas} />
      <Testimonials />
      <Pricing plans={mockPlans} />
      <CTA />
    </>
  );
}
