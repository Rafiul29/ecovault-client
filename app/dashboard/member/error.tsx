"use client";

import { RefreshCw, ShieldAlert, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
     console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center p-8 bg-neutral-950 rounded-[3rem] shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-12 opacity-10">
           <ShieldAlert className="h-48 w-48 text-rose-500 -rotate-12" />
        </div>
        <div className="absolute bottom-0 left-0 p-12 opacity-10">
           <ShieldAlert className="h-48 w-48 text-indigo-500 rotate-12" />
        </div>

        <div className="relative z-10 text-center space-y-8 animate-fade-in-up">
           <div className="mx-auto h-24 w-24 rounded-[2rem] bg-rose-600 flex items-center justify-center shadow-2xl shadow-rose-500/30">
              <ShieldAlert className="h-12 w-12 text-white" />
           </div>

           <div className="space-y-4">
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter sm:text-5xl">Vault Access Error</h1>
              <p className="mx-auto max-w-md text-lg font-bold text-neutral-400">
                 Our security protocols detected an anomaly. The request could not be completed at this time.
              </p>
           </div>

           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => reset()}
                className="group flex items-center gap-3 rounded-2xl bg-white px-8 py-5 text-sm font-black text-neutral-900 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
              >
                <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-700" />
                Retry Verification
              </button>
              
              <Link
                href="/"
                className="group flex items-center gap-3 rounded-2xl border border-neutral-700 bg-neutral-900 px-8 py-5 text-sm font-black text-white transition-all hover:bg-neutral-800"
              >
                <Home className="h-5 w-5" />
                Return to Safe Zone
              </Link>
           </div>

           <div className="pt-12 text-xs font-black text-neutral-600 uppercase tracking-widest flex items-center justify-center gap-2">
              <div className="h-1 w-1 rounded-full bg-rose-500" />
              Error {error.digest || "CRYPTIC_ANOMALY"}
              <div className="h-1 w-1 rounded-full bg-rose-500" />
           </div>
        </div>
    </div>
  );
}
