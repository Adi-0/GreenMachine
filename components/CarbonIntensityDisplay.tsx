
import React from 'react';
import { CarbonIntensityLevel } from '../types';

interface CarbonIntensityDisplayProps {
  level: CarbonIntensityLevel;
}

const CarbonIntensityDisplay: React.FC<CarbonIntensityDisplayProps> = ({ level }) => {
  const intensityStyles = {
    [CarbonIntensityLevel.LOW]: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-500',
      label: 'Low Carbon Intensity',
      description: 'Great time to use appliances!',
    },
    [CarbonIntensityLevel.MEDIUM]: {
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-500',
      label: 'Medium Carbon Intensity',
      description: 'Consider waiting if possible.',
    },
    [CarbonIntensityLevel.HIGH]: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      borderColor: 'border-red-500',
      label: 'High Carbon Intensity',
      description: 'Best to avoid high-energy tasks.',
    },
  };

  const currentStyle = intensityStyles[level];

  return (
    <div className={`p-6 rounded-lg shadow-lg border-l-4 ${currentStyle.bgColor} ${currentStyle.borderColor}`}>
      <h2 className={`text-2xl font-semibold ${currentStyle.textColor}`}>{currentStyle.label}</h2>
      <p className={`mt-2 text-md ${currentStyle.textColor} opacity-90`}>{currentStyle.description}</p>
    </div>
  );
};

export default CarbonIntensityDisplay;
    