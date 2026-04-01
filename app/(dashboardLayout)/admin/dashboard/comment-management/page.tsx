import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getComments } from "@/services/comment.service";
import CommentTable from "@/components/modules/Admin/CommentManagement/CommentTable";

const CommentManagementPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {

    const queryParamsObjects = await searchParams;

    const queryString = Object.keys(queryParamsObjects)
        .map((key) => {
            const value = queryParamsObjects[key];
            if (value === undefined) {
                return "";
            }


            if (Array.isArray(value)) {
                return value
                    .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
                    .join("&");
            }

            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .filter(Boolean)
        .join("&");


    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["comments", queryString],
        queryFn: () => getComments(queryString),
        staleTime: 1000 * 60,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="space-y-12">
                <div className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 font-sans">Comment Management</h1>
                        <p className="mt-2 text-lg text-neutral-500 font-medium tracking-tight">
                            Monitor and manage user comments across the platform.
                        </p>
                    </div>
                </div>
                <div className="overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-sm border border-neutral-100/60 relative">
                    <CommentTable initialQueryString={queryString} />
                </div>
            </div>
        </HydrationBoundary>
    );
}

export default CommentManagementPage
