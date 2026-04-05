"use server";

import { setTokenInCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";
import { API_BASE_URL as BASE_API_URL } from "@/lib/env";
import { httpClient } from "@/lib/axios/httpClient";

export async function getNewTokensWithRefreshToken(refreshToken: string): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken}`,

            }
        });

        if (!res.ok) {
            return false;
        }

        const { data } = await res.json();

        const { accessToken, refreshToken: newRefreshToken, token } = data;

        if (accessToken) {
            await setTokenInCookies("accessToken", accessToken);
        }

        if (newRefreshToken) {
            await setTokenInCookies("refreshToken", newRefreshToken);
        }

        if (token) {
            await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds
        }

        return true;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
    }
}

export async function getUserInfo() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value

    if (!accessToken) {
        return null;
    }

    try {
        const res = await fetch(`${BASE_API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
                'Cache-Control': 'no-store',
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch user info:", res.status, res.statusText);
            return null;
        }

        const { data } = await res.json();

        return data;

    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}

export async function verifyEmail(payload: { email: string; otp: string }) {
    try {
        // const res = await fetch(`${BASE_API_URL}/auth/verify-email`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(payload),
        // });

        // const result = await res.json();
        return;
    } catch (error: any) {
        console.error("Error verifying email:", error);
        return { success: false, message: error.message };
    }
}

export async function forgetPassword(email: string) {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/forget-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const result = await res.json();
        return result;
    } catch (error: any) {
        console.error("Error in forget password:", error);
        return { success: false, message: error.message };
    }
}

export async function resetPassword(payload: any) {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        return result;
    } catch (error: any) {
        console.error("Error resetting password:", error);
        return { success: false, message: error.message };
    }
}

export async function changePassword(payload: any, providedToken?: string) {
    const cookieStore = await cookies();
    const sessionToken = providedToken || cookieStore.get("better-auth.session_token")?.value;

    try {
        const res = await fetch(`${BASE_API_URL}/auth/change-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `better-auth.session_token=${sessionToken}`,
            },
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        return result;
    } catch (error: any) {
        console.error("Error in change password:", error);
        return { success: false, message: error.message };
    }
}


export async function logoutUser() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    try {
        await fetch(`${BASE_API_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
            }
        });
    } catch (error) {
        console.error("Error logging out from server:", error);
    } finally {
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
        cookieStore.delete("better-auth.session_token");
    }
}

export async function updateProfile(payload: any) {
    return httpClient.patch("/auth/update-profile", payload);
}