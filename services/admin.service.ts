"use server";

import { httpClient } from "@/lib/axios/httpClient";

export const getAllAdmins = async () => {
    return httpClient.get("/admins");
};

export const getAdminById = async (id: string) => {
    return httpClient.get(`/admins/${id}`);
};

export const updateAdmin = async (id: string, payload: any) => {
    return httpClient.patch(`/admins/${id}`, payload);
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
