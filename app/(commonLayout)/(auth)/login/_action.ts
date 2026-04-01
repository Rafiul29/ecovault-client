"use server";

import { getDefaultDashboardRoute, isValidRedirectForRole } from "@/lib/authUtils";
// import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { UserRole } from "@/types/types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const loginAction = async (payload: ILoginPayload, redirectPath?: string): Promise<ILoginResponse | ApiErrorResponse> => {

    const parsedPayload = loginZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        }
    }

    let targetRedirectPath: string | null = null;

    try {
        const response = await httpClient.post<ILoginResponse>("/auth/login", parsedPayload.data);
        const { accessToken, refreshToken, token, user } = response.data;
        const { role, emailVerified, needPasswordChange, email } = user;
        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds

        if (!emailVerified) {
            targetRedirectPath = "/verify-email";
        } else if (needPasswordChange) {
            //TODO : refactoring
            targetRedirectPath = `/reset-password?email=${email}`;
        } else {
            targetRedirectPath = redirectPath && isValidRedirectForRole(redirectPath, role as UserRole) ? redirectPath : getDefaultDashboardRoute(role as UserRole);
        }

    } catch (error: any) {
        if (error && error.response && error.response.data?.message === "Email not verified") {
            targetRedirectPath = `/verify-email?email=${payload.email}`;
        } else {
            console.log("error", error);
            return {
                success: false,
                message: `Login failed: ${error.response?.data?.message || error.message}`,
            };
        }
    }

    if (targetRedirectPath) {
        redirect(targetRedirectPath);
    }

    throw new Error("Unexpected login state");
}