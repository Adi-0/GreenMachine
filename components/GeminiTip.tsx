
import React from 'react';
import { LightBulbIcon } from './icons';
import Spinner from './Spinner';

interface GeminiTipProps {
  tip: string;
  isLoading: boolean;
  onFetchNewTip: () => void;
  apiKeyAvailable: boolean;
}

const GeminiTip: React.FC<GeminiTipProps> = ({ tip, isLoading, onFetchNewTip, apiKeyAvailable }) => {
  return (
    <div className="p-6 bg-yellow-50 rounded-lg shadow-lg border-l-4 border-yellow-400">
      <div className="flex items-start space-x-3">
        <LightBulbIcon className="w-8 h-8 text-yellow-500 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-xl font-semibold text-yellow-700 mb-2">Green Tip!</h3>
          {isLoading ? (
            <div className="py-4">
              <Spinner size="sm" color="text-yellow-600" />
            </div>
          ) : (
            <p className="text-yellow-800 text-sm leading-relaxed">{tip}</p>
          )}
        </div>
      </div>
      {apiKeyAvailable && (
        <button
          onClick={onFetchNewTip}
          disabled={isLoading}
          className="mt-4 w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Get Another Tip'}
        </button>
      )}
    </div>
  );
};

export default GeminiTip;
    