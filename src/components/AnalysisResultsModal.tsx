import { AnalyzeQuestionResponse, SimilarityMatch } from "@/types/support";
import Modal from "./Modal";
import { CheckIcon, InfoIcon } from "./icons";

interface AnalysisResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: AnalyzeQuestionResponse | null;
  onSelectResponse: (answer: string) => void;
}

export default function AnalysisResultsModal({
  isOpen,
  onClose,
  results,
  onSelectResponse,
}: AnalysisResultsModalProps) {
  if (!results) return null;

  const handleSelect = (answer: string) => {
    onSelectResponse(answer);
    onClose();
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.8) return "text-green-600 dark:text-green-400";
    if (similarity >= 0.6) return "text-yellow-600 dark:text-yellow-400";
    return "text-orange-600 dark:text-orange-400";
  };

  const getSimilarityBadgeColor = (similarity: number) => {
    if (similarity >= 0.8)
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700";
    if (similarity >= 0.6)
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700";
    return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Similar Questions Found">
      <div className="p-6">
        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg flex items-start">
          <InfoIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
              {results.hasGoodMatch
                ? "Found highly similar questions!"
                : "Found some related questions"}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {results.message}
            </p>
          </div>
        </div>

        {/* Results List */}
        {results.matches.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No similar questions found in the database.
          </div>
        ) : (
          <div className="space-y-4">
            {results.matches.map((match: SimilarityMatch, index: number) => (
              <div
                key={match.response.id}
                className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200 bg-white dark:bg-gray-800/50"
              >
                {/* Header with similarity score */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        #{index + 1}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full border ${getSimilarityBadgeColor(
                          match.similarity
                        )}`}
                      >
                        {match.similarityPercentage}% Match
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {match.response.subject}
                    </h3>
                  </div>
                </div>

                {/* Question */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Question:
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md">
                    {match.response.question}
                  </p>
                </div>

                {/* Answer Preview */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Answer:
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md line-clamp-3">
                    {match.response.answer}
                  </p>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => handleSelect(match.response.answer)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-95"
                >
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Select this response
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
