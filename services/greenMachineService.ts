
import type { CarbonIntensityData, ApplianceState, UserPreferences, OptimalTimeSlot } from '../types';
import { CarbonIntensityLevel } from '../types';
import { API_SIMULATION_DELAY, DEFAULT_REGION, CARBON_POINTS_PER_GREEN_RUN, FORECAST_HOURS, INTENSITY_VALUE_LOW, INTENSITY_VALUE_MEDIUM, INTENSITY_VALUE_HIGH, INTENSITY_UNIT } from '../constants';

// --- In-memory "database" for simulation ---
let simulatedDB = {
  applianceState: {
    isOn: false,
    controlledBy: 'manual' as 'manual' | 'auto',
    lastChanged: new Date(),
  },
  userPreferences: {
    autoControlEnabled: false,
    applianceLinked: false,
    notifications: {
      bestTimeAlerts: true,
      statusChanges: true,
    },
    region: DEFAULT_REGION,
  },
  carbonPoints: 0,
  // For simulating carbon intensity changes over time
  carbonIntensityCycle: [CarbonIntensityLevel.HIGH, CarbonIntensityLevel.MEDIUM, CarbonIntensityLevel.LOW, CarbonIntensityLevel.MEDIUM],
  carbonIntensityIndex: 0,
};

// Helper to simulate API delay
const simulateApiCall = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), API_SIMULATION_DELAY));
};

// Helper to simulate error
const simulateApiError = <T,>(message: string): Promise<T> => {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), API_SIMULATION_DELAY));
};


const getSimulatedIntensityValue = (level: CarbonIntensityLevel): number => {
    switch(level) {
        case CarbonIntensityLevel.LOW: return INTENSITY_VALUE_LOW + Math.floor(Math.random() * 20) - 10; // e.g. 40-60
        case CarbonIntensityLevel.MEDIUM: return INTENSITY_VALUE_MEDIUM + Math.floor(Math.random() * 40) - 20; // e.g. 130-170
        case CarbonIntensityLevel.HIGH: return INTENSITY_VALUE_HIGH + Math.floor(Math.random() * 50) - 25; // e.g. 275-325
        default: return INTENSITY_VALUE_MEDIUM;
    }
}

// --- Simulated API Endpoints ---

export const getCarbonIntensity = async (region: string): Promise<CarbonIntensityData> => {
  // Cycle through intensity levels for demo
  simulatedDB.carbonIntensityIndex = (simulatedDB.carbonIntensityIndex + 1) % simulatedDB.carbonIntensityCycle.length;
  const currentLevel = simulatedDB.carbonIntensityCycle[simulatedDB.carbonIntensityIndex];
  const currentValue = getSimulatedIntensityValue(currentLevel);

  // Simulate forecasted periods
  const forecastedPeriods: OptimalTimeSlot[] = [];
  const now = new Date();
  let forecastCycleIndex = simulatedDB.carbonIntensityIndex;

  for (let i = 0; i < FORECAST_HOURS; i += 2) { // Create 2-hour slots
    const slotStartTime = new Date(now.getTime() + i * 60 * 60 * 1000);
    const slotEndTime = new Date(now.getTime() + (i + 2) * 60 * 60 * 1000);
    
    forecastCycleIndex = (forecastCycleIndex + Math.floor(Math.random()*2)+1) % simulatedDB.carbonIntensityCycle.length; // Make it a bit random
    const slotIntensity = simulatedDB.carbonIntensityCycle[forecastCycleIndex];
    const slotIntensityValue = getSimulatedIntensityValue(slotIntensity);

    forecastedPeriods.push({
      id: `forecast-${i}`,
      startTime: slotStartTime,
      endTime: slotEndTime,
      intensity: slotIntensity,
      intensityValue: slotIntensityValue,
    });
  }
  
  console.log(`Simulating carbon intensity for ${region}: ${currentLevel}`);
  return simulateApiCall({
    currentLevel,
    currentValue,
    unit: INTENSITY_UNIT,
    forecastedPeriods,
  });
};

export const getApplianceStatus = async (): Promise<ApplianceState> => {
  return simulateApiCall(simulatedDB.applianceState);
};

