export interface SupportResponse {
    id: string;
    subject: string;
    question: string;
    answer: string;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateSupportRequest {
    subject: string;
    question: string;
    answer: string;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    query?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface GenerateAnswerRequest {
    question: string;
}

export interface GenerateAnswerResponse {
    answer: string;
}

export interface AnalyzeQuestionRequest {
    query: string;
}

export interface SimilarityMatch {
    response: SupportResponse;
    similarity: number;
    similarityPercentage: string;
}

export interface AnalyzeQuestionResponse {
    query: string;
    matches: SimilarityMatch[];
    hasGoodMatch: boolean;
    bestMatch: SimilarityMatch | null;
    message: string;
}