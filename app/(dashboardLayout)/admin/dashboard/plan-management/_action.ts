"use server"

import { createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } from "@/services/subscription.service"
import { ICreateSubscriptionPlanPayload, IUpdateSubscriptionPlanPayload } from "@/types/subscription"
import { revalidatePath } from "next/cache"

export const createSubscriptionPlanAction = async (payload: ICreateSubscriptionPlanPayload) => {
    try {
        console.log("[createSubscriptionPlanAction] Incoming payload:", payload)
        const response = await createSubscriptionPlan(payload)
        console.log("[createSubscriptionPlanAction] Result from service:", response)
        
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
        console.log("[updateSubscriptionPlanAction] Modifying session with ID:", id, "Payload:", payload)
        const response = await updateSubscriptionPlan(id, payload)
        console.log("[updateSubscriptionPlanAction] Result from service:", response)
        
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
        console.log("[deleteSubscriptionPlanAction] Attempting to wipe ID:", id)
        const response = await deleteSubscriptionPlan(id)
        console.log("[deleteSubscriptionPlanAction] Result from service:", response)
        
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
