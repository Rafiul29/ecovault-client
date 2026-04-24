import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getCategories } from "@/services/category.service";
import CreateIdeaForm from "@/components/modules/Moderator/IdeaManagement/CreateIdeaForm";
import { getUserInfo } from "@/services/auth.service";
import { getMySubscription } from "@/services/subscription.service";
import { differenceInDays } from "date-fns";
import { redirect } from "next/navigation";
import { ISubscription } from "@/types/subscription";

const RETURN_URL = "/moderator/dashboard/ideas/create";

const CreateIdeaPage = async () => {
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

    console.log("isExpired", isExpired);
    if (isExpired) {
        redirect(`/pricing?returnUrl=${encodeURIComponent(RETURN_URL)}`);
    }
    // --- End guard ---

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
    });

    const categoryData = await getCategories("limit=1000");
    const categories = categoryData?.data || [];

    const user = await getUserInfo();

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CreateIdeaForm categories={categories} user={user} />
        </HydrationBoundary>
    );
}

export default CreateIdeaPage;
