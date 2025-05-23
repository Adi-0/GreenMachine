
import React from 'react';
import { useGreenMachine } from '../contexts/GreenMachineContext';
import type { UserPreferences } from '../types';
import { MOCK_REGIONS } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';

// SVG Icons for Toggles
const ToggleOnIcon = () => (
  <svg className="w-14 h-8 text-green-DEFAULT" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ToggleOffIcon = () => (
  <svg className="w-14 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);


const SettingsScreen: React.FC = () => {
  const { userPreferences, updatePreferences, loading, showToast } = useGreenMachine();

  const handlePreferenceChange = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    updatePreferences({ [key]: value });
  };

  const handleNotificationChange = <K extends keyof UserPreferences['notifications']>(
    key: K,
    value: UserPreferences['notifications'][K]
  ) => {
    updatePreferences({ 
      notifications: { 
        ...userPreferences.notifications, 
        [key]: value 
      } 
    });
  };

  const handleLinkAppliance = () => {
    const newLinkedState = !userPreferences.applianceLinked;
    updatePreferences({ applianceLinked: newLinkedState });
    showToast(newLinkedState ? 'Appliance linked (simulated)!' : 'Appliance unlinked (simulated).', 'info');
  }

  return (
    <div className="space-y-6 p-4 bg-white/90 backdrop-blur-md shadow-xl rounded-xl border border-green-DEFAULT">
      <h2 className="text-3xl font-bold text-green-dark mb-6 pb-2 border-b-2 border-green-light">Settings</h2>
      
      {loading && <div className="absolute inset-0 bg-white/50 flex justify-center items-center z-10"><LoadingSpinner /></div>}

      <div className="space-y-4">
        {/* Auto Control */}
        <div className="flex items-center justify-between p-3 bg-gray-light rounded-lg shadow">
          <span className="font-medium text-gray-700">Enable Automatic Control</span>
          <button
            onClick={() => handlePreferenceChange('autoControlEnabled', !userPreferences.autoControlEnabled)}
            className="focus:outline-none"
            aria-pressed={userPreferences.autoControlEnabled}
            aria-label="Toggle automatic control"
          >
            {userPreferences.autoControlEnabled ? <ToggleOnIcon /> : <ToggleOffIcon />}
          </button>
        </div>

        {/* Appliance Linking */}
        <div className="p-3 bg-gray-light rounded-lg shadow">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Appliance Linked</span>
             <button
                onClick={handleLinkAppliance}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${userPreferences.applianceLinked 
                    ? 'bg-green-DEFAULT text-white hover:bg-green-dark' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {userPreferences.applianceLinked ? 'Unlink Appliance' : 'Link Appliance'}
              </button>
          </div>
          {userPreferences.applianceLinked && <p className="text-xs text-green-dark mt-1">Appliance successfully linked (simulation).</p>}
           <p className="text-xs text-gray-500 mt-1">This is a simulated feature to demonstrate UI. No real hardware is connected.</p>
        </div>
        
        {/* Region Selection */}
        <div className="p-3 bg-gray-light rounded-lg shadow">
          <label htmlFor="region-select" className="block font-medium text-gray-700 mb-1">Region for Carbon Data</label>
          <select
            id="region-select"
            value={userPreferences.region}
            onChange={(e) => handlePreferenceChange('region', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-DEFAULT focus:border-green-DEFAULT"
          >
            {MOCK_REGIONS.map(region => (
              <option key={region.value} value={region.value}>{region.label}</option>
            ))}
          </select>
           <p className="text-xs text-gray-500 mt-1">Affects simulated carbon intensity data.</p>
        </div>

        {/* Notification Settings */}
        <div className="p-3 bg-gray-light rounded-lg shadow">
          <h3 className="font-medium text-gray-700 mb-2">Notification Preferences (Simulated)</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Alerts for best time to run</span>
              <button
                onClick={() => handleNotificationChange('bestTimeAlerts', !userPreferences.notifications.bestTimeAlerts)}
                className="focus:outline-none"
                aria-pressed={userPreferences.notifications.bestTimeAlerts}
                aria-label="Toggle best time alerts"
              >
                {userPreferences.notifications.bestTimeAlerts ? <ToggleOnIcon /> : <ToggleOffIcon />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Appliance status change alerts</span>
              <button
                onClick={() => handleNotificationChange('statusChanges', !userPreferences.notifications.statusChanges)}
                className="focus:outline-none"
                aria-pressed={userPreferences.notifications.statusChanges}
                aria-label="Toggle status change alerts"
              >
                {userPreferences.notifications.statusChanges ? <ToggleOnIcon /> : <ToggleOffIcon />}
              </button>
            </div>
             <p className="text-xs text-gray-500 mt-1">Notifications are displayed as in-app toasts for this demo.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
    