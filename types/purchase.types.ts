import { IIdea } from "./idea.types";

export interface IIdeaPurchaseUser {
    id: string;
    name: string;
    email: string;
    image?: string;
}

export interface IIdeaPurchase {
    id: string;
    ideaId: string;
    userId: string;
    purchasedAt: string;
    idea: IIdea;
    user: IIdeaPurchaseUser;
}
