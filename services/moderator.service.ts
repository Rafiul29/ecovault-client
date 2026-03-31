"use server";

import { httpClient } from "@/lib/axios/httpClient";

export const getMyModeratorProfile = async () => {
    return httpClient.get("/moderators/profile");
};

export const updateMyModeratorProfile = async (payload: any) => {
    return httpClient.patch("/moderators/profile", payload);
};

export const getAllModerators = async (queryString: string = "") => {
    return httpClient.get(`/moderators?${queryString}`);
};

export const toggleModeratorStatus = async (id: string) => {
    return httpClient.patch(`/moderators/toggle-status/${id}`, {});
};
