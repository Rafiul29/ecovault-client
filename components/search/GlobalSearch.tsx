"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, Lightbulb, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getIdeas } from "@/services/idea.service";
import { IIdea } from "@/types/idea.types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface GlobalSearchProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ isOpen, onOpenChange }: GlobalSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key and scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onOpenChange]);

  // Debounced search logic
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.set("searchTerm", searchTerm);
        queryParams.set("limit", "10");
        queryParams.set("status", "APPROVED");

        const response = await getIdeas(queryParams.toString());
        setResults(response.data || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setResults([]);
    }
  }, [isOpen]);

  const handleResultClick = () => {
    onOpenChange(false);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Manual implementation to avoid Radix scroll-lock jitter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[10vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full max-w-[600px] bg-background border border-border shadow-2xl rounded-2xl overflow-hidden pointer-events-auto flex flex-col"
              ref={containerRef}
            >
              {/* Header */}
              <div className="p-4 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  <Search className="size-5 text-primary" />
                  <Input
                    autoFocus
                    placeholder="Search for eco-solutions, problem statements..."
                    className="border-none focus-visible:ring-0 text-lg bg-transparent p-0 placeholder:text-muted-foreground/60 h-auto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="p-1 hover:bg-muted rounded-full transition-colors"
                    >
                      <X className="size-4 text-muted-foreground" />
                    </button>
                  )}
                  <button
                    onClick={() => onOpenChange(false)}
                    className="p-1 px-2 text-[10px] font-bold border rounded bg-muted/50 hover:bg-muted text-muted-foreground transition-colors"
                  >
                    ESC
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-1 sm:p-2">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                    <Loader2 className="size-8 animate-spin text-primary/40" />
                    <p className="text-sm font-medium">
                      Scanning for innovation...
                    </p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    <div className="px-2 mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                        Top Results
                      </p>
                    </div>
                    {results.map((idea) => (
                      <Link
                        key={idea.id}
                        href={`/ideas/${idea.id}`}
                        onClick={handleResultClick}
                        className="flex items-start gap-4 p-3 rounded-xl hover:bg-primary/5 transition-all group border border-transparent hover:border-primary/10"
                      >
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Lightbulb className="size-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                              {idea.title}
                            </h4>
                            {idea.isPaid && (
                              <Badge
                                variant="secondary"
                                className="text-[9px] h-4 py-0 px-1 font-medium bg-amber-500/10 text-amber-600 border-amber-600/20"
                              >
                                PAID
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                            {idea.description || idea.problemStatement}
                          </p>
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground/30 self-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                    <div className="mt-4 px-2">
                      <Link
                        href={`/search?searchTerm=${searchTerm}`}
                        onClick={handleResultClick}
                        className="flex items-center justify-center gap-2 text-xs font-bold text-primary hover:underline bg-primary/5 py-3 rounded-xl border border-primary/10"
                      >
                        View all results for &quot;{searchTerm}&quot;
                      </Link>
                    </div>
                  </div>
                ) : searchTerm ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                      <Search className="size-8 text-muted-foreground/30" />
                    </div>
                    <h3 className="font-bold text-foreground">
                      No matches found
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                      We couldn&apos;t find any ideas for &quot;{searchTerm}
                      &quot;. Try generic keywords.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col py-6 px-2 text-center text-muted-foreground">
                    <p className="text-sm px-4">
                      Start typing to search innovations across the community
                      feed...
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                      {["Carbon", "Plastic", "Energy", "Solar", "Water"].map(
                        (tag) => (
                          <button
                            key={tag}
                            onClick={() => setSearchTerm(tag)}
                            className="text-[11px] font-medium px-3 py-1 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground border border-border/50 transition-colors"
                          >
                            {tag}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-border/50 bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded border border-border bg-background text-[10px] font-mono text-muted-foreground shadow-sm">
                      esc
                    </kbd>
                    <span className="text-[10px] text-muted-foreground">
                      to close
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground/60 font-medium italic">
                  EcoVault Global Search
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
