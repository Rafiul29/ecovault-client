import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye, Search, ThumbsUp } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Idea } from "@/types/types";

interface HeroProps {
  children?: React.ReactNode;
}

export function Hero({ children }: HeroProps) {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-16 text-center pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -top-20 right-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-secondary/80 blur-[80px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Content */}
      <Badge
        variant="secondary"
        className="mb-6 cursor-default gap-2 border border-primary/20 px-3 py-1.5 text-sm transition-all hover:border-primary/40 hover:bg-secondary/80 hover:shadow-sm"
      >
        <span className="size-1.5 animate-pulse rounded-full bg-primary" />
        The Eco-Innovation Marketplace
      </Badge>

      <h1 className="section-heading mx-auto max-w-5xl text-5xl tracking-tighter sm:text-6xl lg:text-7xl">
        Where{" "}
        <span className="bg-gradient-to-r from-primary via-emerald-600 to-accent bg-clip-text text-transparent">
          Green Ideas
        </span>
        <br />
        Meet Real Impact
      </h1>

      <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
        Submit, discover, and invest in eco-friendly innovations. EcoValut
        connects sustainability entrepreneurs with a global community that turns
        ideas into action.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/register"
          className={cn(
            buttonVariants({ size: "lg" }),
            "gap-2 px-8 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0",
          )}
        >
          Start for Free <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/ideas"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "gap-2 px-8 bg-background/50 backdrop-blur-sm",
          )}
        >
          <Search className="size-4" />
          Browse Ideas
        </Link>
      </div>

      {/* Social proof */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex -space-x-2.5">
          {["alex-rivera", "priya-nair", "marco-chen", "sara-okonkwo"].map(
            (u) => (
              <Avatar
                key={u}
                className="size-9 ring-2 ring-background transition-transform hover:-translate-y-1"
              >
                <AvatarImage src={`https://i.pravatar.cc/80?u=${u}`} alt={u} />
                <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                  {u[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ),
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Joined by{" "}
          <span className="font-semibold text-foreground">4,800+</span>{" "}
          innovators globaly
        </p>
      </div>

      <div className="relative mt-20 w-full max-w-5xl">
        {children}
      </div>
    </section>
  );
}

export function HeroIdeasGrid({ featuredIdeas }: { featuredIdeas: Idea[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {featuredIdeas.map((idea, i) => (
        <div
          key={idea.id}
          className={cn(
            "glass group rounded-2xl border p-4 text-left shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30",
            i === 1 ? "sm:-translate-y-4" : "sm:translate-y-0",
          )}
        >
          {idea.images[0] && (
            <Link href={`/ideas/${idea.id}`}>
              <div className="mb-3 h-32 overflow-hidden rounded-xl bg-muted/20 relative">
                <Image
                  src={idea.images[0]}
                  alt={idea.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500"
                />
              </div>
            </Link>
          )}
          <div className="mb-2 flex flex-wrap gap-1">
            {idea.categories.slice(0, 1).map((cat) => (
              <Badge
                key={cat?.category?.id}
                variant="secondary"
                className="text-[10px] px-1.5 py-0 bg-primary/5 text-primary"
              >
                {cat?.category?.name}
              </Badge>
            ))}
          </div>
          <Link href={`/ideas/${idea.id}`}>
            <p className="text-sm font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {idea.title}
            </p>
          </Link>
          <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="text-primary opacity-80"><ThumbsUp className="size-3.5" /></span>{" "}
              {formatNumber(idea.upvoteCount)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-primary opacity-80"><Eye className="size-3.5" /></span>{" "}
              {formatNumber(idea.viewCount)}
            </span>
            {idea.isPaid && (
              <span className="ml-auto font-bold text-primary">
                ${idea.price}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

