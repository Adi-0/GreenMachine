
import React from 'react';
import { useGreenMachine } from '../contexts/GreenMachineContext';
import type { ApplianceState } from '../types';

interface ApplianceControlProps {
  applianceState: ApplianceState;
}

const PowerIcon = ({ isOn }: { isOn: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 mr-2 ${isOn ? 'text-green-500' : 'text-red-500'}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
  </svg>
);

const ApplianceControl: React.FC<ApplianceControlProps> = ({ applianceState }) => {
  const { toggleApplianceManually, loading, userPreferences } = useGreenMachine();

  const { isOn, controlledBy } = applianceState;
  const statusText = isOn ? 'ON' : 'OFF';
  const statusColor = isOn ? 'text-green-500' : 'text-red-500';
  const buttonText = isOn ? 'Turn OFF Manually' : 'Turn ON Manually';
  const buttonColor = isOn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600';

  return (
    <div className="p-6 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl border border-green-dark">
      <h3 className="text-xl font-semibold text-green-dark mb-3">Appliance Status (e.g., Washing Machine)</h3>
      <div className="flex items-center mb-4">
        <PowerIcon isOn={isOn} />
        <p className={`text-2xl font-bold ${statusColor}`}>{statusText}</p>
      </div>
      <p className="text-sm text-gray-600 mb-1">
        Currently controlled by: <span className="font-semibold">{controlledBy}</span>
      </p>
      {userPreferences.autoControlEnabled && controlledBy === 'auto' && (
         <p className="text-xs text-green-dark mb-3">Green Machine is managing this appliance.</p>
      )}
      {!userPreferences.applianceLinked && (
        <p className="text-xs text-yellow-600 mb-3 p-2 bg-yellow-100 rounded-md">
          Appliance not linked. Manual control only. Link in Settings to enable full features.
        </p>
      )}

      <button
        onClick={toggleApplianceManually}
        disabled={loading || (controlledBy === 'auto' && userPreferences.autoControlEnabled)}
        className={`w-full ${buttonColor} text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-150 ease-in-out
                    disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2
                    focus:outline-none focus:ring-2 focus:ring-offset-2 ${isOn ? 'focus:ring-red-400' : 'focus:ring-green-400'}`}
      >
        <PowerIcon isOn={!isOn} /> {/* Icon shows action to be taken */}
        <span>{buttonText}</span>
      </button>
      {controlledBy === 'auto' && userPreferences.autoControlEnabled && (
        <p className="text-xs text-gray-500 mt-2">Manual override is disabled when Auto Control is active. Disable in Settings to control manually.</p>
      )}
    </div>
  );
};

export default ApplianceControl;
    