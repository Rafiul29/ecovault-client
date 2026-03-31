"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ICreateCategoryPayload, IUpdateCategoryPayload, ICategory } from "@/types/category";

export const getCategories = async (queryString?: string) => {
    try {
        const response = await httpClient.get<ICategory[]>(queryString ? `/categories?${queryString}` : "/categories");
        return response;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}

export const getCategoryById = async (id: string) => {
    try {
        const response = await httpClient.get<ICategory>(`/categories/${id}`);
        return response;
    } catch (error) {
        console.error("Error fetching category by id:", error);
        throw error;
    }
}

export const createCategory = async (payload: FormData) => {
    try {
        const response = await httpClient.post<ICategory>("/categories", payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
}

export const updateCategory = async (id: string, payload: FormData | any) => {
    try {
        const response = await httpClient.patch<ICategory>(`/categories/${id}`, payload);
        console.log("Update response:", response.data)
        return response;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
}

export const deleteCategory = async (id: string, permanent: boolean = false) => {
    try {
        const url = permanent ? `/categories/${id}?permanent=true` : `/categories/${id}`;
        const response = await httpClient.delete<{ message: string }>(url);
        return response;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
}
