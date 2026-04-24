"use client";

import { useMemo } from "react";
import { Filter, Lightbulb, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import IdeaCard from "@/components/ideas/IdeaCard";
import IdeaFilters from "@/components/ideas/IdeaFilters";
import IdeaPagination from "@/components/ideas/IdeaPagination";

import { getIdeas } from "@/services/idea.service";
import { getCategories } from "@/services/category.service";
import { IIdea } from "@/types/idea.types";

export default function IdeasPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Parse search params
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const categoryId = searchParams.get("categories.category.id") || "ALL";
    const sortBy = searchParams.get("sortBy") || "trendingScore";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query string
    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("limit", limit.toString());
        params.set("status", "APPROVED"); // Added status=APPROVED
        if (categoryId !== "ALL") {
            params.set("categories.category.id", categoryId);
        }
        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);
        return params.toString();
    }, [page, limit, categoryId, sortBy, sortOrder]);

    // Fetch data
    const { data: ideaResponse, isLoading: isLoadingIdeas, isFetching: isFetchingIdeas } = useQuery({
        queryKey: ["ideas", queryString],
        queryFn: () => getIdeas(queryString),
    });

    const { data: categoryResponse, isLoading: isLoadingCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
    });

    const ideas = ideaResponse?.data || [];
    const meta = ideaResponse?.meta;
    const categories = categoryResponse?.data || [];

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "ALL" && key === "categories.category.id") {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        // Reset page when filter/sort changes
        if (key !== "page") {
            params.set("page", "1");
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const clearFilters = () => {
        router.push(pathname, { scroll: false });
    };

    return (
        <div className="flex flex-1 flex-col">
            <main className="mx-auto max-w-7xl px-2 py-10 w-full">
                {/* Page Header */}
                <div className="mb-8 ">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                                    <Lightbulb className="size-4 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    Browse Ideas
                                </h1>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Discover eco-innovations submitted by the community
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters Section (Client Component extracted) */}
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

                <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-muted-foreground font-medium">
                        {meta?.total ?? ideas.length} {(meta?.total ?? ideas.length) === 1 ? "idea" : "ideas"} found
                    </p>
                    {isFetchingIdeas && !isLoadingIdeas && (
                        <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                    )}
                </div>

                {isLoadingIdeas ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="size-8 animate-spin text-primary/50" />
                    </div>
                ) : ideas.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 text-center">
                        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                            <Filter className="size-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                No ideas found
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Try adjusting your filters
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {ideas.map((idea: IIdea) => (
                                <IdeaCard key={idea.id} idea={idea as any} showStatus />
                            ))}
                        </div>

                        {/* Pagination (Client Component extracted) */}
                        <IdeaPagination
                            currentPage={page}
                            totalPages={meta?.totalPages || 0}
                            totalRows={meta?.total || 0}
                            onPageChange={(p) => updateParams("page", p.toString())}
                            isLoading={isFetchingIdeas}
                        />
                    </>
                )}
            </main>
        </div>
    );
}
