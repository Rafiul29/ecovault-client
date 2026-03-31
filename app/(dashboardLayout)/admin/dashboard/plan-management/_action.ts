"use server"

import { createSubscriptionPlan, updateSubscriptionPlan } from "@/services/subscription.service"
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
        return {
            success: false,
            message: error?.message || "Failed to update subscription plan",
        }
    }
}
