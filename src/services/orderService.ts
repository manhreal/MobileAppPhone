import { getDb } from '../database/db';
import { Issue, Order, OrderStatus } from '../types';

interface CreateOrderParams {
  userId: number;
  deviceId: number;
  deviceName: string;
  modelId: number;
  modelName: string;
  issues: Issue[];
  customerName: string;
  phone: string;
  address: string;
  scheduledAt: string;
  note: string;
}

const randomCost = (): number => {
  // Random 200,000 – 1,000,000 VND (bội số 50k)
  const min = 4;  // 4 * 50k = 200k
  const max = 20; // 20 * 50k = 1,000k
  return (Math.floor(Math.random() * (max - min + 1)) + min) * 50000;
};

export const createOrder = (params: CreateOrderParams): Order => {
  const db = getDb();
  const cost = randomCost();
  const warranty = 3;

  const result = db.runSync(
    `INSERT INTO orders
      (user_id, device_id, device_name, model_id, model_name, issues,
       customer_name, phone, address, scheduled_at, note,
       estimated_cost, warranty_months, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      params.userId,
      params.deviceId,
      params.deviceName,
      params.modelId,
      params.modelName,
      JSON.stringify(params.issues.map((i) => i.label)),
      params.customerName,
      params.phone,
      params.address,
      params.scheduledAt,
      params.note,
      cost,
      warranty,
    ]
  );

  return getOrderById(result.lastInsertRowId)!;
};

export const getOrderById = (id: number): Order | null => {
  const db = getDb();
  const row = db.getFirstSync<any>(
    'SELECT * FROM orders WHERE id = ?',
    [id]
  );
  if (!row) return null;
  return mapRow(row);
};

export const getOrdersByUser = (userId: number): Order[] => {
  const db = getDb();
  const rows = db.getAllSync<any>(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows.map(mapRow);
};

const mapRow = (row: any): Order => ({
  id: row.id,
  userId: row.user_id,
  deviceId: row.device_id,
  deviceName: row.device_name,
  modelId: row.model_id,
  modelName: row.model_name,
  issues: row.issues,
  customerName: row.customer_name,
  phone: row.phone,
  address: row.address,
  scheduledAt: row.scheduled_at,
  note: row.note,
  estimatedCost: row.estimated_cost,
  warrantyMonths: row.warranty_months,
  status: row.status as OrderStatus,
  createdAt: row.created_at,
});
