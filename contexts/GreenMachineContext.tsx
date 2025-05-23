
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { GreenMachineContextType, CarbonIntensityData, ApplianceState, UserPreferences, ToastMessage } from '../types';
import { CarbonIntensityLevel } from '../types';
import * as GreenMachineService from '../services/greenMachineService';
import { DEFAULT_REGION, TOAST_DEFAULT_DURATION } from '../constants';

const initialPreferences: UserPreferences = {
  autoControlEnabled: false,
  applianceLinked: false,
  notifications: {
    bestTimeAlerts: true,
    statusChanges: true,
  },
  region: DEFAULT_REGION,
};

const initialApplianceState: ApplianceState = {
  isOn: false,
  controlledBy: 'manual',
};

const GreenMachineContext = createContext<GreenMachineContextType | undefined>(undefined);

export const GreenMachineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [carbonIntensity, setCarbonIntensity] = useState<CarbonIntensityData | null>(null);
  const [applianceState, setApplianceState] = useState<ApplianceState>(initialApplianceState);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(initialPreferences);
  const [carbonPoints, setCarbonPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info', duration: number = TOAST_DEFAULT_DURATION) => {
    const id = new Date().toISOString() + Math.random();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [intensityData, appState, prefs, points] = await Promise.all([
        GreenMachineService.getCarbonIntensity(userPreferences.region),
        GreenMachineService.getApplianceStatus(),
        GreenMachineService.getPreferences(),
        GreenMachineService.getUserCarbonPoints(),
      ]);
      setCarbonIntensity(intensityData);
      setApplianceState(appState);
      setUserPreferences(prefs);
      setCarbonPoints(points);

      // Simulate automatic control decision based on new data
      if (prefs.autoControlEnabled && intensityData.currentLevel === CarbonIntensityLevel.LOW && !appState.isOn) {
         const newAppState = await GreenMachineService.toggleAppliance('auto');
         setApplianceState(newAppState);
         const newPoints = await GreenMachineService.getUserCarbonPoints();
         setCarbonPoints(newPoints);
         if (prefs.notifications.statusChanges) {
            showToast(`Appliance turned ON automatically (low carbon). Points earned!`, 'success');
         }
      } else if (prefs.autoControlEnabled && intensityData.currentLevel !== CarbonIntensityLevel.LOW && appState.isOn && appState.controlledBy === 'auto') {
         const newAppState = await GreenMachineService.toggleAppliance('auto'); // will turn off
         setApplianceState(newAppState);
         if (prefs.notifications.statusChanges) {
            showToast(`Appliance turned OFF automatically (carbon intensity increased).`, 'info');
         }
      }


    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPreferences.region, showToast]); // Add showToast here, but be careful with autoControlEnabled logic

  useEffect(() => {
    fetchDashboardData();
    // Set up an interval to periodically refresh carbon intensity and check auto-control
    const intervalId = setInterval(async () => {
        try {
            const intensityData = await GreenMachineService.getCarbonIntensity(userPreferences.region);
            setCarbonIntensity(intensityData);

            // Check for optimal time notifications
            const optimalNow = intensityData.forecastedPeriods.find(p => {
                const now = new Date();
                return p.intensity === CarbonIntensityLevel.LOW && now >= p.startTime && now <= p.endTime;
            });
            if (optimalNow && userPreferences.notifications.bestTimeAlerts) {
                showToast(`Optimal time to run appliance now: Low carbon intensity!`, 'info');
            }

            // Re-evaluate auto control based on new intensity
            const currentAppState = await GreenMachineService.getApplianceStatus(); // get latest state
            const currentPrefs = await GreenMachineService.getPreferences(); // get latest prefs
            
            if (currentPrefs.autoControlEnabled && intensityData.currentLevel === CarbonIntensityLevel.LOW && !currentAppState.isOn) {
                const newAppState = await GreenMachineService.toggleAppliance('auto');
                setApplianceState(newAppState);
                const newPoints = await GreenMachineService.getUserCarbonPoints();
                setCarbonPoints(newPoints);
                 if (currentPrefs.notifications.statusChanges) {
                    showToast(`Appliance turned ON automatically (low carbon). Points earned!`, 'success');
                 }
            } else if (currentPrefs.autoControlEnabled && intensityData.currentLevel !== CarbonIntensityLevel.LOW && currentAppState.isOn && currentAppState.controlledBy === 'auto') {
                const newAppState = await GreenMachineService.toggleAppliance('auto');
                setApplianceState(newAppState);
                if (currentPrefs.notifications.statusChanges) {
                    showToast(`Appliance turned OFF automatically (carbon intensity increased).`, 'info');
                }
            }
            
        } catch (err) {
            console.error("Error in interval refresh:", err);
            // Optionally show a non-intrusive error
        }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPreferences.region, showToast]); // fetchDashboardData is not needed here as it's called once then interval takes over for relevant parts.

  const toggleApplianceManually = async () => {
    setLoading(true);
    setError(null);
    try {
      const newAppState = await GreenMachineService.toggleAppliance('manual');
      setApplianceState(newAppState);
      if (userPreferences.notifications.statusChanges) {
        showToast(`Appliance manually turned ${newAppState.isOn ? 'ON' : 'OFF'}.`, 'info');
      }
      // If turned on manually during low carbon, still give points? For demo, let's say yes.
      if (newAppState.isOn && carbonIntensity?.currentLevel === CarbonIntensityLevel.LOW) {
        const newPoints = await GreenMachineService.awardCarbonPoints();
        setCarbonPoints(newPoints);
        showToast(`Bonus points for manual ON during low carbon!`, 'success');
      }
    } catch (err) {
      console.error("Error toggling appliance:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle appliance.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (prefsToUpdate: Partial<UserPreferences>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPrefs = await GreenMachineService.updatePreferences(prefsToUpdate);
      setUserPreferences(updatedPrefs);
      showToast('Preferences updated successfully!', 'success');
      // If autoControlEnabled changed, we might need to re-evaluate appliance state
      if (prefsToUpdate.autoControlEnabled !== undefined) {
        fetchDashboardData(); // Re-fetch to apply new auto-control logic
      }
    } catch (err) {
      console.error("Error updating preferences:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update preferences.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const contextValue = {
    carbonIntensity,
    applianceState,
    userPreferences,
    carbonPoints,
    loading,
    error,
    fetchDashboardData,
    toggleApplianceManually,
    updatePreferences,
    showToast,
    toasts // Export toasts for ToastContainer
  };

  return (
    <GreenMachineContext.Provider value={contextValue}>
      {children}
    </GreenMachineContext.Provider>
  );
};

export const useGreenMachine = (): GreenMachineContextType => {
  const context = useContext(GreenMachineContext);
  if (context === undefined) {
    throw new Error('useGreenMachine must be used within a GreenMachineProvider');
  }
  return context;
};
    