"use server"

import { createIdea, deleteIdea, getIdeaById, updateIdea } from "@/services/idea.service"
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.types"
import { type IIdea } from "@/types/idea.types"
import { revalidatePath } from "next/cache"

const getActionErrorMessage = (error: unknown, fallbackMessage: string) => {
    if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
    ) {
        return error.response.data.message
    }

    if (error instanceof Error) {
        return error.message
    }

    return fallbackMessage
}

export const createIdeaAction = async (
    payload: FormData,
): Promise<ApiResponse<IIdea> | ApiErrorResponse> => {
    // Validate FormData or just pass? Usually forms use Zod to validate before submission.
    // If we want server-side validation using Zod:
    // const dataObj = Object.fromEntries(payload.entries());

    try {
        const response = await createIdea(payload)
        
        if (response.success) {
            revalidatePath("/admin/dashboard/idea-management")
            revalidatePath("/moderator/dashboard/ideas")
        }
        
        return response
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to create idea"),
        }
    }
}

export const updateIdeaAction = async (
    id: string,
    payload: FormData,
): Promise<ApiResponse<IIdea> | ApiErrorResponse> => {
    try {
        const response = await updateIdea(id, payload)
        
        if (response.success) {
            revalidatePath("/admin/dashboard/idea-management")
            revalidatePath("/moderator/dashboard/ideas")
        }
        
        return response
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to update idea"),
        }
    }
}

export const deleteIdeaAction = async (
    id: string,
    permanent: boolean = false
): Promise<ApiResponse<{ message: string }> | ApiErrorResponse> => {
    if (!id) {
        return {
            success: false,
            message: "Invalid idea id",
        }
    }

    try {
        const response = await deleteIdea(id, permanent)
        
        if (response.success) {
            revalidatePath("/admin/dashboard/idea-management")
            revalidatePath("/moderator/dashboard/ideas")
        }
        
        return response
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to delete idea"),
        }
    }
}

export const getIdeaByIdAction = async (
    id: string,
): Promise<ApiResponse<IIdea> | ApiErrorResponse> => {
    if (!id) {
        return {
            success: false,
            message: "Invalid idea id",
        }
    }

    try {
        return await getIdeaById(id)
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to fetch idea details"),
        }
    }
}