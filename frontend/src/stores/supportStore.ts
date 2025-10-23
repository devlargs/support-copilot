import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { SupportResponse, PaginationParams } from "../types/support";
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table";

interface SupportState {
    // UI State
    selectedResponse: SupportResponse | null;
    isCreating: boolean;
    isEditing: boolean;
    isViewing: boolean;
    searchQuery: string;
    currentPage: number;
    pageSize: number;
    isModalOpen: boolean;
    deleteConfirm: string | null;
    sorting: SortingState;
    columnFilters: ColumnFiltersState;

    // Actions
    setSelectedResponse: (response: SupportResponse | null) => void;
    setIsCreating: (isCreating: boolean) => void;
    setIsEditing: (isEditing: boolean) => void;
    setIsViewing: (isViewing: boolean) => void;
    setSearchQuery: (query: string) => void;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setIsModalOpen: (isOpen: boolean) => void;
    openCreateModal: () => void;
    openEditModal: (response: SupportResponse) => void;
    openViewModal: (response: SupportResponse) => void;
    closeModal: () => void;
    setDeleteConfirm: (id: string | null) => void;
    setSorting: (sorting: SortingState | ((old: SortingState) => SortingState)) => void;
    setColumnFilters: (filters: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)) => void;

    // Computed values
    getPaginationParams: () => PaginationParams;
    resetForm: () => void;
}

export const useSupportStore = create<SupportState>()(
    devtools(
        (set, get) => ({
            // Initial state
            selectedResponse: null,
            isCreating: false,
            isEditing: false,
            isViewing: false,
            searchQuery: "",
            currentPage: 1,
            pageSize: 10,
            isModalOpen: false,
            deleteConfirm: null,
            sorting: [],
            columnFilters: [],

            // Actions
            setSelectedResponse: (response) => set({ selectedResponse: response }),

            setIsCreating: (isCreating) =>
                set({
                    isCreating,
                    isEditing: false,
                    isViewing: false,
                    selectedResponse: null,
                }),

            setIsEditing: (isEditing) =>
                set({
                    isEditing,
                    isCreating: false,
                    isViewing: false,
                }),

            setIsViewing: (isViewing) =>
                set({
                    isViewing,
                    isCreating: false,
                    isEditing: false,
                }),

            setSearchQuery: (searchQuery) =>
                set({
                    searchQuery,
                    currentPage: 1, // Reset to first page when searching
                }),

            setCurrentPage: (currentPage) => set({ currentPage }),

            setPageSize: (pageSize) =>
                set({
                    pageSize,
                    currentPage: 1, // Reset to first page when changing page size
                }),

            setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),

            openCreateModal: () =>
                set({
                    isModalOpen: true,
                    isCreating: true,
                    isEditing: false,
                    isViewing: false,
                    selectedResponse: null,
                }),

            openEditModal: (response) =>
                set({
                    isModalOpen: true,
                    isCreating: false,
                    isEditing: true,
                    isViewing: false,
                    selectedResponse: response,
                }),

            openViewModal: (response) =>
                set({
                    isModalOpen: true,
                    isCreating: false,
                    isEditing: false,
                    isViewing: true,
                    selectedResponse: response,
                }),

            closeModal: () =>
                set({
                    isModalOpen: false,
                    isCreating: false,
                    isEditing: false,
                    isViewing: false,
                    selectedResponse: null,
                }),

            setDeleteConfirm: (id) => set({ deleteConfirm: id }),

            setSorting: (sorting) =>
                set((state) => ({
                    sorting: typeof sorting === "function" ? sorting(state.sorting) : sorting,
                })),

            setColumnFilters: (filters) =>
                set((state) => ({
                    columnFilters:
                        typeof filters === "function" ? filters(state.columnFilters) : filters,
                })),

            // Computed values
            getPaginationParams: () => {
                const state = get();
                return {
                    page: state.currentPage,
                    limit: state.pageSize,
                    query: state.searchQuery || undefined,
                };
            },

            resetForm: () =>
                set({
                    selectedResponse: null,
                    isCreating: false,
                    isEditing: false,
                    isViewing: false,
                    isModalOpen: false,
                }),
        }),
        {
            name: "support-store",
        }
    )
);
