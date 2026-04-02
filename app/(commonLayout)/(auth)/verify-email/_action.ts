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
        // আপনার API response structure অনুযায়ী data নিন
        const response = await httpClient.post("/auth/verify-email", parsedPayload.data);

        // যদি API সরাসরি response.data তে success পাঠায়
        const resData = response || {};

        if (resData.success) {
            return {
                success: true,
                message: resData.message || "Email verified successfully",
            }
        }

        return {
            success: false,
            message: resData.message || "Verification failed",
        }

    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to verify email",
        }
    }
}