import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getCategories } from "@/services/category.service";
import CreateIdeaForm from "@/components/modules/Admin/IdeaManagement/CreateIdeaForm";

const CreateIdeaPage = async () => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
    });

    const categoryData = await getCategories("limit=1000");
    const categories = categoryData?.data || [];

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>

            <CreateIdeaForm categories={categories} />

        </HydrationBoundary>
    );
}

export default CreateIdeaPage
