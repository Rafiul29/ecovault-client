"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse, IRegisterResponse } from "@/types/auth.types";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const registerAction = async (payload: IRegisterPayload, redirectPath?: string): Promise<ILoginResponse | ApiErrorResponse | void> => {

    const parsedPayload = registerZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        }
    }

    // রিডাইরেক্ট পাথ হোল্ড করার জন্য ভেরিয়েবল
    let redirectTo: string | null = null;

    try {
        const response = await httpClient.post<IRegisterResponse>("/auth/register", parsedPayload.data);
        const { accessToken, refreshToken, token, user } = response.data;

        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

        // Success হলে কোথায় যাবে
        redirectTo = "/dashboard";

    } catch (error: any) {
        // ১. যদি এটি Next.js এর নিজস্ব রিডাইরেক্ট এরর হয়, তবে সেটাকে সরাসরি থ্রো করতে হবে
        if (error && typeof error === "object" && "digest" in error && error.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }

        // ২. স্পেসিফিক বিজনেস লজিক এরর (যেমন: ইমেইল ভেরিফাইড না থাকলে)
        if (error.response?.data?.message === "Email not verified") {
            redirectTo = `/verify-email?email=${payload.email}`;
        } else {
            // ৩. সাধারণ এরর রিটার্ন করা
            return {
                success: false,
                message: `Register failed: ${error?.message || "Something went wrong"}`,
            };
        }
    }

    // ৪. রিডাইরেক্ট সব সময় try-catch এর বাইরে করতে হয়
    if (redirectTo) {
        redirect(redirectTo);
    }
}