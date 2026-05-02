import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { Hero, HeroIdeasGrid } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Features } from "@/components/landing/Features";
import { Process } from "@/components/landing/Process";
import { FeaturedIdeas } from "@/components/landing/FeaturedIdeas";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { FAQ } from "@/components/landing/FAQ";
import { Newsletter } from "@/components/landing/Newsletter";
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
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-2xl border border-border/50 bg-card/40 p-5 space-y-4 shadow-sm",
                    i === 1 ? "sm:-translate-y-4" : "sm:translate-y-0"
                  )}
                >
                  <div className="h-32 w-full bg-muted/30 animate-pulse rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-4 w-1/3 bg-muted/30 animate-pulse rounded-md" />
                    <div className="h-4 w-full bg-muted/20 animate-pulse rounded-md" />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="h-3 w-10 bg-muted/20 animate-pulse rounded-full" />
                    <div className="h-3 w-10 bg-muted/20 animate-pulse rounded-full" />
                  </div>
                </div>
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

      <Suspense fallback={<SectionSkeleton count={3} />}>
        <FeaturedIdeasSection ideasPromise={ideasPromise} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton count={3} />}>
        <TestimonialsSection commentsPromise={commentsPromise} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton count={3} />}>
        <PricingSection plansPromise={plansPromise} userPromise={userPromise} />
      </Suspense>

      <FAQ />
      <Newsletter />
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

function SectionSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="section-padding wrapper space-y-12">
      <div className="space-y-4 text-center">
        <div className="h-4 w-24 bg-muted/30 animate-pulse rounded-full mx-auto" />
        <div className="h-10 w-full max-w-xl bg-muted/30 animate-pulse rounded-xl mx-auto" />
        <div className="h-4 w-full max-w-md bg-muted/20 animate-pulse rounded-lg mx-auto" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-border/50 bg-card/50 p-6 space-y-6">
            <div className="aspect-video w-full bg-muted/30 animate-pulse rounded-2xl" />
            <div className="space-y-3">
              <div className="h-5 w-3/4 bg-muted/30 animate-pulse rounded-lg" />
              <div className="h-4 w-full bg-muted/20 animate-pulse rounded-lg" />
              <div className="h-4 w-2/3 bg-muted/20 animate-pulse rounded-lg" />
            </div>
            <div className="pt-4 flex items-center justify-between border-t border-border/40">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-muted/30 animate-pulse" />
                <div className="h-4 w-20 bg-muted/20 animate-pulse rounded-lg" />
              </div>
              <div className="flex gap-2">
                <div className="size-6 rounded-md bg-muted/20 animate-pulse" />
                <div className="size-6 rounded-md bg-muted/20 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
