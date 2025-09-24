import { useState } from "react";
import TiptapEditor from "../components/TiptapEditor";
import SupportTable from "../components/SupportTable";
import { mockSupportData } from "../data/mockData";

export default function SupportPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will be implemented later
    console.log("Question:", question);
    console.log("Answer:", answer);

    // Reset form
    setQuestion("");
    setAnswer("");
  };

  const handleGenerateResponse = () => {
    if (!question.trim()) {
      alert("Please enter a question first before generating a response.");
      return;
    }

    setIsGenerating(true);

    // Mock AI response generation based on question content
    const generateMockResponse = (questionText: string): string => {
      const lowerQuestion = questionText.toLowerCase();

      if (
        lowerQuestion.includes("password") ||
        lowerQuestion.includes("reset")
      ) {
        return "To reset your password, please follow these steps:<br><br>1. Go to the login page<br>2. Click on 'Forgot Password'<br>3. Enter your email address<br>4. Check your email for reset instructions<br>5. Follow the link and create a new password<br><br>If you don't receive the email, check your spam folder or contact support.";
      }

      if (
        lowerQuestion.includes("account") ||
        lowerQuestion.includes("create") ||
        lowerQuestion.includes("sign up")
      ) {
        return "Creating a new account is easy! Here's how:<br><br>1. Click the 'Sign Up' button on our homepage<br>2. Fill in your personal information<br>3. Choose a strong password<br>4. Verify your email address<br>5. Complete your profile setup<br><br>Once verified, you'll have full access to all features.";
      }

      if (
        lowerQuestion.includes("payment") ||
        lowerQuestion.includes("billing") ||
        lowerQuestion.includes("subscription")
      ) {
        return "We accept multiple payment methods for your convenience:<br><br>• Credit cards (Visa, MasterCard, American Express)<br>• PayPal<br>• Bank transfers<br>• Digital wallets<br><br>All payments are processed securely through our encrypted payment gateway. You can update your payment method anytime in your account settings.";
      }

      if (
        lowerQuestion.includes("support") ||
        lowerQuestion.includes("contact") ||
        lowerQuestion.includes("help")
      ) {
        return "Our support team is here to help you! You can reach us through:<br><br>• <strong>Email:</strong> support@company.com<br>• <strong>Phone:</strong> 1-800-SUPPORT (Mon-Fri, 9AM-6PM)<br>• <strong>Live Chat:</strong> Available 24/7 on our website<br>• <strong>Help Center:</strong> Comprehensive guides and FAQs<br><br>We typically respond within 2-4 hours during business hours.";
      }

      if (
        lowerQuestion.includes("security") ||
        lowerQuestion.includes("privacy") ||
        lowerQuestion.includes("data")
      ) {
        return "Your security and privacy are our top priorities:<br><br>• <strong>Encryption:</strong> All data is encrypted in transit and at rest<br>• <strong>Two-Factor Authentication:</strong> Available for enhanced security<br>• <strong>Regular Audits:</strong> We conduct security assessments regularly<br>• <strong>GDPR Compliant:</strong> Full compliance with data protection regulations<br>• <strong>Secure Infrastructure:</strong> Hosted on enterprise-grade servers<br><br>We never share your personal information with third parties without your consent.";
      }

      if (
        lowerQuestion.includes("mobile") ||
        lowerQuestion.includes("app") ||
        lowerQuestion.includes("download")
      ) {
        return "Yes, we have mobile apps available for both platforms:<br><br>• <strong>iOS:</strong> Download from the App Store<br>• <strong>Android:</strong> Download from Google Play Store<br><br>Our mobile apps offer the same features as the web version, optimized for mobile devices. You can sync your data across all platforms seamlessly.";
      }

      if (
        lowerQuestion.includes("feature") ||
        lowerQuestion.includes("premium") ||
        lowerQuestion.includes("plan")
      ) {
        return "Our premium plan includes these advanced features:<br><br>• <strong>Advanced Analytics:</strong> Detailed insights and reporting<br>• <strong>Priority Support:</strong> Faster response times<br>• <strong>Unlimited Storage:</strong> No storage limits<br>• <strong>API Access:</strong> Full API integration capabilities<br>• <strong>Custom Integrations:</strong> Connect with your favorite tools<br>• <strong>Advanced Security:</strong> Enhanced security features<br><br>Upgrade anytime from your account settings.";
      }

      // Default response for other questions
      return `Thank you for your question: "${questionText}"<br><br>Here's a comprehensive answer to help you:<br><br>1. <strong>Understanding the Issue:</strong> Let me break down your question to provide the most relevant information.<br><br>2. <strong>Step-by-Step Solution:</strong><br>   • First, identify the specific area you need help with<br>   • Review our documentation and guides<br>   • Try the suggested solutions in order<br>   • Contact support if you need further assistance<br><br>3. <strong>Additional Resources:</strong><br>   • Check our FAQ section<br>   • Browse our knowledge base<br>   • Join our community forum<br><br>If this doesn't fully answer your question, please provide more details and our support team will be happy to help!`;
    };

    // Simulate AI processing delay
    setTimeout(() => {
      const generatedResponse = generateMockResponse(question);
      setAnswer(generatedResponse);
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900 overflow-hidden">
      <div className="h-full flex">
        {/* Left Panel - Form */}
        <div className="w-1/2 p-6 border-r border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 h-full flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Add Support Response
            </h1>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="space-y-6 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Question
                  </label>
                  <TiptapEditor
                    placeholder="Enter your question here..."
                    content={question}
                    onChange={setQuestion}
                    className="min-h-[120px]"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateResponse}
                    disabled={isGenerating}
                    className="mt-3 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    {isGenerating ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4 mr-2"
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
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
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
                        Generate Response
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Answer
                  </label>
                  <TiptapEditor
                    placeholder="Enter your answer here..."
                    content={answer}
                    onChange={setAnswer}
                    className="min-h-[200px]"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Add Response
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel - Table */}
        <div className="w-1/2 p-6">
          <SupportTable data={mockSupportData} />
        </div>
      </div>
    </div>
  );
}
