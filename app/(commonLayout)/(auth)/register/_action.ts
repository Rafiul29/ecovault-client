"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse, IRegisterResponse } from "@/types/auth.types";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const registerAction = async (payload: IRegisterPayload, redirectPath?: string): Promise<ILoginResponse | ApiErrorResponse> => {

    const parsedPayload = registerZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        }
    }

    try {
        const response = await httpClient.post<IRegisterResponse>("/auth/register", parsedPayload.data);
        const { accessToken, refreshToken, token, user } = response.data;
        const { role, emailVerified, email } = user;
        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds

        // if (needPasswordChange) {
        //TODO : refactoring
        // redirect(`/reset-password?email=${email}`);
        // } else {
        // const targetPath = redirectPath && isValidRedirectForRole(redirectPath, role as UserRole) ? redirectPath : getDefaultDashboardRoute(role as UserRole);


        // redirect(targetPath);
        // }

        redirect("/dashboard");
    } catch (error: any) {
        // console.log("error", error);
        if (error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) {
            throw error;
        }

        if (error && error.response && error.response.data.message === "Email not verified") {
            redirect(`/verify-email?email=${payload.email}`);
        }
        return {
            success: false,
            message: `Register failed: ${error.response.data.message}`,
        }

    }
}