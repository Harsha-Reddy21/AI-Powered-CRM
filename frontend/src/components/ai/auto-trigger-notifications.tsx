'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';

interface Suggestion {
  type: 'coaching' | 'persona';
  title: string;
  description: string;
  action: () => void;
}

interface AutoTriggerNotificationsProps {
  suggestions: Suggestion[];
  onDismiss: () => void;
  onExecute: (index: number) => void;
  isTriggering: boolean;
}

export default function AutoTriggerNotifications({
  suggestions,
  onDismiss,
  onExecute,
  isTriggering
}: AutoTriggerNotificationsProps) {
  const [visible, setVisible] = useState(false);
  const [executingIndex, setExecutingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (suggestions.length > 0) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [suggestions]);

  const handleExecute = async (index: number) => {
    setExecutingIndex(index);
    await onExecute(index);
    setExecutingIndex(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 300); // Allow animation to complete
  };

  if (!visible || suggestions.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'coaching': return '🎯';
      case 'persona': return '👤';
      default: return '🤖';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'coaching': return 'border-blue-200 bg-blue-50';
      case 'persona': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className={`mb-3 border rounded-lg shadow-lg p-4 transition-all duration-300 ${
            visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          } ${getColor(suggestion.type)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <span className="text-xl">{getIcon(suggestion.type)}</span>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">
                  {suggestion.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  {suggestion.description}
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              ✕
            </button>
          </div>
          
          <div className="flex space-x-2 mt-3">
            <Button
              size="sm"
              onClick={() => handleExecute(index)}
              disabled={executingIndex === index || isTriggering}
              className="text-xs px-3 py-1"
            >
              {executingIndex === index ? 'Running...' : 'Run AI'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDismiss}
              className="text-xs px-3 py-1"
            >
              Later
            </Button>
          </div>
        </div>
      ))}
      
      {isTriggering && (
        <div className="mb-3 border border-gray-200 bg-gray-50 rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-sm text-gray-600">
              Analyzing deal for AI suggestions...
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 