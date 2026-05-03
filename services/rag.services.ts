import { httpClient } from "@/lib/axios/httpClient";

// ─── Request Types ────────────────────────────────────────────────────────────

export interface IRagQueryPayload {
    query: string;
    limit?: number;
    sourceType?: string;
}

// ─── Response Data Types ──────────────────────────────────────────────────────

export interface IRagSource {
    id: string;
    content: string;
    similarity: number;
    metadata?: {
        name?: string;
        [key: string]: unknown;
    };
    sourceType?: string;
}

export interface IRagQueryData {
    answer: any;
    sources: IRagSource[];
    contextUsed: string;
}

export interface IIngestIdeasData {
    success: boolean;
    message: string;
    indexedCount: number;
}

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * POST /rag/query
 * Sends a natural language query and returns an AI-generated answer.
 */
export const queryRagService = async (payload: IRagQueryPayload) => {
    const response = await httpClient.post<IRagQueryData>("/rag/query", payload);
    return response;
};

/**
 * POST /rag/ingest-ideas
 * Triggers ingestion (indexing) of all ideas into the vector store.
 */
export const ingestIdeasService = async () => {
    const response = await httpClient.post<IIngestIdeasData>("/rag/ingest-ideas", {});
    return response;
};



export const ingestAttachmentsService = async () => {
    const response = await httpClient.post<IIngestIdeasData>("/rag/ingest-attachments", {});
    return response;
};

