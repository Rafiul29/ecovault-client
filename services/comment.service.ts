"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IComment } from "@/types/comment";
import { PaginationMeta } from "@/types/api.types";

export const getComments = async (queryString?: string) => {
    try {
        const response = await httpClient.get<{ data: IComment[], meta: PaginationMeta }>(queryString ? `/comments?${queryString}` : "/comments");
        return response;
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
}

export const getCommentsByIdeaId = async (ideaId: string) => {
    try {
        const response = await httpClient.get<IComment[]>(`/comments/idea/${ideaId}`);
        return response;
    } catch (error) {
        console.error("Error fetching comments by idea id:", error);
        throw error;
    }
}

export const updateComment = async (id: string, content: string) => {
    try {
        const response = await httpClient.patch<IComment>(`/comments/${id}`, { content });
        return response;
    } catch (error: any) {
        console.error("Error updating comment:", error);
        return { success: false, message: error.message || "Failed to update comment", data: null };
    }
}

export const createComment = async (payload: { content: string; ideaId: string; parentId?: string }) => {
    try {
        const response = await httpClient.post<IComment>("/comments", payload);
        return response;
    } catch (error: any) {
        console.error("Error creating comment:", error);
        return { success: false, message: error.message || "Failed to create comment", data: null };
    }
}

export const deleteComment = async (id: string) => {
    try {
        const response = await httpClient.delete<{ message: string }>(`/comments/${id}`);
        return response;
    } catch (error: any) {
        console.error("Error deleting comment:", error);
        return { success: false, message: error.message || "Failed to delete comment", data: null };
    }
}
