// AI Output Persistence Service

export interface AIOutputRecord {
  id: string;
  dealId: string;
  type: 'coaching' | 'persona' | 'objection' | 'win-loss';
  output: any;
  timestamp: string;
  tokensUsed?: number;
}

class AIStorageService {
  private readonly STORAGE_KEY = 'ai_crm_outputs';

  // Get all stored AI outputs
  getAllOutputs(): AIOutputRecord[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading AI outputs from storage:', error);
      return [];
    }
  }

  // Save AI output
  saveOutput(dealId: string, type: AIOutputRecord['type'], output: any, tokensUsed?: number): string {
    const record: AIOutputRecord = {
      id: this.generateId(),
      dealId,
      type,
      output,
      timestamp: new Date().toISOString(),
      tokensUsed
    };

    try {
      const outputs = this.getAllOutputs();
      outputs.push(record);
      
      // Keep only last 50 outputs to prevent storage bloat
      const trimmedOutputs = outputs.slice(-50);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmedOutputs));
      console.log(`Saved ${type} output for deal ${dealId}`);
      return record.id;
    } catch (error) {
      console.error('Error saving AI output:', error);
      return '';
    }
  }

  // Get outputs for a specific deal
  getOutputsForDeal(dealId: string): AIOutputRecord[] {
    return this.getAllOutputs().filter(output => output.dealId === dealId);
  }

  // Get outputs by type
  getOutputsByType(type: AIOutputRecord['type']): AIOutputRecord[] {
    return this.getAllOutputs().filter(output => output.type === type);
  }

  // Get latest output for a deal and type
  getLatestOutput(dealId: string, type: AIOutputRecord['type']): AIOutputRecord | null {
    const outputs = this.getOutputsForDeal(dealId)
      .filter(output => output.type === type)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return outputs.length > 0 ? outputs[0] : null;
  }

  // Clear all outputs
  clearAllOutputs(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Export outputs as JSON
  exportOutputs(): string {
    return JSON.stringify(this.getAllOutputs(), null, 2);
  }

  // Get statistics
  getStatistics() {
    const outputs = this.getAllOutputs();
    const totalTokens = outputs.reduce((sum, output) => sum + (output.tokensUsed || 0), 0);
    const typeStats = outputs.reduce((stats, output) => {
      stats[output.type] = (stats[output.type] || 0) + 1;
      return stats;
    }, {} as Record<string, number>);

    return {
      totalOutputs: outputs.length,
      totalTokensUsed: totalTokens,
      typeBreakdown: typeStats,
      oldestOutput: outputs.length > 0 ? outputs[0].timestamp : null,
      newestOutput: outputs.length > 0 ? outputs[outputs.length - 1].timestamp : null
    };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const aiStorageService = new AIStorageService(); 