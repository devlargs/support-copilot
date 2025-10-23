import axios from "axios";
import {
    SupportResponse,
    CreateSupportRequest,
    PaginationParams,
    PaginatedResponse,
    GenerateAnswerRequest,
    GenerateAnswerResponse,
} from "../types/support";

// Create axios instance with base configuration
const api = axios.create({
    baseURL: "http://localhost:3000", // Adjust this to match your backend URL
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const supportApi = {
    // Get all support responses with pagination and search
    getSupportResponses: async (params: PaginationParams = {}): Promise<PaginatedResponse<SupportResponse>> => {
        const response = await api.get("/support", { params });
        return response.data;
    },

    // Create a new support response
    createSupportResponse: async (data: CreateSupportRequest): Promise<SupportResponse> => {
        const response = await api.post("/support", data);
        return response.data;
    },

    // Get a specific support response by ID
    getSupportResponse: async (id: string): Promise<SupportResponse> => {
        const response = await api.get(`/support/${id}`);
        return response.data;
    },

    // Update a support response
    updateSupportResponse: async (id: string, data: Partial<CreateSupportRequest>): Promise<SupportResponse> => {
        const response = await api.patch(`/support/${id}`, data);
        return response.data;
    },

    // Delete a support response
    deleteSupportResponse: async (id: string): Promise<void> => {
        await api.delete(`/support/${id}`);
    },

    // Generate AI-powered answer
    generateAnswer: async (data: GenerateAnswerRequest): Promise<GenerateAnswerResponse> => {
        const response = await api.get("/support/generateAnswers", {
            params: { question: data.question },
        });
        return response.data;
    },
};

export default api;