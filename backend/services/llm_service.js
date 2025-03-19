import { OpenAI } from 'langchain/llms/openai';
import { config } from '../config/settings.js';

const llm = new OpenAI({
  openAIApiKey: config.openaiApiKey,
  temperature: 0.7
});

export const llmService = {
  async generateResponse(prompt) {
    try {
      const response = await llm.predict(prompt);
      return response;
    } catch (error) {
      console.error('LLM Error:', error);
      throw error;
    }
  }
};