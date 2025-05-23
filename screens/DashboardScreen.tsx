
import React from 'react';
import { useGreenMachine } from '../contexts/GreenMachineContext';
import CarbonIntensityDisplay from '../components/CarbonIntensityDisplay';
import RecommendedTimeSlots from '../components/RecommendedTimeSlots';
import ApplianceControl from '../components/ApplianceControl';
import CarbonPointsDisplay from '../components/CarbonPointsDisplay';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardScreen: React.FC = () => {
  const { carbonIntensity, applianceState, carbonPoints, loading, error, fetchDashboardData } = useGreenMachine();

  if (loading && !carbonIntensity) { // Show full page loader only on initial load
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  if (error && !carbonIntensity) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {loading && <div className="fixed top-20 right-6 z-50"><LoadingSpinner /></div>}
      <CarbonIntensityDisplay intensityData={carbonIntensity} />
      <ApplianceControl applianceState={applianceState} />
      <RecommendedTimeSlots timeSlots={carbonIntensity?.forecastedPeriods || []} />
      <CarbonPointsDisplay points={carbonPoints} />

      <div className="mt-8 p-4 bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border border-green-dark">
        <h3 className="text-lg font-semibold text-green-dark mb-2">Green Machine Tips:</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Enable 'Auto Control' in Settings to let Green Machine optimize appliance usage.</li>
          <li>Link your appliance (simulated) to earn more Carbon Points.</li>
          <li>Check recommended time slots for the lowest carbon impact when running manually.</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardScreen;
    