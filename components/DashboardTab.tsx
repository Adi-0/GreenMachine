
import React from 'react';
import CarbonIntensityDisplay from './CarbonIntensityDisplay';
import RecommendedSlots from './RecommendedSlots';
import ApplianceControl from './ApplianceControl';
import PointsDisplay from './PointsDisplay';
import AdBanner from './AdBanner';
import GeminiTip from './GeminiTip';
import { CarbonIntensityLevel, Appliance as ApplianceType } from '../types';

interface DashboardTabProps {
  carbonIntensity: CarbonIntensityLevel;
  mainAppliance: ApplianceType;
  points: number;
  currentTip: string;
  isLoadingTip: boolean;
  apiKeyAvailable: boolean;
  onToggleAppliance: (applianceId: string) => void;
  onLinkMachine: () => void;
  onFetchNewTip: () => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({
  carbonIntensity,
  mainAppliance,
  points,
  currentTip,
  isLoadingTip,
  apiKeyAvailable,
  onToggleAppliance,
  onLinkMachine,
  onFetchNewTip,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Left Column / Main Content Area */}
      <div className="lg:col-span-2 space-y-6 lg:space-y-8">
        <CarbonIntensityDisplay level={carbonIntensity} />
        <ApplianceControl
          appliance={mainAppliance}
          onToggle={onToggleAppliance}
          onLinkMachine={onLinkMachine}
        />
        <RecommendedSlots currentIntensity={carbonIntensity} />
      </div>

      {/* Right Column / Sidebar */}
      <div className="space-y-6 lg:space-y-8">
        <PointsDisplay points={points} />
        <GeminiTip
          tip={currentTip}
          isLoading={isLoadingTip}
          onFetchNewTip={onFetchNewTip}
          apiKeyAvailable={apiKeyAvailable}
        />
        <AdBanner />
      </div>
    </div>
  );
};

export default DashboardTab;
