"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IVerifyEmailPayload, verifyEmailZodSchema } from "@/zod/auth.validation";

export const verifyEmailAction = async (payload: IVerifyEmailPayload): Promise<any | ApiErrorResponse> => {
    const parsedPayload = verifyEmailZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        return {
            success: false,
            message: parsedPayload.error.issues[0].message || "Invalid input",
        }
    }

    try {
        const response = await httpClient.post("/auth/verify-email", parsedPayload.data);
        return {
            success: true,
            message: response.message || "Email verified successfully",
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to verify email",
        }
    }
}
