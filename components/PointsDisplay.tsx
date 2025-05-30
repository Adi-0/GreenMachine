
import React from 'react';
import { LeafIcon } from './icons';

interface PointsDisplayProps {
  points: number;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ points }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg text-center">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Green Points</h3>
      <div className="flex items-center justify-center text-green-600">
        <LeafIcon className="w-10 h-10 mr-2" />
        <p className="text-4xl font-bold">{points}</p>
      </div>
      <p className="text-sm text-gray-500 mt-2">Earn points by using energy smartly!</p>
    </div>
  );
};

export default PointsDisplay;
    