import { useState, useEffect } from "react";
import TiptapEditor from "./TiptapEditor";
import {
  useCreateSupportResponse,
  useUpdateSupportResponse,
  useGenerateAnswer,
} from "../hooks/useSupport";
import { useSupportStore } from "../stores/supportStore";

interface SupportFormProps {
  onSuccess?: () => void;
}

export default function SupportForm({ onSuccess }: SupportFormProps) {
  const { selectedResponse, isEditing, closeModal } = useSupportStore();
  const createMutation = useCreateSupportResponse();
  const updateMutation = useUpdateSupportResponse();
  const generateMutation = useGenerateAnswer();

  // Local state for form fields
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isGenerating = generateMutation.isPending;

  // Populate form when modal opens with selectedResponse
  useEffect(() => {
    if (isEditing && selectedResponse) {
      setSubject(selectedResponse.subject || "");
      setQuestion(selectedResponse.question || "");
      setAnswer(selectedResponse.answer || "");
    } else {
      setSubject("");
      setQuestion("");
      setAnswer("");
    }
    setErrors({});
  }, [isEditing, selectedResponse]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!question.trim()) {
      newErrors.question = "Question is required";
    }
    if (!answer.trim()) {
      newErrors.answer = "Answer is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && selectedResponse) {
        await updateMutation.mutateAsync({
          id: selectedResponse.id,
          data: {
            subject,
            question,
            answer,
          },
        });
      } else {
        await createMutation.mutateAsync({
          subject,
          question,
          answer,
        });
      }

      closeModal();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save support response:", error);
    }
  };

  const handleGenerateResponse = async () => {
    if (!question.trim()) {
      setErrors({ ...errors, question: "Please enter a question first" });
      return;
    }

    try {
      const result = await generateMutation.mutateAsync({
        question,
      });
      setAnswer(result.answer);
      setErrors({ ...errors, answer: "" });
    } catch (error) {
      console.error("Failed to generate answer:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-6">
        {/* Subject Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter the subject or title..."
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
          />
          {errors.subject && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {errors.subject}
            </p>
          )}
        </div>

        {/* Question Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Question <span className="text-red-500">*</span>
          </label>
          <TiptapEditor
            placeholder="Enter the customer question or inquiry..."
            content={question}
            onChange={setQuestion}
            className="min-h-[120px]"
          />
          {errors.question && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {errors.question}
            </p>
          )}

          {/* Generate Answer Button */}
          <button
            type="button"
            onClick={handleGenerateResponse}
            disabled={isGenerating || !question.trim()}
            className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating AI Response...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Generate AI Response
              </>
            )}
          </button>
        </div>

        {/* Answer Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Answer <span className="text-red-500">*</span>
          </label>
          <TiptapEditor
            placeholder="The AI-generated response will appear here, or you can write your own..."
            content={answer}
            onChange={setAnswer}
            className="min-h-[200px]"
          />
          {errors.answer && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {errors.answer}
            </p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={closeModal}
          className="flex-1 flex items-center justify-center bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {isEditing ? "Update Response" : "Add Response"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
