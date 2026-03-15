import { getDb } from '../database/db';
import { User } from '../types';

export const findOrCreateUser = (phone: string): User => {
  const db = getDb();

  const existing = db.getFirstSync<{
    id: number; phone: string; name: string; created_at: string;
  }>('SELECT * FROM users WHERE phone = ?', [phone]);

  if (existing) {
    return {
      id: existing.id,
      phone: existing.phone,
      name: existing.name || `Khách ${phone.slice(-4)}`,
      createdAt: existing.created_at,
    };
  }

  const result = db.runSync(
    'INSERT INTO users (phone, name) VALUES (?, ?)',
    [phone, `Khách ${phone.slice(-4)}`]
  );

  return {
    id: result.lastInsertRowId,
    phone,
    name: `Khách ${phone.slice(-4)}`,
    createdAt: new Date().toISOString(),
  };
};

export const updateUserName = (userId: number, name: string): void => {
  const db = getDb();
  db.runSync('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
};
