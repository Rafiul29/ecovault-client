import { Separator } from "@/components/ui/separator";
import { statsData } from "@/lib/mock-data";

export function Stats() {
  return (
    <section className="border-y border-border bg-muted/40 py-10 transition-colors hover:bg-muted/50">
      <div className="wrapper">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {statsData.map((s, i) => (
            <div
              key={s.label}
              className="relative flex flex-col items-center gap-1.5 text-center group"
            >
              {i > 0 && (
                <Separator
                  orientation="vertical"
                  className="absolute -left-4 hidden h-10 md:block opacity-50"
                />
              )}
              <p className="font-display text-4xl font-bold text-primary transition-transform group-hover:scale-105 duration-300">
                {s.value}
              </p>
              <p className="text-label text-[10px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
