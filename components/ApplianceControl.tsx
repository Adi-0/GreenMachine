
import React from 'react';
import { Appliance } from '../types';
import { PowerIcon, LinkIcon } from './icons';

interface ApplianceControlProps {
  appliance: Appliance;
  onToggle: (applianceId: string) => void;
  onLinkMachine: () => void;
}

const ApplianceControl: React.FC<ApplianceControlProps> = ({ appliance, onToggle, onLinkMachine }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">{appliance.name} Status</h3>
      <div className="flex items-center justify-between mb-6">
        <p className={`text-lg font-medium ${appliance.isOn ? 'text-green-600' : 'text-red-600'}`}>
          {appliance.isOn ? 'ON' : 'OFF'}
        </p>
        <button
          onClick={() => onToggle(appliance.id)}
          className={`p-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 ${
            appliance.isOn 
            ? 'bg-red-500 hover:bg-red-600 focus:ring-red-400' 
            : 'bg-green-500 hover:bg-green-600 focus:ring-green-400'
          } text-white`}
          aria-label={appliance.isOn ? `Turn ${appliance.name} Off` : `Turn ${appliance.name} On`}
        >
          <PowerIcon className="w-6 h-6" />
        </button>
      </div>
      
      <button
        onClick={onLinkMachine}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <LinkIcon className="w-5 h-5 mr-2" />
        Link Machine (Demo)
      </button>
    </div>
  );
};

export default ApplianceControl;
    