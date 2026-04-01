"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Idea } from "@/types/types";

interface FeaturedIdeasProps {
  ideas: Idea[];
}

export function FeaturedIdeas({ ideas }: FeaturedIdeasProps) {
  return (
    <section className="py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8 md:gap-12">
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="mb-4 bg-primary/5 uppercase tracking-widest text-[10px]"
            >
              Trending Ideas
            </Badge>
            <h2 className="section-heading text-4xl sm:text-5xl lg:text-6xl tracking-tight">
              Top Innovative Concepts <br className="hidden sm:block" /> Shaping
              Tomorrow
            </h2>
            <p className="mt-6 text-base text-muted-foreground leading-relaxed">
              Explore our most upvoted and verified eco-friendly solutions from
              creators around the globe.
            </p>
          </div>
          <Link
            href="/ideas"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "gap-2 group transition-all",
            )}
          >
            Explore Marketplace{" "}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <Card
              key={idea.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30"
            >
              {idea.images[0] && (
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={idea.images[0]}
                    alt={idea.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {idea.isPaid && (
                    <div className="absolute right-4 top-4 rounded-full bg-background/95 px-3 py-1 text-xs font-bold text-primary shadow-lg backdrop-blur-md">
                      ${idea.price}
                    </div>
                  )}
                </div>
              )}
              <CardHeader className="pb-4 pt-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  {idea.categories.slice(0, 2).map((cat) => (
                    <Badge
                      key={cat.id}
                      variant="secondary"
                      className="px-2 py-0 text-[10px] bg-primary/5 text-primary border-primary/10"
                    >
                      {cat.name}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-xl font-bold leading-snug tracking-tight group-hover:text-primary transition-colors">
                  <Link href={`/ideas/${idea.slug}`}>{idea.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between">
                <p className="text-sm line-clamp-3 text-muted-foreground leading-relaxed">
                  {idea.description}
                </p>
                <div className="mt-8 flex items-center justify-between gap-4 border-t border-border/50 pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8 ring-2 ring-background ring-offset-2 ring-offset-muted/10">
                      <AvatarImage
                        src={idea.author.image}
                        alt={idea.author.name}
                      />
                      <AvatarFallback className="text-[10px] font-bold">
                        {idea.author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-foreground/80">
                      {idea.author.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="text-primary opacity-80">👍</span>{" "}
                      {formatNumber(idea.upvoteCount)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-primary opacity-80">👁</span>{" "}
                      {formatNumber(idea.viewCount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
