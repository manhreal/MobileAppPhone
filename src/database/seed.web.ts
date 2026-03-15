/**
 * Web: seed data vào localStorage nếu chưa có.
 */
import { DEVICES, DEVICE_MODELS } from '../constants/devices';
import { getDb } from './db';

export const seedDatabase = (): void => {
  const db = getDb();

  const existing = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM devices'
  );
  if (existing && existing.count > 0) return;

  for (const device of DEVICES) {
    db.runSync(
      'INSERT OR IGNORE INTO devices (id, name, icon) VALUES (?, ?, ?)',
      [device.id, device.name, device.icon]
    );
  }

  for (const model of DEVICE_MODELS) {
    db.runSync(
      'INSERT OR IGNORE INTO device_models (id, device_id, name) VALUES (?, ?, ?)',
      [model.id, model.deviceId, model.name]
    );
  }
};
