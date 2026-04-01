import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { features } from "@/lib/mock-data";

export function Features() {
  return (
    <section className="py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <Badge
            variant="outline"
            className="mb-4 bg-primary/5 uppercase tracking-widest text-[10px]"
          >
            Platform Features
          </Badge>
          <h2 className="section-heading text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            Everything You Need <br className="hidden sm:block" /> to Innovate
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
            A complete ecosystem for eco-innovators — from idea submission to
            community feedback and investment.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features[0] && (
            <div
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 sm:col-span-2 lg:col-span-2"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.05) 0%, transparent 70%)",
              }}
            >
              {(() => {
                const Icon = features[0].icon;
                return (
                  <div
                    className={cn(
                      "mb-6 flex size-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110",
                      features[0].accent,
                    )}
                  >
                    <Icon className="size-7" />
                  </div>
                );
              })()}
              <h3 className="font-display text-2xl font-bold tracking-tight">
                {features[0].title}
              </h3>
              <p className="mt-4 max-w-md text-base text-muted-foreground leading-relaxed">
                {features[0].description}
              </p>
              <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-primary transition-colors">
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all group-hover:after:w-full">
                  Learn about submissions
                </span>
                <ChevronRight className="size-4 transition-transform group-hover:translate-x-1.5" />
              </div>

              <div className="pointer-events-none absolute -bottom-10 -right-10 size-48 rounded-full bg-primary/10 blur-3xl" />
            </div>
          )}

          {features.slice(1).map((f) => (
            <div
              key={f.title}
              className="group rounded-3xl border border-border/60 bg-card p-7 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1"
            >
              <div
                className={cn(
                  "mb-5 flex size-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:rotate-6 group-hover:scale-110",
                  f.accent,
                )}
              >
                <f.icon className="size-6" />
              </div>
              <h3 className="font-display text-lg font-bold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
