"use server";

import { httpClient } from "@/lib/axios/httpClient";

export const getDashboardData = async () => {
    return httpClient.get("/stats/dashboard");
};
