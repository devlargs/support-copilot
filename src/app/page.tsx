"use client";

import SupportForm from "@/components/SupportForm";
import SupportTable from "@/components/SupportTable";
import ThemeToggle from "@/components/ThemeToggle";
import Modal from "@/components/Modal";
import { useSupportResponses } from "@/hooks/useSupport";
import { useSupportStore } from "@/stores/supportStore";
import { AlertCircleIcon, ChatBubbleIcon, PlusIcon } from "@/components/icons";

export default function SupportPage() {
  const {
    getPaginationParams,
    isModalOpen,
    openCreateModal,
    closeModal,
    isEditing,
    isViewing,
    selectedResponse,
  } = useSupportStore();

  // Fetch support responses with current pagination and search params
  const paginationParams = getPaginationParams();
  const {
    data: supportData,
    isLoading,
    error,
  } = useSupportResponses(paginationParams);

  if (error) {
    return (
      <div className="h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircleIcon className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Error Loading Support Responses
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-xl flex items-center justify-center shadow-lg">
                <ChatBubbleIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Support Copilot
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered customer support management
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={openCreateModal}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                <PlusIcon />
                <span>New Response</span>
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <SupportTable data={supportData?.data || []} isLoading={isLoading} />
      </main>

      {/* Modal for Form/View */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          isViewing
            ? "View Support Response"
            : isEditing
            ? "Edit Support Response"
            : "Create Support Response"
        }
      >
        {isViewing && selectedResponse ? (
          <div className="p-6 space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedResponse.subject}
              </div>
            </div>

            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Question
              </label>
              <div
                className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
                dangerouslySetInnerHTML={{ __html: selectedResponse.question }}
              />
            </div>

            {/* Answer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Answer
              </label>
              <div
                className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
                dangerouslySetInnerHTML={{ __html: selectedResponse.answer }}
              />
            </div>

            {/* Timestamps */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
              <div>
                Created:{" "}
                {new Date(selectedResponse.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              {selectedResponse.updatedAt && (
                <div>
                  Updated:{" "}
                  {new Date(selectedResponse.updatedAt).toLocaleString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <SupportForm onSuccess={closeModal} />
        )}
      </Modal>
    </div>
  );
}
