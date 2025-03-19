import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface ChatResponse {
  role: string;
  response: string;
}

export const aiService = {
  async sendMessage(role: string, message: string): Promise<ChatResponse> {
    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured');
      }

      const prompt = `You are ${role}. Respond to the following message in a helpful and professional manner: ${message}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('No response generated from Gemini');
      }
      
      return {
        role,
        response: text
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to get AI response: ${error.message}`);
      }
      throw new Error('Failed to get AI response: Unknown error occurred');
    }
  },

  async reviewDocument(document: any): Promise<{ status: string; feedback: string }> {
    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured');
      }

      const prompt = `You are a document reviewer. Review the following document and provide detailed feedback: ${JSON.stringify(document)}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const feedback = response.text();
      
      if (!feedback) {
        throw new Error('No feedback generated from Gemini');
      }
      
      return {
        status: 'success',
        feedback
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to review document: ${error.message}`);
      }
      throw new Error('Failed to review document: Unknown error occurred');
    }
  }
}; 