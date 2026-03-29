"use client";

import { Leaf } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6">
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-16 w-16 rounded-3xl bg-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-200"
        >
          <Leaf className="h-8 w-8 text-white" />
        </motion.div>
        
        {/* Pulsing rings */}
        <div className="absolute inset-0 animate-ping rounded-3xl bg-emerald-500/20 scale-125 pointer-events-none" />
        <div className="absolute inset-0 animate-pulse rounded-3xl bg-emerald-500/10 scale-150 pointer-events-none" />
      </div>

      <div className="space-y-2 text-center">
        <h2 className="text-xl font-black text-neutral-900 uppercase tracking-widest">
           Syncing Vault
        </h2>
        <div className="flex items-center gap-1 justify-center px-4">
           {[...Array(3)].map((_, i) => (
              <motion.div
                 key={i}
                 animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                 transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                 className="h-1.5 w-1.5 rounded-full bg-emerald-600"
              />
           ))}
        </div>
      </div>
    </div>
  );
}
