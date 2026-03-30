export interface ICategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateCategoryPayload {
    name: string;
    slug?: string;
    description?: string;
    icon?: string;
    color?: string;
    isActive?: boolean;
}

export interface IUpdateCategoryPayload {
    name?: string;
    slug?: string;
    description?: string;
    icon?: string;
    color?: string;
    isActive?: boolean;
}
