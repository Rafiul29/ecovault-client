import { z } from "zod";

export const loginZodSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

export const registerZodSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
})


export const verifyEmailZodSchema = z.object({
    email: z.string().email("Invalid email"),
    otp: z.string().length(6, "OTP must be 6 characters long"),
})

export const forgotPasswordZodSchema = z.object({
    email: z.string().email("Invalid email"),
})

export const resetPasswordZodSchema = z.object({
    email: z.string().email("Invalid email"),
    otp: z.string().length(6, "OTP must be 6 characters long"),
    newPassword: z.string().min(6, "Password must be at least 6 characters long"),
})

export const changePasswordZodSchema = z.object({
    oldPassword: z.string().min(6, "Old password must be at least 6 characters long"),
    newPassword: z.string().min(6, "New password must be at least 6 characters long"),
})


export type ILoginPayload = z.infer<typeof loginZodSchema>
export type IRegisterPayload = z.infer<typeof registerZodSchema>
export type IVerifyEmailPayload = z.infer<typeof verifyEmailZodSchema>
export type IForgotPasswordPayload = z.infer<typeof forgotPasswordZodSchema>
export type IResetPasswordPayload = z.infer<typeof resetPasswordZodSchema>
export type IChangePasswordPayload = z.infer<typeof changePasswordZodSchema>

