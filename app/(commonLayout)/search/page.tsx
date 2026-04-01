"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import IdeaCard from "@/components/ideas/IdeaCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockIdeas, mockCategories } from "@/lib/mock-data";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const results = useMemo(() => {
    return mockIdeas.filter((idea) => {
      const matchesQuery =
        !query ||
        idea.title.toLowerCase().includes(query.toLowerCase()) ||
        idea.description.toLowerCase().includes(query.toLowerCase()) ||
        idea.tags.some((t) =>
          t.name.toLowerCase().includes(query.toLowerCase()),
        );
      const matchesCategory =
        selectedCategory === "ALL" ||
        idea.categories.some((c) => c.id === selectedCategory);
      return matchesQuery && matchesCategory && idea.status === "PUBLISHED";
    });
  }, [query, selectedCategory]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="text-display font-bold">Find Ideas</h1>
            <p className="text-caption mt-2">
              Discover eco-innovations from the community
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-12 pl-12 pr-4 text-base"
              placeholder="Search ideas, tags, topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                onClick={() => setQuery("")}
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Category */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === "ALL" ? "default" : "outline"}
              className="cursor-pointer px-3 py-1"
              onClick={() => setSelectedCategory("ALL")}
            >
              All
            </Badge>
            {mockCategories.map((cat) => (
              <Badge
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className="cursor-pointer px-3 py-1"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </Badge>
            ))}
          </div>

          {query || selectedCategory !== "ALL" ? (
            <>
              <p className="text-caption mb-4">
                {results.length} result{results.length !== 1 ? "s" : ""}{" "}
                {query && <span>for &quot;{query}&quot;</span>}
              </p>
              {results.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2 text-center">
                  <Search className="size-10 text-muted-foreground/30" />
                  <p className="text-subheading text-muted-foreground">
                    No results found
                  </p>
                  <p className="text-caption">
                    Try a different keyword or category
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="mx-auto size-12 mb-3 opacity-20" />
              <p className="text-subheading">Start typing to search</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
