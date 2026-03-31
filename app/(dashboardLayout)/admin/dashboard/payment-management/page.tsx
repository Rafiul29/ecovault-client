import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getAllPurchases } from "@/services/payment.service";
import PaymentTable from "@/components/modules/Admin/PaymentManagement/PaymentTable";

const PaymentManagementPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const queryClient = new QueryClient();

    const queryParamsObjects = await searchParams;

    const queryString = Object.keys(queryParamsObjects)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(queryParamsObjects[key]))}`)
        .join("&");

    await queryClient.prefetchQuery({
        queryKey: ["payments", queryString],
        queryFn: () => getAllPurchases(queryString),
        staleTime: 1000 * 60,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <div className="h-2 w-10 bg-emerald-500 rounded-full" />
                            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">Revenue Operations</h1>
                        </div>
                        <p className="text-sm font-medium text-neutral-500 max-w-2xl">
                            Monitor global transactions, audit payment gateway performance, and manage marketplace settlement statuses for the EcoVault ecosystem.
                        </p>
                    </div>
                </div>
                <PaymentTable initialQueryString={queryString} />
            </div>
        </HydrationBoundary>
    );
}

export default PaymentManagementPage;
