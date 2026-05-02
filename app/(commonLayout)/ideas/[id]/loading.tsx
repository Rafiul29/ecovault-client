import { Skeleton } from "@/components/ui/skeleton";

export default function IdeaDetailLoading() {
  return (
    <div className="flex flex-1 flex-col py-5">
      <main className="flex-1">
        <div className="wrapper">
          {/* Back Button Skeleton */}
          <Skeleton className="h-8 w-32 mb-5 rounded-lg" />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              {/* Main Image Gallery Skeleton */}
              <Skeleton className="h-72 sm:h-96 w-full rounded-xl" />

              {/* Title & Meta Skeleton */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-10 w-3/4 rounded-lg" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-4 w-32 rounded-md" />
                </div>
              </div>

              {/* Interaction Bar Skeleton */}
              <div className="flex items-center gap-3 py-2">
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-32 rounded-full" />
              </div>

              {/* Content Blocks Skeletons */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="border-b border-border px-5 py-3">
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="px-5 py-6 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {/* Sidebar Author Skeleton */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="border-b border-border px-4 py-3">
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-11 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>

              {/* Sidebar Stats Skeleton */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="border-b border-border px-4 py-3">
                  <Skeleton className="size-4 inline-block mr-2 align-middle" />
                  <Skeleton className="h-3 w-12 inline-block align-middle" />
                </div>
                <div className="divide-y divide-border">
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center justify-between px-4 py-3">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}