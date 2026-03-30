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
    isPaid: boolean;
    price: number;
    isFeatured: boolean;
    viewCount: number;
    categories?: { category: ICategory }[];
    tags?: { tag: ITag }[];
    author?: {
        id: string;
        name: string;
        email: string;
        image?: string;
    };
    _count?: {
        comments: number;
        votes: number;
        purchases: number;
        watchlists: number;
    };
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
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
}
