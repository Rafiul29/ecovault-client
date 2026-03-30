"use server"

import { createCategory, deleteCategory, getCategoryById, updateCategory } from "@/services/category.service."
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.types"
import { type ICategory } from "@/types/category"

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

export const createCategoryAction = async (
    payload: FormData,
): Promise<ApiResponse<ICategory> | ApiErrorResponse> => {
    try {
        return await createCategory(payload)
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to create category"),
        }
    }
}

export const updateCategoryAction = async (
    id: string,
    payload: FormData | any,
): Promise<ApiResponse<ICategory> | ApiErrorResponse> => {
    try {
        return await updateCategory(id, payload)
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to update category"),
        }
    }
}

export const deleteCategoryAction = async (
    id: string,
    permanent: boolean = false
): Promise<ApiResponse<{ message: string }> | ApiErrorResponse> => {
    if (!id) {
        return {
            success: false,
            message: "Invalid category id",
        }
    }

    try {
        return await deleteCategory(id, permanent)
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to delete category"),
        }
    }
}

export const getCategoryByIdAction = async (
    id: string,
): Promise<ApiResponse<ICategory> | ApiErrorResponse> => {
    if (!id) {
        return {
            success: false,
            message: "Invalid category id",
        }
    }

    try {
        return await getCategoryById(id)
    } catch (error: unknown) {
        return {
            success: false,
            message: getActionErrorMessage(error, "Failed to fetch category details"),
        }
    }
}
