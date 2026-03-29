import { ArrowRight, CheckCircle, Globe, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/50 px-4 py-1.5 text-sm font-medium text-emerald-700 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Protecting the planet, one idea at a time
          </div>
          
          <h1 className="mt-8 text-5xl font-extrabold tracking-tight sm:text-7xl">
            The Digital Vault for <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Eco-Innovation
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            EcoVault is a secure platform to share, discover, and protect sustainable solutions. Join our community of innovators making a real-world impact.
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-base font-semibold">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-white transition-all hover:bg-emerald-700 hover:shadow-[0_0_20px_rgba(5,150,105,0.4)]"
            >
              Get Started for Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/ideas"
              className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-8 py-4 text-neutral-900 transition-all hover:bg-neutral-50"
            >
              Explore Ideas
            </Link>
          </div>
        </div>
        
        {/* Background gradient blur */}
        <div className="absolute top-0 -z-10 h-full w-full opacity-10 blur-3xl pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-emerald-400"></div>
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-cyan-400"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">Why EcoVault?</h2>
          <p className="mt-2 text-muted-foreground">Everything you need to scale your green technology.</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "Secure IP Protection",
              description: "State-of-the-art encryption ensures your innovative ideas remain your property.",
            },
            {
              icon: Globe,
              title: "Global Collaboration",
              description: "Connect with environmentalists and investors from around the world.",
            },
            {
              icon: Zap,
              title: "Rapid Implementation",
              description: "Tools to move from concept to implementation faster than ever.",
            },
          ].map((feature, i) => (
            <div key={i} className="group rounded-2xl border bg-white p-8 transition-all hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100/50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
