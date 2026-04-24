"use client";

import { useMemo } from "react";
import { Filter, Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import IdeaCard from "@/components/ideas/IdeaCard";
import IdeaFilters from "@/components/ideas/IdeaFilters";
import IdeaPagination from "@/components/ideas/IdeaPagination";
import SearchInput from "@/components/search/SearchInput";

import { getIdeas } from "@/services/idea.service";
import { getCategories } from "@/services/category.service";
import { IIdea } from "@/types/idea.types";

export default function SearchPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Parse search params
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const searchTerm = searchParams.get("searchTerm") || "";
    const categoryId = searchParams.get("categories.category.id") || "ALL";
    const sortBy = searchParams.get("sortBy") || "trendingScore";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query string
    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("limit", limit.toString());
        params.set("status", "APPROVED");
        if (searchTerm) {
            params.set("searchTerm", searchTerm);
        }
        if (categoryId !== "ALL") {
            params.set("categories.category.id", categoryId);
        }
        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);
        return params.toString();
    }, [page, limit, categoryId, sortBy, sortOrder, searchTerm]);

    // Fetch data
    const { data: ideaResponse, isLoading: isLoadingIdeas, isFetching: isFetchingIdeas } = useQuery({
        queryKey: ["search-ideas", queryString],
        queryFn: () => getIdeas(queryString),
        enabled: true, // Let it fetch with empty search initially
    });

    const { data: categoryResponse, isLoading: isLoadingCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
    });

    const ideas = ideaResponse?.data || [];
    const meta = ideaResponse?.meta;
    const categories = categoryResponse?.data || [];

    // URL handlers
    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "ALL" && (key === "categories.category.id")) {
            params.delete(key);
        } else if (!value && key === "searchTerm") {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        // Reset page & limit when filters change
        if (key !== "page") {
            params.set("page", "1");
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const clearFilters = () => router.push(pathname, { scroll: false });

    return (
        <div className="flex flex-1 flex-col">
            <main className="mx-auto max-w-7xl px-2 py-12 w-full">
        {/* Search Header */}
        <div className="text-center mb-6 sm:mb-10 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 sm:mb-3">
            Find Eco-Innovations
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground px-4">
            Search through hundreds of problem-solving concepts submitted by the community
          </p>
        </div>

        {/* Big Search Input with results count inside or sticky bar feel */}
        <div className="mb-6 sm:mb-10">
            <SearchInput
                initialValue={searchTerm}
                onSearch={(val) => updateParams("searchTerm", val)}
                isLoading={isFetchingIdeas && !isLoadingIdeas}
            />
        </div>

        <div className="border-t border-border/40 pt-6 sm:pt-10">
                    <IdeaFilters
                        categories={categories}
                        selectedCategory={categoryId}
                        onCategoryChange={(val) => updateParams("categories.category.id", val)}
                        sortBy={sortBy}
                        onSortByChange={(val) => updateParams("sortBy", val)}
                        sortOrder={sortOrder}
                        onSortOrderChange={(val) => updateParams("sortOrder", val)}
                        onClearFilters={clearFilters}
                    />

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                                {meta?.total ?? ideas.length} Results
                            </span>
                            {searchTerm && (
                                <span className="text-xs text-muted-foreground italic truncate max-w-[200px]">
                                    for &quot;{searchTerm}&quot;
                                </span>
                            )}
                        </div>
                        {isFetchingIdeas && !isLoadingIdeas && (
                            <Loader2 className="size-4 animate-spin text-primary/60" />
                        )}
                    </div>

                    {isLoadingIdeas ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="size-10 animate-spin text-primary/30" strokeWidth={2.5} />
                        </div>
          ) : ideas.length === 0 ? (
            <div className="flex h-64 sm:h-80 flex-col items-center justify-center gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border border-dashed border-border/60 bg-muted/20 text-center">
              <div className="flex size-12 sm:size-14 items-center justify-center rounded-xl sm:rounded-2xl bg-muted shadow-inner">
                <Search className="size-6 sm:size-7 text-muted-foreground/40" />
              </div>
              <div className="max-w-xs px-6">
                <p className="text-base sm:text-lg font-bold text-foreground">
                  No matches found
                </p>
                <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                  Try using different keywords or broadening your category filter
                </p>
              </div>
            </div>
                    ) : (
          <div className="space-y-8 sm:space-y-12">
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ideas.map((idea: IIdea) => (
                <IdeaCard key={idea.id} idea={idea as any} showStatus />
              ))}
            </div>

                            <IdeaPagination
                                currentPage={page}
                                totalPages={meta?.totalPages || 0}
                                totalRows={meta?.total || 0}
                                onPageChange={(p) => updateParams("page", p.toString())}
                                isLoading={isFetchingIdeas}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
