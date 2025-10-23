import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo, useState, useEffect } from "react";
import { SupportResponse } from "../types/support";
import { useSupportStore } from "../stores/supportStore";
import { useDeleteSupportResponse } from "../hooks/useSupport";
import Toast from "./Toast";
import {
  EditIcon,
  DeleteIcon,
  SearchIcon,
  DocumentIcon,
  AlertTriangleIcon,
} from "./icons";

interface SupportTableProps {
  data: SupportResponse[];
  isLoading?: boolean;
}

export default function SupportTable({ data, isLoading }: SupportTableProps) {
  const setSearchQuery = useSupportStore((state) => state.setSearchQuery);
  const openEditModal = useSupportStore((state) => state.openEditModal);
  const openViewModal = useSupportStore((state) => state.openViewModal);
  const deleteConfirm = useSupportStore((state) => state.deleteConfirm);
  const setDeleteConfirm = useSupportStore((state) => state.setDeleteConfirm);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const deleteMutation = useDeleteSupportResponse();

  // Local search input state for debouncing
  const globalFilter = useSupportStore((state) => state.searchQuery);
  const [searchInput, setSearchInput] = useState(globalFilter ?? "");

  // Debounce search input (500ms delay)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, setSearchQuery]);

  const columns = useMemo<ColumnDef<SupportResponse>[]>(
    () => [
      {
        accessorKey: "subject",
        header: "Subject",
        cell: (info) => (
          <div className="font-semibold text-gray-900 dark:text-white">
            {info.getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: "question",
        header: "Question",
        size: 400,
        cell: (info) => (
          <div
            className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-md"
            dangerouslySetInnerHTML={{ __html: info.getValue() as string }}
          />
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: (info) => (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(info.getValue() as string).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const item = info.row.original;
          return (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => openEditModal(item)}
                className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                title="Edit"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => setDeleteConfirm(item.id)}
                disabled={deleteMutation.isPending}
                className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete"
              >
                <DeleteIcon />
              </button>
            </div>
          );
        },
      },
    ],
    [openEditModal, setDeleteConfirm, deleteMutation.isPending]
  );

  const sorting = useSupportStore((state) => state.sorting);
  const setSorting = useSupportStore((state) => state.setSorting);
  const columnFilters = useSupportStore((state) => state.columnFilters);
  const setColumnFilters = useSupportStore((state) => state.setColumnFilters);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setSearchQuery,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteMutation.mutateAsync(deleteConfirm);
      setDeleteConfirm(null);
      setToast({
        message: "Support response deleted successfully",
        type: "success",
        isVisible: true,
      });
    } catch (error) {
      console.error("Delete failed:", error);
      setToast({
        message: "Failed to delete support response. Please try again.",
        type: "error",
        isVisible: true,
      });
      // Keep the dialog open on error so user can retry
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse"
            >
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Support Responses
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {table.getFilteredRowModel().rows.length} responses • Page{" "}
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount() || 1}
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search responses..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-64 lg:w-80 pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : typeof header.column.columnDef.header === "function"
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => openViewModal(row.original)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-6 py-4 ${
                        cell.column.id === "question" ? "" : "whitespace-nowrap"
                      }`}
                      onClick={(e) => {
                        // Prevent row click when clicking on actions column
                        if (cell.column.id === "actions") {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {typeof cell.column.columnDef.cell === "function"
                        ? cell.column.columnDef.cell(cell.getContext())
                        : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {table.getRowModel().rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mb-6">
              <DocumentIcon className="w-10 h-10 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No support responses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {globalFilter
                ? "Try adjusting your search terms"
                : "Create your first support response to get started"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {table.getPageCount() > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                ‹
              </button>
              {Array.from({ length: table.getPageCount() }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  className={
                    (table.getState().pagination.pageIndex === i
                      ? "bg-purple-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600") +
                    " rounded-lg text-sm w-8 h-8 flex items-center justify-center transition-colors hover:shadow-md"
                  }
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                ›
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirm(null)}
            />
            <div
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Delete Support Response
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Are you sure you want to delete this support response? This
                    action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
