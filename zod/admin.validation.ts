import { z } from "zod";

export const createAdminZodSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    profilePhoto: z.any().optional(),
    contactNumber: z
        .string()
        .min(11, "Contact number must be at least 11 characters")
        .max(14, "Contact number must be at most 14 characters")
        .optional(),
});
