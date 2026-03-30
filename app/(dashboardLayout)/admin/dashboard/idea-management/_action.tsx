"use server"

import { createIdea, deleteIdea, getIdeaById, updateIdea } from "@/services/idea.services"
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.types"
import { type IIdea } from "@/types/idea.types"
import { createIdeaZodSchema, updateIdeaZodSchema } from "@/zod/idea.validator"

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
    const dataObj = Object.fromEntries(payload.entries());
    // Files are tricky in Object.fromEntries with multiple files
    // For simplicity, let's just use the services directly if the frontend ensures validation
    
    try {
        return await createIdea(payload)
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
        return await updateIdea(id, payload)
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
        return await deleteIdea(id, permanent)
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