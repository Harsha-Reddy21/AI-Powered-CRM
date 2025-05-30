const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  tokensUsed?: number;
  timestamp?: string;
}

export interface DealCoachingResponse {
  dealId: string;
  coaching: {
    riskLevel: 'High' | 'Medium' | 'Low';
    riskExplanation: string;
    nextActions: string[];
    roadblocks: string[];
    timeline: string;
    keyStakeholders: string[];
  };
  tokensUsed: number;
  timestamp: string;
}

export interface PersonaResponse {
  contactId: string;
  persona: {
    buyerType: string;
    communicationStyle: string;
    motivators: string[];
    concerns: string[];
    preferredChannels: string[];
    decisionTimeline: string;
    authorityLevel: string;
    summary: string;
  };
  tokensUsed: number;
  timestamp: string;
}

export interface ObjectionResponse {
  objection: string;
  suggestions: {
    analysis: string;
    responses: Array<{
      approach: string;
      response: string;
    }>;
    followUpQuestions: string[];
    supportingMaterials: string[];
    nextSteps: string[];
  };
  tokensUsed: number;
  timestamp: string;
}

export interface WinLossResponse {
  dealId: string;
  status: 'won' | 'lost';
  analysis: {
    outcome: string;
    keyFactors: string[];
    timeline: string;
    competitive: string;
    engagement: string;
    lessonsLearned: string[];
    recommendations: string[];
    confidence: number;
  };
  tokensUsed: number;
  timestamp: string;
}

class AIService {
  private async makeRequest<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}/ai${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'AI service error');
    }

    return response.json();
  }

  async getDealCoaching(dealId: string, dealData: any): Promise<DealCoachingResponse> {
    return this.makeRequest<DealCoachingResponse>(`/deal-coach/${dealId}`, { dealData });
  }

  async buildPersona(contactId: string, contactData: any): Promise<PersonaResponse> {
    return this.makeRequest<PersonaResponse>(`/persona-builder/${contactId}`, { contactData });
  }

  async handleObjection(objectionData: {
    objectionText: string;
    dealTitle?: string;
    customerName?: string;
    customerRole?: string;
    stage?: string;
    value?: string;
    background?: string;
  }): Promise<ObjectionResponse> {
    return this.makeRequest<ObjectionResponse>('/objection-handler', objectionData);
  }

  async analyzeWinLoss(dealId: string, dealData: any, status: 'won' | 'lost'): Promise<WinLossResponse> {
    return this.makeRequest<WinLossResponse>(`/win-loss-analysis/${dealId}`, { dealData, status });
  }

  async checkHealth(): Promise<{ status: string; ai_service: boolean; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL}/ai/health`);
    return response.json();
  }
}

export const aiService = new AIService(); 