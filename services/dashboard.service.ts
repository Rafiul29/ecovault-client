"use server";

import { httpClient } from "@/lib/axios/httpClient";

export const getAdminDashboardData = async () => {
    return httpClient.get("/stats/dashboard");
};

export const getModeratorDashboardData = async () => {
    return httpClient.get("/stats/dashboard");
};

export const getMemberDashboardData = async () => {
    return httpClient.get("/stats/dashboard");
};
