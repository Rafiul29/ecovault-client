"use server";

import { deleteComment, updateComment } from "@/services/comment.service";
import { revalidatePath } from "next/cache";

export const deleteCommentAction = async (id: string) => {
    try {
        const response = await deleteComment(id);
        
        if (response.success) {
            revalidatePath("/admin/dashboard/comment-management");
        }
        
        return response;
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to delete comment",
        };
    }
}

export const updateCommentAction = async (id: string, content: string) => {
    try {
        const response = await updateComment(id, content);
        
        if (response.success) {
            revalidatePath("/admin/dashboard/comment-management");
        }
        
        return response;
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to update comment",
        };
    }
}
