import { DEVICES, DEVICE_MODELS } from '../constants/devices';
import { getDb } from './db';

export const seedDatabase = (): void => {
  const db = getDb();

  // Check if already seeded
  const row = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM devices'
  );
  if (row && row.count > 0) return;

  // Seed devices
  for (const device of DEVICES) {
    db.runSync(
      'INSERT OR IGNORE INTO devices (id, name, icon) VALUES (?, ?, ?)',
      [device.id, device.name, device.icon]
    );
  }

  // Seed device models
  for (const model of DEVICE_MODELS) {
    db.runSync(
      'INSERT OR IGNORE INTO device_models (id, device_id, name) VALUES (?, ?, ?)',
      [model.id, model.deviceId, model.name]
    );
  }
};
