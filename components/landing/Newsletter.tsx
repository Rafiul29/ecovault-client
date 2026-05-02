"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Successfully subscribed to the newsletter!");
      setEmail("");
    }, 1000);
  };

  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute -top-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-black/10 blur-3xl" />
      
      <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Stay updated on eco-innovations
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-xl">
              Join our newsletter to receive the latest sustainability ideas, funding opportunities, and community highlights delivered straight to your inbox.
            </p>
          </div>
          
          <div className="w-full max-w-md shrink-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-6 bg-card/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-w-0 flex-auto rounded-lg border border-white/20 bg-white/5 px-4 py-3.5 text-white shadow-sm ring-1 ring-inset ring-transparent focus:ring-white/50 focus:outline-none sm:text-sm sm:leading-6 placeholder:text-white/50 transition-all"
                  placeholder="Enter your email"
                />
              </div>
              <Button 
                type="submit" 
                variant="secondary" 
                size="lg" 
                className="w-full font-semibold h-12"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="size-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                    Subscribing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Subscribe Now <Send className="size-4" />
                  </span>
                )}
              </Button>
              <p className="text-xs text-primary-foreground/60 text-center mt-2">
                We care about your data. Read our Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
