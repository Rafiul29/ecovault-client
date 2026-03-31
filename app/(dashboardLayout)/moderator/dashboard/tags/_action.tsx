"use server"

import { createTag, deleteTag, getTagById, updateTag } from "@/services/tag.service"
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.types"
import { type ITag, ICreateTagPayload, IUpdateTagPayload } from "@/types/tag.types"

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

export const createTagAction = async (
    payload: ICreateTagPayload | any,
): Promise<ApiResponse<ITag> | ApiErrorResponse> => {
    try {
        return await createTag(payload)
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to create tag"),
        }
    }
}

export const updateTagAction = async (
    id: string,
    payload: IUpdateTagPayload | any,
): Promise<ApiResponse<ITag> | ApiErrorResponse> => {
    try {
        return await updateTag(id, payload)
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to update tag"),
        }
    }
}

export const deleteTagAction = async (
    id: string,
    permanent: boolean = false
): Promise<ApiResponse<{ message: string }> | ApiErrorResponse> => {
    if (!id) {
        return {
            success: false,
            message: "Invalid tag id",
        }
    }

    try {
        return await deleteTag(id, permanent)
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to delete tag"),
        }
    }
}

export const getTagByIdAction = async (
    id: string,
): Promise<ApiResponse<ITag> | ApiErrorResponse> => {
    if (!id) {
        return {
            success: false,
            message: "Invalid tag id",
        }
    }

    try {
        return await getTagById(id)
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to fetch tag details"),
        }
    }
}
