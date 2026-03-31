"use server";

import { httpClient } from "@/lib/axios/httpClient";

export const getMyMemberProfile = async () => {
    return httpClient.get("/members/profile");
};

export const getMyPurchasedIdeas = async () => {
    return httpClient.get("/members/purchased-ideas");
};

export const getMyFollowers = async () => {
    return httpClient.get("/members/followers");
};

export const getMyFollowing = async () => {
    return httpClient.get("/members/following");
};

export const getMyReviews = async () => {
    return httpClient.get("/members/reviews");
};

export const getMemberInvoice = async (paymentId: string) => {
    return httpClient.get(`/members/invoice/${paymentId}`);
};

export const getAllMembers = async (queryString: string = "") => {
    return httpClient.get(`/members?${queryString}`);
};
