import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getIdeaById } from "@/services/idea.service";
import { getCategories } from "@/services/category.service";
import EditIdeaForm from "@/components/modules/Moderator/IdeaManagement/EditIdeaForm";
import { notFound, redirect } from "next/navigation";
import { getUserInfo } from "@/services/auth.service";
import { getMySubscription } from "@/services/subscription.service";
import { differenceInDays } from "date-fns";
import { ISubscription } from "@/types/subscription";

const EditIdeaPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    // --- Subscription guard ---
    const res = await getMySubscription().catch(() => null);
    const subscriptions = Array.isArray(res?.data)
        ? res.data
        : res?.data ? [res.data] : [];

    const subscription: ISubscription | null =
        subscriptions.find((s: ISubscription) => s.isActive) ||
        subscriptions[0] || null;

    const isExpired = !subscription?.isActive ||
        differenceInDays(new Date(subscription.endDate), new Date()) < 0;

    if (isExpired) {
        const returnUrl = `/moderator/dashboard/ideas/edit/${id}`;
        redirect(`/pricing?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
    // --- End guard ---

    const queryClient = new QueryClient();
    const user = await getUserInfo();

    const [ideaResponse, categoriesResponse] = await Promise.all([
        getIdeaById(id),
        getCategories("limit=1000"),
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
                <EditIdeaForm idea={idea} categories={categories} user={user} />
            </div>
        </HydrationBoundary>
    );
}

export default EditIdeaPage;
