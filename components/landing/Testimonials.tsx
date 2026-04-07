import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    email: string;
    image: string | null;
  };
  idea: {
    title: string;
    slug: string;
  };
}

interface TestimonialsProps {
  comments?: Comment[];
}

export function Testimonials({ comments = [] }: TestimonialsProps) {
  if (!comments || comments.length === 0) {
    return null; // hide if no comments are passed
  }

  return (
    <section className="bg-muted/30 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <Badge
            variant="outline"
            className="mb-4 bg-primary/5 uppercase tracking-widest text-[10px]"
          >
            Testimonials
          </Badge>
          <h2 className="section-heading text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            Trusted by the Global <br className="hidden sm:block" /> Sustainable
            Community
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground leading-relaxed">
            Discover why thousands of eco-entrepreneurs and investors choose
            EcoValut.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {comments.map((t) => (
            <div
              key={t.id}
              className="group flex flex-col rounded-3xl border border-border/60 bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1.5"
            >
              {/* Stars */}
              <div className="mb-6 flex gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4.5 fill-primary text-primary transition-transform group-hover:scale-110"
                  />
                ))}
              </div>

              <blockquote className="flex-1 text-base text-muted-foreground leading-relaxed italic">
                &ldquo;{t.content}&rdquo;
              </blockquote>

              <div className="mt-8 flex items-center gap-4 border-t border-border/50 pt-8">
                <Avatar className="size-10 ring-2 ring-background transition-transform hover:scale-105">
                  <AvatarImage src={t.author.image || ""} alt={t.author.name} />
                  <AvatarFallback className="text-xs bg-secondary text-primary font-bold">
                    {t.author.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold tracking-tight text-foreground line-clamp-1">
                    {t.author.name}
                  </p>
                  <p className="text-[11px] font-medium text-muted-foreground tracking-widest line-clamp-1 mt-0.5">
                    {t.idea.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
