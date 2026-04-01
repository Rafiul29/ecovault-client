"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
    ISubscriptionPlan,
    ISubscription,
    ICreateSubscriptionPlanPayload,
    IUpdateSubscriptionPlanPayload
} from "@/types/subscription";

// Plan Services
export const getAllSubscriptionPlans = async (queryString?: string) => {
    try {
        const url = queryString ? `/subscriptions/plans?${queryString}` : "/subscriptions/plans";
        const response = await httpClient.get<ISubscriptionPlan[]>(url);
        return response;
    } catch (error) {
        console.error("Error fetching subscription plans:", error);
        throw error;
    }
}

export const getSubscriptionPlanById = async (id: string) => {
    try {
        const response = await httpClient.get<ISubscriptionPlan>(`/subscriptions/plans/${id}`);
        return response;
    } catch (error) {
        console.error("Error fetching subscription plan by id:", error);
        throw error;
    }
}

export const createSubscriptionPlan = async (payload: ICreateSubscriptionPlanPayload) => {
    try {
        const response = await httpClient.post<ISubscriptionPlan>("/subscriptions/plans", payload);
        return response;
    } catch (error) {
        console.error("Error creating subscription plan:", error);
        throw error;
    }
}

export const updateSubscriptionPlan = async (id: string, payload: IUpdateSubscriptionPlanPayload) => {
    try {
        const response = await httpClient.patch<ISubscriptionPlan>(`/subscriptions/plans/${id}`, payload);
        return response;
    } catch (error) {
        console.error("Error updating subscription plan:", error);
        throw error;
    }
}

export const deleteSubscriptionPlan = async (id: string) => {
    try {
        const response = await httpClient.delete<ISubscriptionPlan>(`/subscriptions/plans/${id}`);
        return response;
    } catch (error) {
        console.error("Error deleting subscription plan:", error);
        throw error;
    }
}

// All Subscriptions (Admin)
export const getAllSubscriptions = async (queryString?: string) => {
    try {
        // Backend route is /all-subscription based on the controller
        const url = queryString ? `/subscriptions/all-subscription?${queryString}` : "/subscriptions/all-subscription";
        // The backend returns a paginated result { data: ISubscription[], meta: PaginationMeta }
        const response = await httpClient.get<any>(url);
        return response;
    } catch (error) {
        console.error("Error fetching all subscriptions:", error);
        throw error;
    }
}

// User Subscription
export const getMySubscription = async () => {
    try {
        const response = await httpClient.get<ISubscription>("/subscriptions/my-subscription");
        return response;
    } catch (error) {
        console.error("Error fetching my subscription:", error);
        throw error;
    }
}
