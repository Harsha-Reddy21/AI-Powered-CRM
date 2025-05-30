import { openai, DEFAULT_MODEL } from '../config/openai';
import { PROMPTS, AIPromptType } from './prompts';

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  confidence?: number;
  tokensUsed?: number;
}

export class AIService {
  private async callOpenAI(
    systemPrompt: string,
    userPrompt: string,
    temperature: number = 0.7
  ): Promise<AIResponse> {
    try {
      const response = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        return { success: false, error: 'No response from AI' };
      }

      // Try to parse JSON response
      try {
        const parsedData = JSON.parse(content);
        return {
          success: true,
          data: parsedData,
          tokensUsed: response.usage?.total_tokens || 0
        };
      } catch (parseError) {
        // If not JSON, return as text
        return {
          success: true,
          data: { text: content },
          tokensUsed: response.usage?.total_tokens || 0
        };
      }
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      return {
        success: false,
        error: error.message || 'AI service error'
      };
    }
  }

  async getDealCoaching(dealData: any): Promise<AIResponse> {
    const systemPrompt = PROMPTS.DEAL_COACH.SYSTEM;
    const userPrompt = PROMPTS.DEAL_COACH.USER(dealData);
    
    return this.callOpenAI(systemPrompt, userPrompt, 0.5);
  }

  async buildPersona(contactData: any): Promise<AIResponse> {
    const systemPrompt = PROMPTS.PERSONA_BUILDER.SYSTEM;
    const userPrompt = PROMPTS.PERSONA_BUILDER.USER(contactData);
    
    return this.callOpenAI(systemPrompt, userPrompt, 0.3);
  }

  async handleObjection(objectionData: any): Promise<AIResponse> {
    const systemPrompt = PROMPTS.OBJECTION_HANDLER.SYSTEM;
    const userPrompt = PROMPTS.OBJECTION_HANDLER.USER(objectionData);
    
    return this.callOpenAI(systemPrompt, userPrompt, 0.6);
  }

  async analyzeWinLoss(dealData: any): Promise<AIResponse> {
    const systemPrompt = PROMPTS.WIN_LOSS_ANALYSIS.SYSTEM;
    const userPrompt = PROMPTS.WIN_LOSS_ANALYSIS.USER(dealData);
    
    return this.callOpenAI(systemPrompt, userPrompt, 0.4);
  }

  // Generic method for custom prompts
  async customPrompt(
    promptType: AIPromptType,
    data: any,
    temperature: number = 0.7
  ): Promise<AIResponse> {
    const prompt = PROMPTS[promptType];
    if (!prompt) {
      return { success: false, error: 'Invalid prompt type' };
    }

    const systemPrompt = prompt.SYSTEM;
    const userPrompt = prompt.USER(data);
    
    return this.callOpenAI(systemPrompt, userPrompt, temperature);
  }
}

export const aiService = new AIService(); 