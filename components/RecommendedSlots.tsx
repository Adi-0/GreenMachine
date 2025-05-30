
import React from 'react';
import { CarbonIntensityLevel, TimeSlot } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon } from './icons';

interface RecommendedSlotsProps {
  currentIntensity: CarbonIntensityLevel;
}

const RecommendedSlots: React.FC<RecommendedSlotsProps> = ({ currentIntensity }) => {
  const getSlots = (): TimeSlot[] => {
    const now = new Date();
    const addHours = (date: Date, hours: number) => {
      const newDate = new Date(date);
      newDate.setHours(newDate.getHours() + hours);
      return newDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    };

    switch (currentIntensity) {
      case CarbonIntensityLevel.LOW:
        return [
          { id: 'slot1', period: `Now - ${addHours(now, 2)}`, intensity: CarbonIntensityLevel.LOW, recommendation: 'Optimal Time' },
          { id: 'slot2', period: `${addHours(now, 3)} - ${addHours(now, 5)}`, intensity: CarbonIntensityLevel.LOW, recommendation: 'Also Good' },
        ];
      case CarbonIntensityLevel.MEDIUM:
        return [
          { id: 'slot1', period: `${addHours(now, 2)} - ${addHours(now, 4)}`, intensity: CarbonIntensityLevel.LOW, recommendation: 'Wait for Low' },
          { id: 'slot2', period: `${addHours(now, 6)} - ${addHours(now, 8)}`, intensity: CarbonIntensityLevel.LOW, recommendation: 'Evening Low Window' },
        ];
      case CarbonIntensityLevel.HIGH:
        return [
          { id: 'slot1', period: `${addHours(now, 4)} - ${addHours(now, 6)}`, intensity: CarbonIntensityLevel.MEDIUM, recommendation: 'Potential Medium Window' },
          { id: 'slot2', period: 'Check Later', intensity: CarbonIntensityLevel.HIGH, recommendation: 'Avoid current peak' },
        ];
      default:
        return [];
    }
  };

  const slots = getSlots();

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Recommended Times</h3>
      {slots.length > 0 ? (
        <ul className="space-y-3">
          {slots.map((slot) => (
            <li key={slot.id} className={`p-3 rounded-md flex items-start space-x-3 ${
              slot.intensity === CarbonIntensityLevel.LOW ? 'bg-green-50 border-l-4 border-green-400' :
              slot.intensity === CarbonIntensityLevel.MEDIUM ? 'bg-yellow-50 border-l-4 border-yellow-400' :
              'bg-red-50 border-l-4 border-red-400'
            }`}>
              {slot.intensity === CarbonIntensityLevel.LOW ? <CheckCircleIcon className="w-6 h-6 text-green-500 mt-1" /> : <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 mt-1" />}
              <div>
                <p className="font-medium text-gray-800">{slot.period}</p>
                <p className="text-sm text-gray-600">{slot.recommendation} ({slot.intensity})</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No specific recommendations at this moment. Check current intensity.</p>
      )}
    </div>
  );
};

export default RecommendedSlots;
    