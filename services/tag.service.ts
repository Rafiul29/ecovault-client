"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ICreateTagPayload, IUpdateTagPayload, ITag } from "@/types/tag.types";

export const getTags = async (queryString?: string) => {
    try {
        const response = await httpClient.get<ITag[]>(queryString ? `/tags?${queryString}` : "/tags");
        return response;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
}

export const getTagById = async (id: string) => {
    try {
        const response = await httpClient.get<ITag>(`/tags/${id}`);
        return response;
    } catch (error) {
        console.error("Error fetching tag by id:", error);
        throw error;
    }
}

export const createTag = async (payload: ICreateTagPayload | any) => {
    try {
        const response = await httpClient.post<ITag>("/tags", payload);
        return response;
    } catch (error) {
        console.error("Error creating tag:", error);
        throw error;
    }
}

export const updateTag = async (id: string, payload: IUpdateTagPayload | any) => {
    try {
        const response = await httpClient.patch<ITag>(`/tags/${id}`, payload);
        return response;
    } catch (error) {
        console.error("Error updating tag:", error);
        throw error;
    }
}

export const deleteTag = async (id: string, permanent: boolean = false) => {
    try {
        const url = permanent ? `/tags/${id}?permanent=true` : `/tags/${id}`;
        const response = await httpClient.delete<{ message: string }>(url);
        return response;
    } catch (error) {
        console.error("Error deleting tag:", error);
        throw error;
    }
}
