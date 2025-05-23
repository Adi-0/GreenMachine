
import React from 'react';
import type { OptimalTimeSlot } from '../types';
import { CarbonIntensityLevel } from '../types';

interface RecommendedTimeSlotsProps {
  timeSlots: OptimalTimeSlot[];
}

const TimeSlotIcon = ({ intensity }: { intensity: CarbonIntensityLevel }) => {
  let iconColor = "text-gray-400";
  if (intensity === CarbonIntensityLevel.LOW) iconColor = "text-green-500";
  else if (intensity === CarbonIntensityLevel.MEDIUM) iconColor = "text-yellow-500";
  else if (intensity === CarbonIntensityLevel.HIGH) iconColor = "text-red-500";

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 mr-2 ${iconColor}`}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
    </svg>
  );
};


const RecommendedTimeSlots: React.FC<RecommendedTimeSlotsProps> = ({ timeSlots }) => {
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const lowCarbonSlots = timeSlots
    .filter(slot => slot.intensity === CarbonIntensityLevel.LOW)
    .slice(0, 3); // Show top 3 low carbon slots

  return (
    <div className="p-6 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl border border-green-dark">
      <h3 className="text-xl font-semibold text-green-dark mb-4">Recommended Low Carbon Slots</h3>
      {lowCarbonSlots.length > 0 ? (
        <ul className="space-y-3">
          {lowCarbonSlots.map(slot => (
            <li key={slot.id} className="p-3 bg-green-light rounded-lg shadow flex items-center">
              <TimeSlotIcon intensity={slot.intensity} />
              <div>
                <p className="font-medium text-green-dark">
                  {formatTime(new Date(slot.startTime))} - {formatTime(new Date(slot.endTime))}
                  {new Date(slot.startTime).toLocaleDateString() !== new Date().toLocaleDateString() ? ` (Tomorrow)` : ` (Today)`}
                </p>
                <p className="text-sm text-green-dark/80">
                  Intensity: {slot.intensity} ({slot.intensityValue.toFixed(0)} gCO2eq/kWh)
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No significant low carbon periods forecasted soon. Check back later.</p>
      )}
       <p className="text-xs text-gray-500 mt-3">These are simulated forecasts. Actual optimal times may vary.</p>
    </div>
  );
};

export default RecommendedTimeSlots;
    