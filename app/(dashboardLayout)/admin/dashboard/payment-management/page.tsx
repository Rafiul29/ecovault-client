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
            <div className="space-y-12">
                <div className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 font-sans">Revenue Operations</h1>
                        <p className="mt-2 text-lg text-neutral-500 font-medium tracking-tight">
                            Monitor global transactions, audit payment gateway performance, and manage marketplace settlement statuses for the EcoVault ecosystem.
                        </p>
                    </div>
                </div>
                <div className="overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-sm border border-neutral-100/60 relative">
                    <PaymentTable initialQueryString={queryString} />
                </div>
            </div>
        </HydrationBoundary>
    );
}

export default PaymentManagementPage;
