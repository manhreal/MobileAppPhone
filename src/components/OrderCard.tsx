import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Order, OrderStatus } from '../types';
import { Colors } from '../constants/colors';

interface Props {
  order: Order;
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Chờ xử lý',
  processing: 'Đang sửa',
  done: 'Hoàn thành',
  cancelled: 'Đã huỷ',
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: Colors.warning,
  processing: '#1E88E5',
  done: Colors.success,
  cancelled: Colors.error,
};

export const OrderCard = ({ order }: Props) => {
  const issues: string[] = JSON.parse(order.issues || '[]');

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.device}>{order.modelName}</Text>
          <Text style={styles.deviceType}>{order.deviceName}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: STATUS_COLOR[order.status] + '20' }]}>
          <Text style={[styles.badgeText, { color: STATUS_COLOR[order.status] }]}>
            {STATUS_LABEL[order.status]}
          </Text>
        </View>
      </View>
      <View style={styles.divider} />
      <Text style={styles.label}>Lỗi:</Text>
      <Text style={styles.value}>{issues.join(', ') || '—'}</Text>
      <Text style={styles.label}>Địa chỉ:</Text>
      <Text style={styles.value}>{order.address}</Text>
      <View style={styles.footer}>
        <Text style={styles.cost}>
          {order.estimatedCost.toLocaleString('vi-VN')}₫
        </Text>
        <Text style={styles.date}>
          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  device: { fontSize: 15, fontWeight: '700', color: Colors.text },
  deviceType: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 10 },
  label: { fontSize: 11, color: Colors.textSecondary, marginTop: 4 },
  value: { fontSize: 13, color: Colors.text, marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  cost: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  date: { fontSize: 12, color: Colors.textSecondary },
});
