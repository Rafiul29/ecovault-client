import { Suspense } from "react";
import { Hero, HeroIdeasGrid } from "@/components/landing/Hero";
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
import { getComments } from "@/services/comment.service";

export default async function LandingPage() {
  const userPromise = getUserInfo();
  const ideasPromise = getIdeas("status=APPROVED&page=1&isFeatured=true&limit=6");
  const plansPromise = getAllSubscriptionPlans("isActive=true&sortOrder=asc&sortBy=order");
  const commentsPromise = getComments("page=1&limit=3&sortOrder=desc");

  return (
    <>
      <Hero>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          }
        >
          <HeroSection ideasPromise={ideasPromise} />
        </Suspense>
      </Hero>
      
      <Stats />
      <Features />
      <Process />

      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedIdeasSection ideasPromise={ideasPromise} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection commentsPromise={commentsPromise} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <PricingSection plansPromise={plansPromise} userPromise={userPromise} />
      </Suspense>
      
      <CTA />
    </>
  );
}

async function HeroSection({ ideasPromise }: { ideasPromise: Promise<any> }) {
  const ideasResponse = await ideasPromise;
  const featuredIdeas = ideasResponse?.data?.slice(0, 3) ?? [];
  return <HeroIdeasGrid featuredIdeas={featuredIdeas as any} />;
}

async function FeaturedIdeasSection({ ideasPromise }: { ideasPromise: Promise<any> }) {
  const ideasResponse = await ideasPromise;
  const featuredIdeas = ideasResponse?.data?.slice(3, 6) ?? [];
  return <FeaturedIdeas ideas={featuredIdeas as any} />;
}

async function TestimonialsSection({ commentsPromise }: { commentsPromise: Promise<any> }) {
  const comments = await commentsPromise;
  return <Testimonials comments={comments?.data?.data as any} />;
}

async function PricingSection({ plansPromise, userPromise }: { plansPromise: Promise<any>, userPromise: Promise<any> }) {
  const [plansResponse, user] = await Promise.all([plansPromise, userPromise]);
  const plans = plansResponse?.data ?? [];
  return <Pricing plans={plans as any} user={user} />;
}

function SectionSkeleton() {
  return (
    <div className="py-20 mx-auto max-w-7xl px-4 space-y-8">
      <div className="space-y-4">
        <div className="h-6 w-32 bg-muted animate-pulse rounded-full" />
        <div className="h-10 w-2/3 bg-muted animate-pulse rounded-lg" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />)}
      </div>
    </div>
  );
}
