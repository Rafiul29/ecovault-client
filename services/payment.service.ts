"use server";

import { httpClient } from "@/lib/axios/httpClient";

export const getAllPurchases = async (queryString: string = "") => {
    return httpClient.get(`/payments/all-purchases?${queryString}`);
};
