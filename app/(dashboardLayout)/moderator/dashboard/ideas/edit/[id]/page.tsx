import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getIdeaById } from "@/services/idea.service";
import { getCategories } from "@/services/category.service";
import EditIdeaForm from "@/components/modules/Admin/IdeaManagement/EditIdeaForm";
import { notFound } from "next/navigation";

const EditIdeaPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const queryClient = new QueryClient();

    const [ideaResponse, categoriesResponse] = await Promise.all([
        getIdeaById(id),
        getCategories(),
    ]);

    if (!ideaResponse?.success || !ideaResponse.data) {
        notFound();
    }

    const idea = ideaResponse.data;
    const categories = categoriesResponse?.data || [];

    await queryClient.prefetchQuery({
        queryKey: ["my-ideas", id],
        queryFn: () => getIdeaById(id),
    });

    await queryClient.prefetchQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="max-w-[1600px] mx-auto py-10 px-4 h-full">
                <EditIdeaForm idea={idea} categories={categories} mode="my-ideas" />
            </div>
        </HydrationBoundary>
    );
}

export default EditIdeaPage
