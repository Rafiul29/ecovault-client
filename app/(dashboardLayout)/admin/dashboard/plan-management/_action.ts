"use server"

import { createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } from "@/services/subscription.service"
import { ICreateSubscriptionPlanPayload, IUpdateSubscriptionPlanPayload } from "@/types/subscription"
import { revalidatePath } from "next/cache"

export const createSubscriptionPlanAction = async (payload: ICreateSubscriptionPlanPayload) => {
    try {
        const response = await createSubscriptionPlan(payload)

        if (response.success) {
            revalidatePath("/admin/dashboard/plan-management")
        }

        return response
    } catch (error: any) {
        console.error("[createSubscriptionPlanAction] Critical failure:", error)
        return {
            success: false,
            message: error?.message || "Failed to create subscription plan",
        }
    }
}

export const updateSubscriptionPlanAction = async (id: string, payload: IUpdateSubscriptionPlanPayload) => {
    try {

        const response = await updateSubscriptionPlan(id, payload)

        if (response.success) {
            revalidatePath("/admin/dashboard/plan-management")
        }

        return response
    } catch (error: any) {
        console.error("[updateSubscriptionPlanAction] Critical failure:", error)
        return {
            success: false,
            message: error?.message || "Failed to update subscription plan",
        }
    }
}

export const deleteSubscriptionPlanAction = async (id: string) => {
    try {
        const response = await deleteSubscriptionPlan(id)

        if (response.success) {
            revalidatePath("/admin/dashboard/plan-management")
        }

        return response
    } catch (error: any) {
        console.error("[deleteSubscriptionPlanAction] Critical failure:", error)
        return {
            success: false,
            message: error?.message || "Failed to delete subscription plan",
        }
    }
}
