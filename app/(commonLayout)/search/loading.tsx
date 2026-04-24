import { Skeleton } from "@/components/ui/skeleton";
import { IdeaCardSkeleton } from "@/components/ideas/IdeaCard";

export default function SearchLoading() {
    return (
        <div className="flex flex-1 flex-col">
            <main className="mx-auto max-w-7xl px-2 py-12 w-full">
                {/* Search Header Skeleton */}
                <div className="text-center mb-6 sm:mb-10 max-w-2xl mx-auto space-y-3">
                    <Skeleton className="h-10 w-2/3 mx-auto rounded-lg" />
                    <Skeleton className="h-4 w-full px-4 rounded-lg" />
                </div>

                {/* Search Input Skeleton */}
                <div className="mb-6 sm:mb-10 max-w-3xl mx-auto">
                    <Skeleton className="h-14 w-full rounded-2xl shadow-sm" />
                </div>

                <div className="border-t border-border/40 pt-6 sm:pt-10">
                    {/* Filters Skeleton */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        <Skeleton className="h-10 w-32 rounded-lg" />
                        <Skeleton className="h-10 w-40 rounded-lg" />
                        <Skeleton className="h-10 w-24 rounded-lg" />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>

                    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[...Array(8)].map((_, i) => (
                            <IdeaCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}