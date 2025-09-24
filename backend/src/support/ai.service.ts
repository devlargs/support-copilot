import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private readonly HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';

    async generateAnswer(question: string, contextSupportResponses: any[]): Promise<string> {
        try {
            // Create context from existing support responses
            const context = this.buildContext(contextSupportResponses);

            // Prepare the prompt for the AI model
            const prompt = this.buildPrompt(question, context);

            // Call Hugging Face Inference API
            const response = await axios.post(
                this.HUGGINGFACE_API_URL,
                {
                    inputs: prompt,
                    parameters: {
                        max_length: 200,
                        temperature: 0.7,
                        do_sample: true,
                    },
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY || 'hf_demo'}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 30000, // 30 seconds timeout
                }
            );

            // Extract and clean the generated response
            let generatedText = response.data[0]?.generated_text || '';

            // Clean up the response (remove the original prompt)
            if (generatedText.includes(prompt)) {
                generatedText = generatedText.replace(prompt, '').trim();
            }

            // If the response is too short or empty, provide a fallback
            if (!generatedText || generatedText.length < 10) {
                return this.getFallbackResponse(question, contextSupportResponses);
            }

            return generatedText;
        } catch (error) {
            this.logger.error('Error generating AI response:', error.message);

            // Fallback to context-based response
            return this.getFallbackResponse(question, contextSupportResponses);
        }
    }

    private buildContext(supportResponses: any[]): string {
        if (!supportResponses || supportResponses.length === 0) {
            return 'No previous support responses available.';
        }

        return supportResponses
            .slice(0, 5) // Use top 5 most relevant responses
            .map(response => `Q: ${response.question}\nA: ${response.answer}`)
            .join('\n\n');
    }

    private buildPrompt(question: string, context: string): string {
        return `Based on the following support knowledge base, please provide a helpful answer to the user's question.

Support Knowledge Base:
${context}

User Question: ${question}

Answer:`;
    }

    private getFallbackResponse(question: string, contextSupportResponses: any[]): string {
        // Find the most similar question from existing responses
        const similarResponse = this.findSimilarResponse(question, contextSupportResponses);

        if (similarResponse) {
            return `Based on similar questions in our knowledge base, here's what I found:\n\n${similarResponse.answer}\n\nIf this doesn't fully answer your question, please contact our support team for more specific assistance.`;
        }

        // Generic fallback response
        return `Thank you for your question: "${question}". While I don't have a specific answer in our knowledge base, our support team is here to help. Please contact us directly for personalized assistance with your inquiry.`;
    }

    private findSimilarResponse(question: string, supportResponses: any[]): any {
        if (!supportResponses || supportResponses.length === 0) {
            return null;
        }

        const questionLower = question.toLowerCase();

        // Simple keyword matching to find similar questions
        for (const response of supportResponses) {
            const responseQuestionLower = response.question.toLowerCase();

            // Check for common keywords
            const questionWords = questionLower.split(' ');
            const responseWords = responseQuestionLower.split(' ');

            const commonWords = questionWords.filter(word =>
                responseWords.includes(word) && word.length > 3
            );

            // If more than 30% of words match, consider it similar
            if (commonWords.length / questionWords.length > 0.3) {
                return response;
            }
        }

        return null;
    }
}
