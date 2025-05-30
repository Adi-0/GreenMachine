
export enum CarbonIntensityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface TimeSlot {
  id: string;
  period: string;
  intensity: CarbonIntensityLevel;
  recommendation: string;
}

export interface NotificationMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface Appliance {
  id: string;
  name: string;
  isOn: boolean;
}

export enum AppTab {
  Dashboard = 'DASHBOARD',
  Analytics = 'ANALYTICS',
  Settings = 'SETTINGS',
}
