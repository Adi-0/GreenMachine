
import React from 'react';

interface CarbonPointsDisplayProps {
  points: number;
}

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-yellow-400">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.557 2.403c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

const CarbonPointsDisplay: React.FC<CarbonPointsDisplayProps> = ({ points }) => {
  return (
    <div className="p-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 shadow-xl rounded-xl border-2 border-white/50 text-yellow-900">
      <h3 className="text-xl font-semibold mb-3 flex items-center">
        <StarIcon />
        <span className="ml-2">Carbon Points Earned</span>
      </h3>
      <p className="text-5xl font-extrabold">{points}</p>
      <p className="text-sm opacity-90 mt-1">
        Earn points by running appliances during low carbon periods!
      </p>
      <p className="text-xs opacity-80 mt-2">
        (Simulated: These points could be redeemed for rewards in a full version.)
      </p>
    </div>
  );
};

export default CarbonPointsDisplay;
    