
import React, { useState, useEffect } from 'react';
import { CogIcon, LinkIcon } from './icons';

interface SettingsTabProps {
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  currentApplianceName: string;
  onUpdateApplianceName: (newName: string) => void;
  onLinkSmartPlug: () => void; // Placeholder for actual linking
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  notificationsEnabled,
  onToggleNotifications,
  currentApplianceName,
  onUpdateApplianceName,
  onLinkSmartPlug,
}) => {
  const [applianceNameInput, setApplianceNameInput] = useState(currentApplianceName);

  useEffect(() => {
    setApplianceNameInput(currentApplianceName);
  }, [currentApplianceName]);

  const handleNameSave = () => {
    if (applianceNameInput.trim() && applianceNameInput.trim() !== currentApplianceName) {
      onUpdateApplianceName(applianceNameInput.trim());
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <CogIcon className="w-7 h-7 mr-2 text-green-600" />
          App Settings
        </h2>

        {/* Notification Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Notifications</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <span className="text-gray-600">Enable App Notifications</span>
            <button
              onClick={onToggleNotifications}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                notificationsEnabled ? 'bg-green-500 focus:ring-green-400' : 'bg-gray-300 focus:ring-gray-400'
              }`}
              aria-pressed={notificationsEnabled}
            >
              <span className="sr-only">Enable notifications</span>
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Appliance Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Appliance Configuration</h3>
          <div className="p-4 bg-gray-50 rounded-md space-y-3">
            <label htmlFor="applianceName" className="block text-sm font-medium text-gray-600">
              Primary Appliance Name
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                id="applianceName"
                value={applianceNameInput}
                onChange={(e) => setApplianceNameInput(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="e.g., Washing Machine"
              />
              <button
                onClick={handleNameSave}
                disabled={applianceNameInput.trim() === currentApplianceName || !applianceNameInput.trim()}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
        
        {/* Smart Integrations */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Smart Integrations</h3>
          <div className="p-4 bg-gray-50 rounded-md">
             <button
                onClick={onLinkSmartPlug}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LinkIcon className="w-5 h-5 mr-2 text-blue-500" />
                Link Smart Plug Account (Coming Soon)
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">Connect to TP-Link, Shelly, etc. to enable automatic appliance control.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsTab;
