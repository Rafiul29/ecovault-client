// Client-side follow service — no "use server"
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");

export const toggleFollow = async (followingId: string) => {
    const res = await fetch(`${API_BASE}/follows`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followingId }),
    });
    return res.json(); // { success, message, data: { action: "followed" | "unfollowed" } }
};

export const getUserFollowers = async (userId: string) => {
    const res = await fetch(`${API_BASE}/follows/followers/${userId}`, {
        credentials: "include",
    });
    return res.json();
};

export const getUserFollowing = async (userId: string) => {
    const res = await fetch(`${API_BASE}/follows/following/${userId}`, {
        credentials: "include",
    });
    return res.json();
};
