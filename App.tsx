
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import NotificationsPanel from './components/NotificationsPanel';
import DashboardTab from './components/DashboardTab';
import AnalyticsTab from './components/AnalyticsTab';
import SettingsTab from './components/SettingsTab';
import { HomeIcon, ChartBarIcon, CogIcon } from './components/icons';

import { CarbonIntensityLevel, NotificationMessage, Appliance, AppTab } from './types';
import { fetchEnergySavingTip } from './services/geminiService';
import { 
  POINTS_LOW_INTENSITY, 
  POINTS_MEDIUM_INTENSITY, 
  POINTS_HIGH_INTENSITY,
  NOTIFICATION_TIMEOUT_MS,
  INTENSITY_UPDATE_INTERVAL_MS
} from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Dashboard);
  const [carbonIntensity, setCarbonIntensity] = useState<CarbonIntensityLevel>(CarbonIntensityLevel.LOW);
  const [mainAppliance, setMainAppliance] = useState<Appliance>({ id: 'washingMachine', name: 'Washing Machine', isOn: false });
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [currentTip, setCurrentTip] = useState<string>('');
  const [isLoadingTip, setIsLoadingTip] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  
  const apiKey = process.env.API_KEY;

  const addNotification = useCallback((message: string, type: NotificationMessage['type']) => {
    if (!notificationsEnabled) return;

    const newNotification: NotificationMessage = {
      id: Date.now().toString() + Math.random().toString(),
      message,
      type,
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, NOTIFICATION_TIMEOUT_MS);
  }, [notificationsEnabled]);

  const handleFetchTip = useCallback(async () => {
    setIsLoadingTip(true);
    const tip = await fetchEnergySavingTip();
    setCurrentTip(tip);
    setIsLoadingTip(false);
    if (tip && tip.toLowerCase().includes("failed to fetch") && !tip.toLowerCase().includes("api key not configured")) {
        addNotification(tip, 'error');
    }
  }, [addNotification]);

  useEffect(() => {
    handleFetchTip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const intensityLevels = [CarbonIntensityLevel.LOW, CarbonIntensityLevel.MEDIUM, CarbonIntensityLevel.HIGH];
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % intensityLevels.length;
      setCarbonIntensity(intensityLevels[currentIndex]);
    }, INTENSITY_UPDATE_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const handleToggleAppliance = useCallback((applianceId: string) => {
    if (applianceId !== mainAppliance.id) return;

    const newIsOnState = !mainAppliance.isOn;
    setMainAppliance(prev => ({ ...prev, isOn: newIsOnState }));

    if (newIsOnState) {
      addNotification(`${mainAppliance.name} turned ON.`, 'info');
      let awardedPoints = 0;
      let messageType: NotificationMessage['type'] = 'info';
      let pointMessage = "";

      if (carbonIntensity === CarbonIntensityLevel.LOW) {
        awardedPoints = POINTS_LOW_INTENSITY;
        pointMessage = `Great choice! +${awardedPoints} points for using during low carbon intensity.`;
        messageType = 'success';
      } else if (carbonIntensity === CarbonIntensityLevel.MEDIUM) {
        awardedPoints = POINTS_MEDIUM_INTENSITY;
        pointMessage = `Good effort! +${awardedPoints} points for using during medium carbon intensity.`;
        messageType = 'success';
      } else {
        awardedPoints = POINTS_HIGH_INTENSITY;
        pointMessage = `Consider waiting. Appliance running during high carbon intensity. No points awarded.`;
        messageType = 'warning';
      }
      setPoints(prev => prev + awardedPoints);
      if (pointMessage) addNotification(pointMessage, messageType);

    } else {
      addNotification(`${mainAppliance.name} turned OFF.`, 'info');
    }
  }, [mainAppliance, carbonIntensity, addNotification]);

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleLinkMachine = () => {
    addNotification("Attempting to link to [Dummy Washing Machine]...", 'info');
    setTimeout(() => {
      addNotification("Successfully linked to [Dummy Washing Machine]! (Demo)", 'success');
    }, 1500);
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
    addNotification(notificationsEnabled ? 'Notifications Disabled' : 'Notifications Enabled', 'info');
  };

  const handleUpdateApplianceName = (newName: string) => {
    setMainAppliance(prev => ({ ...prev, name: newName }));
    addNotification(`Appliance name updated to "${newName}".`, 'success');
  };
  
  const handleLinkSmartPlug = () => {
    addNotification("Smart plug integration is coming soon!", 'info');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case AppTab.Dashboard:
        return (
          <DashboardTab
            carbonIntensity={carbonIntensity}
            mainAppliance={mainAppliance}
            points={points}
            currentTip={currentTip}
            isLoadingTip={isLoadingTip}
            apiKeyAvailable={!!apiKey}
            onToggleAppliance={handleToggleAppliance}
            onLinkMachine={handleLinkMachine}
            onFetchNewTip={handleFetchTip}
          />
        );
      case AppTab.Analytics:
        return <AnalyticsTab points={points} />;
      case AppTab.Settings:
        return (
          <SettingsTab
            notificationsEnabled={notificationsEnabled}
            onToggleNotifications={handleToggleNotifications}
            currentApplianceName={mainAppliance.name}
            onUpdateApplianceName={handleUpdateApplianceName}
            onLinkSmartPlug={handleLinkSmartPlug}
          />
        );
      default:
        return null;
    }
  };

  const tabs = [
    { name: AppTab.Dashboard, label: 'Dashboard', icon: HomeIcon },
    { name: AppTab.Analytics, label: 'Analytics', icon: ChartBarIcon },
    { name: AppTab.Settings, label: 'Settings', icon: CogIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <NotificationsPanel notifications={notifications} onDismiss={handleDismissNotification} />
      
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-center space-x-4 sm:space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`inline-flex items-center px-2 py-2 sm:px-4 sm:py-3 border-b-2 font-medium text-sm leading-5 transition-colors duration-150 ease-in-out focus:outline-none
                  ${activeTab === tab.name 
                    ? 'border-green-500 text-green-600 focus:border-green-700' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
                  }`}
                aria-current={activeTab === tab.name ? 'page' : undefined}
              >
                <tab.icon className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 ${activeTab === tab.name ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {renderTabContent()}
      </main>
      
      <footer className="bg-gray-800 text-white text-center p-4 text-sm">
        © {new Date().getFullYear()} Green Machine. Save energy, save the planet.
      </footer>
    </div>
  );
};

export default App;
