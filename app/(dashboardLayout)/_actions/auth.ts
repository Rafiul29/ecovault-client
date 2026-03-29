"use server";

import { changePassword } from "@/services/auth.services";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";
import { IChangePasswordPayload, changePasswordZodSchema } from "@/zod/auth.validation";

export const changePasswordAction = async (payload: IChangePasswordPayload) => {
    const parsedPayload = changePasswordZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        return {
            success: false,
            message: parsedPayload.error.issues[0].message || "Invalid input",
        }
    }

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!sessionToken) {
        return {
            success: false,
            message: "Unauthorized: No session token found",
        }
    }

    try {
        const result = await changePassword(parsedPayload.data, sessionToken);
        if (result.success && result.data) {
            const { accessToken, refreshToken, token } = result.data;
            if (accessToken) await setTokenInCookies("accessToken", accessToken);
            if (refreshToken) await setTokenInCookies("refreshToken", refreshToken);
            if (token) await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);
        }
        return result;
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to change password",
        }
    }
}
