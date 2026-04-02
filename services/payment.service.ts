"use server";

import { httpClient } from "@/lib/axios/httpClient";

export const getAllPurchases = async (queryString: string = "") => {
    try {
        return await httpClient.get(`/payments/all-purchases?${queryString}`);
    } catch (error: any) {
        return error;
    }
};

export const createCheckoutSession = async (ideaId: string) => {
    try {
        return await httpClient.post<{ url: string }>("/payments/create-checkout-session", { ideaId });
    } catch (error: any) {
        return error;
    }
};
