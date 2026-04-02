"use server";

import { httpClient } from "@/lib/axios/httpClient";

export const toggleFollow = async (followingId: string) => {
    const response = await httpClient.post("/follows", { followingId });
    return response;
};

export const getUserFollowers = async (userId: string) => {
    const response = await httpClient.get(`/follows/followers/${userId}`);
    return response;
};

export const getUserFollowing = async (userId: string) => {
    const response = await httpClient.get(`/follows/following/${userId}`);
    return response;
};
