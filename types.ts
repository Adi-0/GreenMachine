
export enum CarbonIntensityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface CarbonIntensityData {
  currentLevel: CarbonIntensityLevel;
  currentValue: number; // gCO2eq/kWh
  unit: string;
  forecastedPeriods: OptimalTimeSlot[];
}

export interface OptimalTimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  intensity: CarbonIntensityLevel;
  intensityValue: number; // gCO2eq/kWh
}

export interface ApplianceState {
  isOn: boolean;
  controlledBy: 'manual' | 'auto';
  lastChanged?: Date;
}

export interface UserPreferences {
  autoControlEnabled: boolean;
  applianceLinked: boolean;
  notifications: {
    bestTimeAlerts: boolean;
    statusChanges: boolean;
  };
  region: string; // e.g., "US-California"
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface GreenMachineContextType {
  carbonIntensity: CarbonIntensityData | null;
  applianceState: ApplianceState;
  userPreferences: UserPreferences;
  carbonPoints: number;
  loading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
  toggleApplianceManually: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  showToast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
  // Add toasts to the context type so ToastContainer can access it
  toasts: ToastMessage[];
}