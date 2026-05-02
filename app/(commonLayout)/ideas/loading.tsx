import { IdeaCardSkeleton } from "@/components/ideas/IdeaCard";

export default function IdeaListLoading() {
    return (
        <div className="wrapper section-padding py-12 w-full">
            <div className="text-center mb-10 max-w-2xl mx-auto space-y-3">
                <div className="h-10 w-64 bg-muted animate-pulse mx-auto rounded-lg" />
                <div className="h-4 w-96 bg-muted animate-pulse mx-auto rounded-lg" />
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-4 mb-8 border-b border-border hide-scrollbar">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 w-28 bg-muted animate-pulse rounded-full shrink-0" />
                ))}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (  
                    <IdeaCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}