export const toggleAppliance = async (mode: 'manual' | 'auto'): Promise<ApplianceState> => {
  const wasOn = simulatedDB.applianceState.isOn;
  simulatedDB.applianceState.isOn = !simulatedDB.applianceState.isOn;
  simulatedDB.applianceState.controlledBy = mode;
  simulatedDB.applianceState.lastChanged = new Date();

  if (mode === 'auto' && simulatedDB.applianceState.isOn && !wasOn) {
    // Appliance turned ON by auto mode - likely due to low carbon
    simulatedDB.carbonPoints += CARBON_POINTS_PER_GREEN_RUN;
    console.log(`Simulated: Appliance turned ON by ${mode}. Carbon points: ${simulatedDB.carbonPoints}`);
  } else {
    console.log(`Simulated: Appliance turned ${simulatedDB.applianceState.isOn ? 'ON' : 'OFF'} by ${mode}.`);
  }
  
  // Simulate a small chance of error if trying to turn on when already on by other mode, for robustness demo
  // This is a conceptual demo of backend validation, not fully fleshed out.
  if (Math.random() < 0.05 && wasOn && simulatedDB.applianceState.isOn) { 
    // Revert and throw error
    simulatedDB.applianceState.isOn = wasOn;
    return simulateApiError('Simulated error: Appliance state conflict.');
  }

  return simulateApiCall(simulatedDB.applianceState);
};

export const getPreferences = async (): Promise<UserPreferences> => {
  return simulateApiCall(simulatedDB.userPreferences);
};

export const updatePreferences = async (prefsToUpdate: Partial<UserPreferences>): Promise<UserPreferences> => {
  simulatedDB.userPreferences = { ...simulatedDB.userPreferences, ...prefsToUpdate };
  if (prefsToUpdate.notifications) {
    simulatedDB.userPreferences.notifications = { ...simulatedDB.userPreferences.notifications, ...prefsToUpdate.notifications };
  }
  console.log('Simulated: Preferences updated', simulatedDB.userPreferences);
  return simulateApiCall(simulatedDB.userPreferences);
};

export const getUserCarbonPoints = async (): Promise<number> => {
  return simulateApiCall(simulatedDB.carbonPoints);
};

export const awardCarbonPoints = async (points: number = CARBON_POINTS_PER_GREEN_RUN): Promise<number> => {
  simulatedDB.carbonPoints += points;
  return simulateApiCall(simulatedDB.carbonPoints);
}

// --- Conceptual Abstraction for Smart Plug API ---
// This section is for demonstrating how one might abstract hardware interaction.
// In a real app, this would call actual smart plug APIs (TP-Link, Shelly, etc.)

interface SmartPlugAPI {
  turnOn(deviceId: string): Promise<boolean>;
  turnOff(deviceId: string): Promise<boolean>;
  getStatus(deviceId: string): Promise<'on' | 'off' | 'error'>;
}

// Example of a mock implementation
class MockSmartPlug implements SmartPlugAPI {
  private plugState: 'on' | 'off' = 'off';

  async turnOn(deviceId: string): Promise<boolean> {
    console.log(`(MockSmartPlug) Turning ON device: ${deviceId}`);
    this.plugState = 'on';
    return simulateApiCall(true);
  }
  async turnOff(deviceId: string): Promise<boolean> {
    console.log(`(MockSmartPlug) Turning OFF device: ${deviceId}`);
    this.plugState = 'off';
    return simulateApiCall(true);
  }
  async getStatus(deviceId: string): Promise<'on' | 'off' | 'error'> {
    console.log(`(MockSmartPlug) Getting status for device: ${deviceId}`);
    return simulateApiCall(this.plugState);
  }
}

// const myAppliancePlug = new MockSmartPlug();
// This instance could be used within `toggleAppliance` if we were to integrate it.
// For example:
// if (newState.isOn) { await myAppliancePlug.turnOn("washing-machine-01"); } 
// else { await myAppliancePlug.turnOff("washing-machine-01"); }
// This illustrates the abstraction point for different hardware.
    