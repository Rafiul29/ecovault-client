"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { IResetPasswordPayload, resetPasswordZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const resetPasswordAction = async (payload: IResetPasswordPayload): Promise<any | ApiErrorResponse> => {
    const parsedPayload = resetPasswordZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        return {
            success: false,
            message: parsedPayload.error.issues[0].message || "Invalid input",
        }
    }

    try {
        const response = await httpClient.post("/auth/reset-password", parsedPayload.data);
        // If the backend returns tokens upon reset, we can set them. 
        // Based on the user's snippet, reset-password doesn't return tokens, but change-password does.
        return {
            success: true,
            message: response.message || "Password reset successfully",
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Failed to reset password",
        }
    }
}
