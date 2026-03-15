import { getDb } from './db';

export const runMigrations = (): void => {
  const db = getDb();

  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS device_models (
      id INTEGER PRIMARY KEY,
      device_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      FOREIGN KEY (device_id) REFERENCES devices(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      device_id INTEGER NOT NULL,
      device_name TEXT NOT NULL,
      model_id INTEGER NOT NULL,
      model_name TEXT NOT NULL,
      issues TEXT NOT NULL DEFAULT '[]',
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      scheduled_at TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      estimated_cost INTEGER NOT NULL DEFAULT 0,
      warranty_months INTEGER NOT NULL DEFAULT 3,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
};
