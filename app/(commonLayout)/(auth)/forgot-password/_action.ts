"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IForgotPasswordPayload, forgotPasswordZodSchema } from "@/zod/auth.validation";

export const forgotPasswordAction = async (payload: IForgotPasswordPayload): Promise<any | ApiErrorResponse> => {
    const parsedPayload = forgotPasswordZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        return {
            success: false,
            message: parsedPayload.error.issues[0].message || "Invalid input",
        }
    }

    try {
        const response = await httpClient.post("/auth/forget-password", parsedPayload.data);
        console.log(response)
        return {
            success: true,
            message: response.message || "OTP sent to your email",
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to process request",
        }
    }
}
