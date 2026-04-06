// ── Enums ──────────────────────────────────────────────────────────────────
export type IdeaStatus =
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "PUBLISHED";
export type SubscriptionTier = "FREE" | "PRO" | "PREMIUM";
export type UserRole = "MEMBER" | "MODERATOR" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type ReactionType = "LIKE" | "DISLIKE" | "HEART" | "CELEBRATE";

// ── Models ─────────────────────────────────────────────────────────────────
export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: UserRole;
    status: UserStatus;
    subscription?: {
        tier: SubscriptionTier;
        isActive: boolean;
        endDate?: string;
    };
    followersCount: number;
    followingCount: number;
    ideasCount: number;
    bio?: string;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    color?: string;
    icon?: string;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
}

export interface Idea {
    id: string;
    title: string;
    slug: string;
    description: string;
    problemStatement: string;
    proposedSolution: string;
    images: string[];
    status: IdeaStatus;
    isPaid: boolean;
    price?: number;
    isFeatured: boolean;
    viewCount: number;
    upvoteCount: number;
    downvoteCount: number;
    trendingScore: number;
    author: Pick<User, "id" | "name" | "image">;
    categories: { category: Category }[];
    tags: { tag: Tag }[];
    adminFeedback?: string;
    createdAt: string;
    publishedAt?: string;
    _count?: {
        watchlistCount: number;
    };
}

export interface Comment {
    id: string;
    content: string;
    author: Pick<User, "id" | "name" | "image">;
    createdAt: string;
    replies?: Comment[];
    isDeleted: boolean;
    isFlagged: boolean;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon?: string;
    earnedAt?: string;
    isLocked?: boolean;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    tier: SubscriptionTier;
    price: number;
    description?: string;
    durationDays: number;
    features: string[];
    isPopular?: boolean;
}
