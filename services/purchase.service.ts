"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IIdeaPurchase } from "@/types/purchase.types";

/**
 * MODERATOR / ADMIN: Get all sold ideas (ideaPurchase records).
 * Optionally pass a userId to filter by a specific seller.
 */
export const getSoldIdeas = async (queryString?: string) => {
    try {
        const endpoint = queryString
            ? `/ideas/sold-ideas?${queryString}`
            : `/ideas/sold-ideas`;
        const response = await httpClient.get<IIdeaPurchase[]>(endpoint);
        return response;
    } catch (error) {
        console.error("Error fetching sold ideas:", error);
        throw error;
    }
};

/**
 * MEMBER: Get the current user's purchased ideas.
 */
export const getMyPurchases = async (queryString?: string) => {
    try {
        const endpoint = queryString
            ? `/ideas/my-purchases?${queryString}`
            : `/ideas/my-purchases`;
        const response = await httpClient.get<IIdeaPurchase[]>(endpoint);
        return response;
    } catch (error) {
        console.error("Error fetching my purchases:", error);
        throw error;
    }
};
