'use client';

import { useState, useEffect } from 'react';
import { aiService, DealCoachingResponse, PersonaResponse, ObjectionResponse } from '@/lib/ai-service';
import { aiStorageService, AIOutputRecord } from '@/lib/ai-storage';
import Button from '@/components/ui/button';

interface AISidebarProps {
  dealData: any;
  contactData?: any;
  onClose?: () => void;
}

export default function AISidebar({ dealData, contactData, onClose }: AISidebarProps) {
  const [activeTab, setActiveTab] = useState<'coach' | 'persona' | 'objection' | 'analysis'>('coach');
  const [loading, setLoading] = useState(false);
  const [coachingData, setCoachingData] = useState<DealCoachingResponse | null>(null);
  const [personaData, setPersonaData] = useState<PersonaResponse | null>(null);
  const [objectionData, setObjectionData] = useState<ObjectionResponse | null>(null);
  const [objectionText, setObjectionText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cachedOutputs, setCachedOutputs] = useState<AIOutputRecord[]>([]);

  // Load cached outputs on mount and when deal changes
  useEffect(() => {
    if (dealData?.id) {
      const outputs = aiStorageService.getOutputsForDeal(dealData.id);
      setCachedOutputs(outputs);
      
      // Load latest coaching data if available
      const latestCoaching = outputs.find(o => o.type === 'coaching');
      if (latestCoaching) {
        setCoachingData(latestCoaching.output);
      }
      
      // Load latest persona data if available
      const latestPersona = outputs.find(o => o.type === 'persona');
      if (latestPersona) {
        setPersonaData(latestPersona.output);
      }
    }
  }, [dealData?.id]);

  const handleGetCoaching = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiService.getDealCoaching(dealData.id, dealData);
      setCoachingData(response);
      
      // Save to storage
      aiStorageService.saveOutput(dealData.id, 'coaching', response, response.tokensUsed);
      
      // Refresh cached outputs
      setCachedOutputs(aiStorageService.getOutputsForDeal(dealData.id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuildPersona = async () => {
    if (!contactData) {
      setError('Contact data is required for persona building');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await aiService.buildPersona(contactData.id, contactData);
      setPersonaData(response);
      
      // Save to storage
      aiStorageService.saveOutput(dealData.id, 'persona', response, response.tokensUsed);
      
      // Refresh cached outputs
      setCachedOutputs(aiStorageService.getOutputsForDeal(dealData.id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleObjectionSubmit = async () => {
    if (!objectionText.trim()) {
      setError('Please enter an objection to analyze');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await aiService.handleObjection({
        objectionText,
        dealTitle: dealData.title,
        customerName: contactData?.name,
        customerRole: contactData?.role,
        stage: dealData.stage,
        value: dealData.value,
        background: contactData?.notes
      });
      setObjectionData(response);
      
      // Save to storage
      aiStorageService.saveOutput(dealData.id, 'objection', response, response.tokensUsed);
      
      // Refresh cached outputs
      setCachedOutputs(aiStorageService.getOutputsForDeal(dealData.id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getCachedDataAge = (type: AIOutputRecord['type']) => {
    const cached = cachedOutputs.find(o => o.type === type);
    return cached ? formatTimestamp(cached.timestamp) : null;
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
          <p className="text-xs text-gray-500">
            {cachedOutputs.length} cached result{cachedOutputs.length !== 1 ? 's' : ''}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'coach', label: 'Coach', icon: '🎯' },
          { id: 'persona', label: 'Persona', icon: '👤' },
          { id: 'objection', label: 'Objections', icon: '💬' },
          { id: 'analysis', label: 'Analysis', icon: '📊' }
        ].map((tab) => {
          const hasCache = cachedOutputs.some(o => o.type === tab.id as any);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-3 py-2 text-sm font-medium relative ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
              {hasCache && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Deal Coach Tab */}
        {activeTab === 'coach' && (
          <div className="space-y-4">
            <div className="text-center">
              <Button
                onClick={handleGetCoaching}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Analyzing...' : 'Get AI Coaching'}
              </Button>
              {getCachedDataAge('coaching') && (
                <p className="text-xs text-gray-500 mt-1">
                  Last updated: {getCachedDataAge('coaching')}
                </p>
              )}
            </div>

            {coachingData && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Risk Assessment</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(coachingData.coaching.riskLevel)}`}>
                    {coachingData.coaching.riskLevel} Risk
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{coachingData.coaching.riskExplanation}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Next Actions</h3>
                  <ul className="space-y-1">
                    {coachingData.coaching.nextActions.map((action, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Potential Roadblocks</h3>
                  <ul className="space-y-1">
                    {coachingData.coaching.roadblocks.map((roadblock, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-red-500 mr-2">⚠</span>
                        {roadblock}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Timeline</h3>
                  <p className="text-sm text-gray-600">{coachingData.coaching.timeline}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Persona Tab */}
        {activeTab === 'persona' && (
          <div className="space-y-4">
            <div className="text-center">
              <Button
                onClick={handleBuildPersona}
                disabled={loading || !contactData}
                className="w-full"
              >
                {loading ? 'Building...' : 'Build Persona'}
              </Button>
              {!contactData && (
                <p className="text-xs text-gray-500 mt-2">Contact data required</p>
              )}
              {getCachedDataAge('persona') && (
                <p className="text-xs text-gray-500 mt-1">
                  Last updated: {getCachedDataAge('persona')}
                </p>
              )}
            </div>

            {personaData && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Buyer Type</h3>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {personaData.persona.buyerType}
                  </span>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Communication Style</h3>
                  <p className="text-sm text-gray-600">{personaData.persona.communicationStyle}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Key Motivators</h3>
                  <div className="flex flex-wrap gap-1">
                    {personaData.persona.motivators.map((motivator, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {motivator}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Main Concerns</h3>
                  <div className="flex flex-wrap gap-1">
                    {personaData.persona.concerns.map((concern, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
                  <p className="text-sm text-gray-600">{personaData.persona.summary}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Objection Tab */}
        {activeTab === 'objection' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Objection
              </label>
              <textarea
                value={objectionText}
                onChange={(e) => setObjectionText(e.target.value)}
                placeholder="Enter the customer's objection here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <Button
              onClick={handleObjectionSubmit}
              disabled={loading || !objectionText.trim()}
              className="w-full"
            >
              {loading ? 'Analyzing...' : 'Get Response Suggestions'}
            </Button>

            {objectionData && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Analysis</h3>
                  <p className="text-sm text-gray-600">{objectionData.suggestions.analysis}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Response Approaches</h3>
                  <div className="space-y-3">
                    {objectionData.suggestions.responses.map((response, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-3">
                        <h4 className="font-medium text-sm text-blue-600 mb-1">{response.approach}</h4>
                        <p className="text-sm text-gray-600">{response.response}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Follow-up Questions</h3>
                  <ul className="space-y-1">
                    {objectionData.suggestions.followUpQuestions.map((question, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-blue-500 mr-2">?</span>
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Win-Loss analysis will be available when the deal is closed.
              </p>
              <Button disabled className="w-full">
                Generate Analysis
              </Button>
            </div>

            {/* Show cached analysis data if available */}
            {cachedOutputs.filter(o => o.type === 'win-loss').length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 mb-2">Previous Analysis</h3>
                {cachedOutputs
                  .filter(o => o.type === 'win-loss')
                  .map((output, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-3 mb-2">
                      <p className="text-xs text-gray-500">
                        {formatTimestamp(output.timestamp)}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        Analysis available for review
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Storage Statistics */}
      <div className="border-t border-gray-200 p-3">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Total AI calls:</span>
            <span>{cachedOutputs.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Tokens used:</span>
            <span>{cachedOutputs.reduce((sum, o) => sum + (o.tokensUsed || 0), 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 