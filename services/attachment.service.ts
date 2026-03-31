"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface IAttachment {
  id: string;
  type: "VIDEO" | "PDF" | "DOCUMENT";
  url: string;
  title?: string | null;
  ideaId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAttachmentPayload {
  type: "VIDEO" | "PDF" | "DOCUMENT";
  url: string;
  title?: string;
  ideaId: string;
}

export const getAttachmentsByIdea = async (ideaId: string) => {
    try {
        const response = await httpClient.get<{success: boolean, message: string, data: IAttachment[]}>(`/attachments/idea/${ideaId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching attachments:", error);
        throw error;
    }
}

export const createAttachment = async (payload: FormData) => {
    try {
        const response = await httpClient.post<{success: boolean, message: string, data: IAttachment}>("/attachments", payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating attachment:", error);
        throw error;
    }
}

export const deleteAttachment = async (id: string) => {
    try {
        const response = await httpClient.delete<{success: boolean, message: string}>(`/attachments/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting attachment:", error);
        throw error;
    }
}
