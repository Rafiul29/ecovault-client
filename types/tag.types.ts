export interface ITag {
    id: string;
    name: string;
    slug: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateTagPayload {
    name: string;
    slug?: string;
}

export interface IUpdateTagPayload {
    name?: string;
    slug?: string;
}
