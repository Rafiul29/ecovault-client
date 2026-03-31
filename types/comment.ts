export interface IComment {
    id: string;
    content: string;
    authorId: string;
    ideaId: string;
    parentId: string | null;
    isDeleted: boolean;
    isFlagged: boolean;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        name: string;
        image: string | null;
    };
    idea?: {
        id: string;
        title: string;
        slug: string;
    };
    replies?: IComment[];
    reactions: {
        userId: string;
        commentId: string;
        type: string;
        createdAt: string;
    }[];
    _count?: {
        reactions: number;
        replies: number;
    };
}
