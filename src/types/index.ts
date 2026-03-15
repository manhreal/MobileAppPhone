// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  phone: string;
  name: string;
  createdAt: string;
}

// ─── Device ──────────────────────────────────────────────────────────────────
export interface Device {
  id: number;
  name: string;
  icon: string;
}

export interface DeviceModel {
  id: number;
  deviceId: number;
  name: string;
}

// ─── Issue ───────────────────────────────────────────────────────────────────
export interface Issue {
  id: string;
  label: string;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'processing' | 'done' | 'cancelled';

export interface Order {
  id: number;
  userId: number;
  deviceId: number;
  deviceName: string;
  modelId: number;
  modelName: string;
  issues: string;          // JSON array string
  customerName: string;
  phone: string;
  address: string;
  scheduledAt: string;
  note: string;
  estimatedCost: number;
  warrantyMonths: number;
  status: OrderStatus;
  createdAt: string;
}

// ─── Navigation Params ────────────────────────────────────────────────────────
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  DeviceModel: { deviceId: number; deviceName: string };
  ScanIssue: { deviceId: number; deviceName: string; modelId: number; modelName: string };
  ServiceForm: {
    deviceId: number;
    deviceName: string;
    modelId: number;
    modelName: string;
    issues: Issue[];
  };
  OrderSummary: { orderId: number };
};
