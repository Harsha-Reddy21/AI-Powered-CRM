'use client';

import { useState } from 'react';
import { aiService, WinLossResponse } from '@/lib/ai-service';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';

interface WinLossAnalysisProps {
  dealData: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function WinLossAnalysis({ dealData, isOpen, onClose }: WinLossAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<WinLossResponse | null>(null);
  const [status, setStatus] = useState<'won' | 'lost'>('won');
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiService.analyzeWinLoss(dealData.id, dealData, status);
      setAnalysis(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Win-Loss Analysis">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deal Outcome
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="won"
                checked={status === 'won'}
                onChange={(e) => setStatus(e.target.value as 'won' | 'lost')}
                className="mr-2"
              />
              <span className="text-green-600 font-medium">Won</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="lost"
                checked={status === 'lost'}
                onChange={(e) => setStatus(e.target.value as 'won' | 'lost')}
                className="mr-2"
              />
              <span className="text-red-600 font-medium">Lost</span>
            </label>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Analyzing...' : 'Generate AI Analysis'}
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getConfidenceColor(analysis.analysis.confidence)}`}>
                Confidence: {analysis.analysis.confidence}%
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Outcome Summary</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {analysis.analysis.outcome}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Key Success/Failure Factors</h3>
              <ul className="space-y-2">
                {analysis.analysis.keyFactors.map((factor, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className={`mr-2 ${status === 'won' ? 'text-green-500' : 'text-red-500'}`}>
                      {status === 'won' ? '✓' : '✗'}
                    </span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Lessons Learned</h3>
              <ul className="space-y-2">
                {analysis.analysis.lessonsLearned.map((lesson, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-blue-500 mr-2">💡</span>
                    {lesson}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
} 