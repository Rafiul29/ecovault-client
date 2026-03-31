"use client";

import DataTable from "@/components/shared/table/DataTable";
import { ISubscriptionPlan } from "@/types/subscription";
import { getAllSubscriptionPlans } from "@/services/subscription.service";
import { useQuery } from "@tanstack/react-query";
import { planColumns } from "./planColumns";
import CreatePlanFormModal from "./CreatePlanFormModal";
import EditPlanFormModal from "./EditPlanFormModal";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";

const PlanTable = () => {
    const {
        editingItem,
        isEditModalOpen,
        onEditOpenChange,
        tableActions,
    } = useRowActionModalState<ISubscriptionPlan>();

    const { data: plansResponse, isLoading, isFetching } = useQuery({
        queryKey: ["subscription-plans"],
        queryFn: () => getAllSubscriptionPlans(),
    });

    const plans = plansResponse?.data ?? [];

    return (
        <>
            <DataTable
                data={plans}
                columns={planColumns}
                isLoading={isLoading || isFetching}
                emptyMessage="No subscription plans defined."
                toolbarAction={<CreatePlanFormModal />}
                actions={tableActions}
            />

            <EditPlanFormModal
                open={isEditModalOpen}
                onOpenChange={onEditOpenChange}
                plan={editingItem}
            />
        </>
    )

}
export default PlanTable
