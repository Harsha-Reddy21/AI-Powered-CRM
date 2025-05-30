import { useEffect, useRef, useState } from 'react';
import { aiService } from '@/lib/ai-service';
import { aiStorageService } from '@/lib/ai-storage';

interface AutoTriggerConfig {
  enabled: boolean;
  inactivityDelay: number; // milliseconds
  dealCoachingEnabled: boolean;
  personaEnabled: boolean;
  triggerOnDealChange: boolean;
}

interface AutoTriggerState {
  isTriggering: boolean;
  lastTrigger: string | null;
  suggestions: Array<{
    type: 'coaching' | 'persona';
    title: string;
    description: string;
    action: () => void;
  }>;
}

export function useAutoTrigger(
  dealData: any,
  contactData?: any,
  config: Partial<AutoTriggerConfig> = {}
) {
  const defaultConfig: AutoTriggerConfig = {
    enabled: true,
    inactivityDelay: 30000, // 30 seconds
    dealCoachingEnabled: true,
    personaEnabled: true,
    triggerOnDealChange: true,
    ...config
  };

  const [state, setState] = useState<AutoTriggerState>({
    isTriggering: false,
    lastTrigger: null,
    suggestions: []
  });

  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const lastActivity = useRef<number>(Date.now());
  const lastDealData = useRef<string>(JSON.stringify(dealData));

  // Reset inactivity timer
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    
    lastActivity.current = Date.now();
    
    if (defaultConfig.enabled) {
      inactivityTimer.current = setTimeout(() => {
        handleInactivityTrigger();
      }, defaultConfig.inactivityDelay);
    }
  };

  // Handle inactivity trigger
  const handleInactivityTrigger = async () => {
    if (!dealData || state.isTriggering) return;

    setState(prev => ({ ...prev, isTriggering: true }));

    try {
      const suggestions: AutoTriggerState['suggestions'] = [];

      // Check if we should suggest deal coaching
      if (defaultConfig.dealCoachingEnabled) {
        const lastCoaching = aiStorageService.getLatestOutput(dealData.id, 'coaching');
        const shouldSuggestCoaching = !lastCoaching || 
          (Date.now() - new Date(lastCoaching.timestamp).getTime()) > 3600000; // 1 hour

        if (shouldSuggestCoaching) {
          suggestions.push({
            type: 'coaching',
            title: 'AI Deal Coaching Available',
            description: `Get AI insights for "${dealData.title}" - Risk assessment and next steps`,
            action: async () => {
              try {
                const coaching = await aiService.getDealCoaching(dealData.id, dealData);
                aiStorageService.saveOutput(dealData.id, 'coaching', coaching, coaching.tokensUsed);
              } catch (error) {
                console.error('Auto-coaching failed:', error);
              }
            }
          });
        }
      }

      // Check if we should suggest persona building
      if (defaultConfig.personaEnabled && contactData) {
        const lastPersona = aiStorageService.getLatestOutput(dealData.id, 'persona');
        const shouldSuggestPersona = !lastPersona || 
          (Date.now() - new Date(lastPersona.timestamp).getTime()) > 86400000; // 24 hours

        if (shouldSuggestPersona) {
          suggestions.push({
            type: 'persona',
            title: 'Customer Persona Analysis',
            description: `Build AI persona for ${contactData.name} - Communication style and motivators`,
            action: async () => {
              try {
                const persona = await aiService.buildPersona(contactData.id, contactData);
                aiStorageService.saveOutput(dealData.id, 'persona', persona, persona.tokensUsed);
              } catch (error) {
                console.error('Auto-persona failed:', error);
              }
            }
          });
        }
      }

      setState(prev => ({
        ...prev,
        suggestions,
        lastTrigger: new Date().toISOString(),
        isTriggering: false
      }));

    } catch (error) {
      console.error('Auto-trigger error:', error);
      setState(prev => ({ ...prev, isTriggering: false }));
    }
  };

  // Handle deal change trigger
  const handleDealChangeTrigger = () => {
    const currentDealData = JSON.stringify(dealData);
    
    if (currentDealData !== lastDealData.current && defaultConfig.triggerOnDealChange) {
      console.log('Deal data changed, triggering AI suggestions...');
      lastDealData.current = currentDealData;
      
      // Trigger coaching suggestion on significant changes
      setTimeout(() => {
        handleInactivityTrigger();
      }, 2000); // Small delay to avoid rapid triggers
    }
  };

  // Dismiss suggestions
  const dismissSuggestions = () => {
    setState(prev => ({ ...prev, suggestions: [] }));
  };

  // Execute suggestion
  const executeSuggestion = async (index: number) => {
    const suggestion = state.suggestions[index];
    if (suggestion) {
      await suggestion.action();
      // Remove the executed suggestion
      setState(prev => ({
        ...prev,
        suggestions: prev.suggestions.filter((_, i) => i !== index)
      }));
    }
  };

  // Set up event listeners for user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, true);
    });

    // Initial timer
    resetInactivityTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer, true);
      });
      
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [defaultConfig.enabled, defaultConfig.inactivityDelay]);

  // Watch for deal changes
  useEffect(() => {
    handleDealChangeTrigger();
  }, [dealData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, []);

  return {
    ...state,
    dismissSuggestions,
    executeSuggestion,
    resetInactivityTimer,
    config: defaultConfig
  };
} 