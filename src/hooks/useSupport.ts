import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supportApi } from "../services/api";
import {

    CreateSupportRequest,
    PaginationParams,
    GenerateAnswerRequest,
} from "../types/support";

// Query keys for consistent caching
export const supportKeys = {
    all: ["support"] as const,
    lists: () => [...supportKeys.all, "list"] as const,
    list: (params: PaginationParams) => [...supportKeys.lists(), params] as const,
    details: () => [...supportKeys.all, "detail"] as const,
    detail: (id: string) => [...supportKeys.details(), id] as const,
};

// Hook for fetching support responses with pagination and search
export const useSupportResponses = (params: PaginationParams = {}) => {
    return useQuery({
        queryKey: supportKeys.list(params),
        queryFn: () => supportApi.getSupportResponses(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

// Hook for fetching a single support response
export const useSupportResponse = (id: string) => {
    return useQuery({
        queryKey: supportKeys.detail(id),
        queryFn: () => supportApi.getSupportResponse(id),
        enabled: !!id,
    });
};

// Hook for creating a new support response
export const useCreateSupportResponse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSupportRequest) => supportApi.createSupportResponse(data),
        onSuccess: () => {
            // Invalidate and refetch support lists
            queryClient.invalidateQueries({ queryKey: supportKeys.lists() });
        },
        onError: (error) => {
            console.error("Failed to create support response:", error);
        },
    });
};

// Hook for updating a support response
export const useUpdateSupportResponse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateSupportRequest> }) =>
            supportApi.updateSupportResponse(id, data),
        onSuccess: (updatedResponse) => {
            // Update the specific item in cache
            queryClient.setQueryData(supportKeys.detail(updatedResponse.id), updatedResponse);
            // Invalidate lists to ensure consistency
            queryClient.invalidateQueries({ queryKey: supportKeys.lists() });
        },
        onError: (error) => {
            console.error("Failed to update support response:", error);
        },
    });
};

// Hook for deleting a support response
export const useDeleteSupportResponse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => supportApi.deleteSupportResponse(id),
        onSuccess: (_, deletedId) => {
            // Remove the item from cache
            queryClient.removeQueries({ queryKey: supportKeys.detail(deletedId) });
            // Invalidate lists to ensure consistency
            queryClient.invalidateQueries({ queryKey: supportKeys.lists() });
        },
        onError: (error) => {
            console.error("Failed to delete support response:", error);
        },
    });
};

// Hook for generating AI answers
export const useGenerateAnswer = () => {
    return useMutation({
        mutationFn: (data: GenerateAnswerRequest) => supportApi.generateAnswer(data),
        onError: (error) => {
            console.error("Failed to generate answer:", error);
        },
    });
};
