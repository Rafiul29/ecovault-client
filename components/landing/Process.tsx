import { Badge } from "@/components/ui/badge";
import { steps } from "@/lib/mock-data";

export function Process() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="wrapper">
        <div className="mb-20 text-center">
          <Badge
            variant="outline"
            className="mb-4 bg-primary/5 uppercase tracking-widest text-[10px]"
          >
            How It Works
          </Badge>
          <h2 className="section-heading text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            From Idea to Real-World <br className="hidden sm:block" /> Impact
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground leading-relaxed">
            A simple three-step process to bring your eco-innovations to the
            global stage.
          </p>
        </div>

        <div className="relative grid gap-12 sm:grid-cols-3">
          <div
            className="absolute left-[16.67%] right-[16.67%] top-7 hidden h-px bg-border/60 sm:block"
            style={{ width: "66.666%" }}
          />
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 mb-8 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform duration-500 group-hover:scale-110">
                  <span className="font-display text-lg font-bold tracking-tight">
                    {step.number}
                  </span>
                </div>
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:rotate-6">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-display text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed px-2">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
