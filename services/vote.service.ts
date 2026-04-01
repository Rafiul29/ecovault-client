"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface IVoteResponse {
    action: "added" | "removed" | "updated";
    value: number;
}

export const toggleVote = async (payload: { ideaId: string; value: number }) => {
    try {
        const response = await httpClient.post<IVoteResponse>("/votes", payload);
        return response;
    } catch (error) {
        console.error("Error toggling vote:", error);
        throw error;
    }
}
