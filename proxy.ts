import { NextRequest, NextResponse } from "next/server";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "./lib/authUtils";
import { jwtUtils } from "./lib/jwtUtils";
import { isTokenExpiringSoon } from "./lib/tokenUtils";
import { API_BASE_URL as BASE_API_URL } from "./lib/env";

async function fetchUserInfo(accessToken: string, sessionToken: string) {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
            }
        });

        if (!res.ok) {
            return null;
        }

        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching user info in proxy:", error);
        return null;
    }
}

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
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

        return true;
    } catch (error) {
        console.error("Error refreshing token in middleware:", error);
        return false;
    }
}


export async function proxy(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl; // eg /dashboard, /admin/dashboard, /doctor/dashboard
        const accessToken = request.cookies.get("accessToken")?.value;
        const refreshToken = request.cookies.get("refreshToken")?.value;

        const host = request.headers.get("host");

        const decodedAccessToken = accessToken && jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).data;

        const verifyResult = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;
        const isValidAccessToken = verifyResult?.success || false;

        if (accessToken && !isValidAccessToken) {
            console.warn("Invalid access token in middleware:", verifyResult?.error);
        }

        let userRole: UserRole | null = null;

        if (accessToken) {
            const sessionToken = request.cookies.get("better-auth.session_token")?.value || "";
            const userInfo = await fetchUserInfo(accessToken, sessionToken);
            if (userInfo) {
                userRole = userInfo.role as UserRole;
            }
        } else if (decodedAccessToken) {
            userRole = decodedAccessToken.role as UserRole;
        }

        console.log("User role in proxy:", userRole);


        const routerOwner = getRouteOwner(pathname);

        const unifySuperAdminAndAdminRole = userRole === "SUPER_ADMIN" ? "ADMIN" : userRole;

        userRole = unifySuperAdminAndAdminRole;

        const isAuth = isAuthRoute(pathname);


        //proactively refresh token if refresh token exists and access token is expired or about to expire
        if (isValidAccessToken && refreshToken && (await isTokenExpiringSoon(accessToken as string))) {
            const requestHeaders = new Headers(request.headers);

            const response = NextResponse.next({
                request: {
                    headers: requestHeaders

                },
            })


            try {
                const refreshed = await refreshTokenMiddleware(refreshToken);

                if (refreshed) {
                    requestHeaders.set("x-token-refreshed", "1");
                }

                return NextResponse.next(
                    {
                        request: {
                            headers: requestHeaders
                        },
                        headers: response.headers
                    }
                )
            } catch (error) {
                console.error("Error refreshing token:", error);

            }

            return response;
        }

        // Force token refresh after successful payment if the user is currently a MEMBER
        // so that they immediately receive their updated plan/role permissions.
        if (pathname === "/payment/success" && userRole === "MEMBER" && refreshToken) {
            const requestHeaders = new Headers(request.headers);
            const response = NextResponse.next({
                request: {
                    headers: requestHeaders
                },
            });

            try {
                const refreshed = await refreshTokenMiddleware(refreshToken);
                if (refreshed) {
                    requestHeaders.set("x-token-refreshed", "1");
                }
                return NextResponse.next({
                    request: { headers: requestHeaders },
                    headers: response.headers
                });
            } catch (error) {
                console.error("Error refreshing token on payment success:", error);
            }
        }


        // Rule - 1 : User is logged in (has access token) and trying to access auth route -> redirect to dashboard
        if (isAuth && isValidAccessToken) {
            // Exempt /reset-password and /verify-email to avoid redirect loops
            // when userInfo flags (needPasswordChange, emailVerified) are active.
            if (pathname !== "/reset-password" && pathname !== "/verify-email") {
                return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
            }
        }

        // Rule - 2 : User is trying to access reset password page
        if (pathname === "/reset-password") {

            const email = request.nextUrl.searchParams.get("email");

            // case - 1 user has needPasswordChange true
            //no need for case 1 if need password change is handled from change-password page
            if (accessToken && email) {
                const sessionToken = request.cookies.get("better-auth.session_token")?.value || "";
                const userInfo = await fetchUserInfo(accessToken, sessionToken);

                if (userInfo?.needPasswordChange) {
                    return NextResponse.next();
                } else {
                    return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
                }
            }

            // Case-2 user coming from forgot password

            if (email) {
                return NextResponse.next();
            }

            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Rule-3 User trying to access Public route -> allow
        if (routerOwner === null) {
            return NextResponse.next();
        }

        // Rule - 4 User is Not logged in but trying to access protected route -> redirect to login
        if (!accessToken || !isValidAccessToken) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }

        //Rule - Enforcing user to stay in reset password or verify email page if their needPasswordChange or isEmailVerified flags are not satisfied respectively

        if (accessToken) {
            const sessionToken = request.cookies.get("better-auth.session_token")?.value || "";
            const userInfo = await fetchUserInfo(accessToken, sessionToken);
            // ১. আগে চেক করুন ইউজার কি অলরেডি সঠিক গন্তব্যে আছে? 
            // এটি লুপ ব্রেক করার সবচেয়ে নিরাপদ উপায়।
            const isAtVerifyPage = pathname === "/verify-email";
            const isAtResetPage = pathname === "/reset-password";

            if (userInfo) {
                // সিনারিও: ইমেইল ভেরিফাই করা নেই
                if (userInfo.emailVerified === false) {
                    if (!isAtVerifyPage) {
                        const url = new URL("/verify-email", request.url);
                        url.searchParams.set("email", userInfo.email);
                        return NextResponse.redirect(url);
                    }
                    return NextResponse.next(); // অলরেডি ভেরিফাই পেজে থাকলে স্টপ
                }

                // সিনারিও: পাসওয়ার্ড চেঞ্জ করতে হবে
                if (userInfo.needPasswordChange === true) {
                    if (!isAtResetPage) {
                        const url = new URL("/reset-password", request.url);
                        url.searchParams.set("email", userInfo.email);
                        return NextResponse.redirect(url);
                    }
                    return NextResponse.next(); // অলরেডি রিসেট পেজে থাকলে স্টপ
                }

                // সিনারিও: সব ঠিক আছে কিন্তু ইউজার ভুল করে ভেরিফাই বা রিসেট পেজে ঢোকার চেষ্টা করছে
                if ((isAtVerifyPage || isAtResetPage)) {
                    const dashboardUrl = new URL(getDefaultDashboardRoute(userRole as UserRole), request.url);
                    return NextResponse.redirect(dashboardUrl);
                }
            }
        }

        // Rule - 5 User trying to access Common protected route -> allow
        if (routerOwner === "COMMON") {
            return NextResponse.next();
        }

        //Rule-6 User trying to visit role based protected but doesn't have required role -> redirect to their default dashboard

        if (routerOwner === "ADMIN" || routerOwner === "MODERATOR" || routerOwner === "MEMBER") {
            if (routerOwner !== userRole) {
                return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
            }
        }

        return NextResponse.next();

    } catch (error) {
        console.error("Error in proxy middleware:", error);
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ]
}