import { IdeaStatus } from "./enums";
import { ICategory } from "./category";
import { ITag } from "./tag.types";

export interface IIdea {
    id: string;
    title: string;
    slug: string;
    description: string;
    problemStatement: string;
    proposedSolution: string;
    images: string[];
    authorId: string;
    status: IdeaStatus;
    adminFeedback: string | null;
    reviewedBy: string | null;
    reviewedAt: string | null;
    isPaid: boolean;
    price: number;
    isFeatured: boolean;
    featuredAt: string | null;
    viewCount: number;
    upvoteCount: number;
    downvoteCount: number;
    trendingScore: number;
    publishedAt: string | null;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    
    categories?: { 
        ideaId: string;
        categoryId: string;
        assignedAt: string;
        category: ICategory 
    }[];
    tags?: { 
        ideaId: string;
        tagId: string;
        assignedAt: string;
        tag: ITag 
    }[];
    author?: {
        id: string;
        name: string;
        email: string;
        image: string | null;
        _count?: {
            followers: number;
            following: number;
        }
    };
    comments?: any[]; // For simple rendering
    votes?: any[]; // For check user vote
    watchlists?: {
        id: string;
        userId: string;
        ideaId: string;
        isDeleted: boolean;
        deletedAt: string | null;
        createdAt: string;
    }[];
    attachments?: {
        id: string;
        type: string;
        url: string;
        title: string;
        ideaId: string;
        createdAt: string;
    }[];
    
    _count?: {
        comments: number;
        votes: number;
        purchases: number;
        watchlists: number;
    };
}

export interface ICreateIdeaPayload {
    title: string;
    slug?: string;
    description: string;
    problemStatement: string;
    proposedSolution: string;
    images?: string[];
    categories?: string[];
    tags?: string[];
    status?: string;
    isPaid?: boolean;
    price?: number;
    isFeatured?: boolean;
}

export interface IUpdateIdeaPayload {
    title?: string;
    slug?: string;
    description?: string;
    problemStatement?: string;
    proposedSolution?: string;
    images?: string[];
    categories?: string[];
    tags?: string[];
    status?: string;
    isPaid?: boolean;
    price?: number;
    isFeatured?: boolean;
    adminFeedback?: string;
}
