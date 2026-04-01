"use server";

import { httpClient } from "@/lib/axios/httpClient";

export const toggleWatchlist = async (payload: { ideaId: string }) => {
    try {
        const response = await httpClient.post<any>("/watchlists", payload);
        return response;
    } catch (error) {
        console.error("Error toggling watchlist:", error);
        throw error;
    }
}
