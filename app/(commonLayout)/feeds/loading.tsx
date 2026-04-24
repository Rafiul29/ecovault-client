import { Skeleton } from "@/components/ui/skeleton";
import { IdeaCardSkeleton } from "@/components/ideas/IdeaCard";

export default function FeedLoading() {
    return (
        <div className="flex flex-1 flex-col">
            <main className="mx-auto max-w-4xl px-2 sm:px-4 py-4 sm:py-8 w-full">
                {/* Header Skeleton */}
                <div className="mb-4 sm:mb-8 space-y-3">
                    <Skeleton className="h-8 w-48 sm:h-10 sm:w-64 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full md:w-2/3" />
                        <Skeleton className="h-4 w-1/2 md:w-5/12" />
                    </div>
                </div>

                {/* Tabs Skeleton */}
                <div className="flex space-x-1.5 sm:space-x-2 overflow-x-auto pb-2 sm:pb-4 mb-4 border-b border-border hide-scrollbar">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-8 w-24 sm:h-10 sm:w-28 rounded-full shrink-0" />
                    ))}
                </div>

                {/* Feed Content Skeleton */}
                <div className="flex flex-col gap-4 sm:gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <IdeaCardSkeleton key={i} />
                    ))}
                </div>
            </main>
        </div>
    );
}