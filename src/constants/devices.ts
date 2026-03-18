import { Device, DeviceModel, Issue } from '../types';

export const DEVICES: Device[] = [
  { id: 1, name: 'iPhone', icon: 'phone-iphone' },
  { id: 2, name: 'Android', icon: 'android' },
  { id: 3, name: 'Laptop', icon: 'laptop' },
];

export const DEVICE_MODELS: DeviceModel[] = [
  // iPhone
  { id: 1, deviceId: 1, name: 'iPhone 15 Pro Max' },
  { id: 2, deviceId: 1, name: 'iPhone 15 Pro' },
  { id: 3, deviceId: 1, name: 'iPhone 15' },
  { id: 4, deviceId: 1, name: 'iPhone 14 Pro Max' },
  { id: 5, deviceId: 1, name: 'iPhone 14' },
  { id: 6, deviceId: 1, name: 'iPhone 13 Pro Max' },
  { id: 7, deviceId: 1, name: 'iPhone 13' },
  { id: 8, deviceId: 1, name: 'iPhone 12' },
  { id: 9, deviceId: 1, name: 'iPhone 11' },
  // Android
  { id: 10, deviceId: 2, name: 'Samsung Galaxy S24 Ultra' },
  { id: 11, deviceId: 2, name: 'Samsung Galaxy A55' },
  { id: 12, deviceId: 2, name: 'Xiaomi 14 Ultra' },
  { id: 13, deviceId: 2, name: 'Xiaomi Redmi Note 13' },
  { id: 14, deviceId: 2, name: 'Oppo Find X7' },
  { id: 15, deviceId: 2, name: 'Oppo Reno 11' },
  // Laptop
  { id: 16, deviceId: 3, name: 'MacBook Pro M3' },
  { id: 17, deviceId: 3, name: 'MacBook Air M2' },
  { id: 18, deviceId: 3, name: 'Dell XPS 15' },
  { id: 19, deviceId: 3, name: 'Dell Inspiron 15' },
  { id: 20, deviceId: 3, name: 'HP Envy x360' },
  { id: 21, deviceId: 3, name: 'Asus ZenBook Pro' },
  { id: 22, deviceId: 3, name: 'Asus VivoBook 15' },
];

export const ISSUES: Issue[] = [
  { id: 'broken_screen', label: 'Vỡ màn hình', price: 800000 },
  { id: 'touch_issue', label: 'Loạn cảm ứng', price: 350000 },
  { id: 'battery_weak', label: 'Pin yếu', price: 250000 },
  { id: 'no_power', label: 'Không lên nguồn', price: 500000 },
  { id: 'speaker_issue', label: 'Lỗi loa / mic', price: 300000 },
  { id: 'overheating', label: 'Máy nóng', price: 200000 },
  { id: 'water_damage', label: 'Vào nước', price: 700000 },
  { id: 'camera_issue', label: 'Lỗi camera', price: 450000 },
  { id: 'charging_issue', label: 'Không sạc được', price: 300000 },
];
