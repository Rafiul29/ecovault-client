"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IIdea, ICreateIdeaPayload, IUpdateIdeaPayload } from "@/types/idea.types";
import { revalidateTag, revalidatePath } from "next/cache";

export const getIdeas = async (queryString?: string) => {
    try {
        const response = await httpClient.get<IIdea[]>(queryString ? `/ideas?${queryString}` : "/ideas");
        return response;
    } catch (error) {
        console.error("Error fetching ideas:", error);
        throw error;
    }
}

export const getMyIdeas = async (queryString?: string) => {
    try {
        const response = await httpClient.get<IIdea[]>(queryString ? `/ideas/my-ideas?${queryString}` : "/ideas/my-ideas");
        return response;
    } catch (error) {
        console.error("Error fetching my ideas:", error);
        throw error;
    }
}

export const getIdeaById = async (id: string) => {
    try {
        const response = await httpClient.get<IIdea>(`/ideas/${id}`);
        return response;
    } catch (error) {
        console.error("Error fetching idea by id:", error);
        throw error;
    }
}

export const createIdea = async (payload: FormData) => {
    try {
        const response = await httpClient.post<IIdea>("/ideas", payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        revalidateTag("ideas", "page");
        revalidateTag("my-ideas", "page");
        revalidatePath("/admin/dashboard/idea-management", "page");
        revalidatePath("/moderator/dashboard/ideas", "page");
        return response;
    } catch (error) {
        console.error("Error creating idea:", error);
        throw error;
    }
}

export const updateIdea = async (id: string, payload: FormData) => {
    try {
        const response = await httpClient.put<IIdea>(`/ideas/${id}`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        revalidateTag("ideas", "page");
        revalidateTag("my-ideas", "page");
        revalidatePath("/admin/dashboard/idea-management", "page");
        revalidatePath("/moderator/dashboard/ideas", "page");
        return response;
    } catch (error) {
        console.error("Error updating idea:", error);
        throw error;
    }
}

export const deleteIdea = async (id: string, permanent: boolean = false) => {
    try {
        const url = permanent ? `/ideas/${id}?permanent=true` : `/ideas/${id}`;
        const response = await httpClient.delete<{ message: string }>(url);
        revalidateTag("ideas", "page");
        revalidateTag("my-ideas", "page");
        revalidatePath("/admin/dashboard/idea-management", "page");
        revalidatePath("/moderator/dashboard/ideas", "page");
        return response;
    } catch (error) {
        console.error("Error deleting idea:", error);
        throw error;
    }
}