"use server";

import { httpClient } from "@/lib/axios/httpClient";

export const getAllAdmins = async (queryString: string = "") => {
    return httpClient.get(`/admins?${queryString}`);
};

export const getMyAdminProfile = async () => {
    return httpClient.get(`/admins/profile`);
};

export const updateMyAdminProfile = async (payload: any) => {
    return httpClient.patch("/admins/profile", payload);
};

export const deleteAdmin = async (id: string) => {
    return httpClient.delete(`/admins/${id}`);
};

export const changeUserStatus = async (payload: { userId: string; userStatus: string }) => {
    return httpClient.patch("/admins/change-user-status", payload);
};

export const changeUserRole = async (payload: { userId: string; role: string }) => {
    return httpClient.patch("/admins/change-user-role", payload);
};

export const getAllUsers = async (queryString: string) => {
    return httpClient.get(`/admins/users?${queryString}`);
};

export const getUserById = async (id: string) => {
    return httpClient.get(`/admins/users/${id}`);
};

export const deleteUserAccount = async (id: string) => {
    return httpClient.delete(`/admins/users/${id}`);
};

export const getPublicProfileByUserId = async (id: string) => {
    return httpClient.get(`/admins/public-profile/${id}`);
};

export const createAdmin = async (payload: FormData) => {
    try {
        return await httpClient.post("/admins", payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    } catch (error: any) {
        return error;
    }
};
