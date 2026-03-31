import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getCategories } from "@/services/category.service";
import CategoryTable from "@/components/modules/Admin/CategoryManagement/CategoryTable";

const CategoryManagementPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {

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
        queryKey: ["categories", queryString],
        queryFn: () => getCategories(queryString),
        staleTime: 1000 * 60,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Category Management</h1>
                        <p className="text-muted-foreground">
                            Organize ideas by defining categories that help users discover relevant content.
                        </p>
                    </div>
                </div>
                <CategoryTable initialQueryString={queryString} />
            </div>
        </HydrationBoundary>
    );
}

export default CategoryManagementPage
