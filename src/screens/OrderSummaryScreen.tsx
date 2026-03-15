import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import { Colors } from '../constants/colors';
import { HomeStackParamList, Order } from '../types';
import { getOrderById } from '../services/orderService';

type Route = RouteProp<HomeStackParamList, 'OrderSummary'>;
type Nav = StackNavigationProp<HomeStackParamList, 'OrderSummary'>;

export default function OrderSummaryScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const o = getOrderById(route.params.orderId);
    setOrder(o);
  }, []);

  if (!order) return null;

  const issues: string[] = JSON.parse(order.issues || '[]');

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Success header */}
        <View style={styles.successBox}>
          <Text style={styles.fox}>🦊</Text>
          <Text style={styles.successTitle}>Đặt dịch vụ thành công!</Text>
          <Text style={styles.successSub}>
            Cáo Con đang tới quý khách, vui lòng{'\n'}theo dõi đơn và kiểm tra thông tin bên dưới nhé!
          </Text>
        </View>

        {/* Order info card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin đơn #{order.id}</Text>
          <Row label="Thiết bị" value={`${order.deviceName} · ${order.modelName}`} />
          <Row label="Lỗi" value={issues.join(', ')} />
          <Row label="Khách hàng" value={order.customerName} />
          <Row label="Điện thoại" value={order.phone} />
          <Row label="Địa chỉ" value={order.address} />
          <Row label="Thời gian" value={order.scheduledAt} />
          {order.note ? <Row label="Ghi chú" value={order.note} /> : null}
        </View>

        {/* Cost & warranty */}
        <View style={styles.costCard}>
          <View style={styles.costRow}>
            <View style={styles.costItem}>
              <MaterialIcons name="attach-money" size={24} color={Colors.primary} />
              <Text style={styles.costLabel}>Chi phí dự kiến</Text>
              <Text style={styles.costValue}>
                {order.estimatedCost.toLocaleString('vi-VN')}₫
              </Text>
            </View>
            <View style={styles.dividerV} />
            <View style={styles.costItem}>
              <MaterialIcons name="verified-user" size={24} color={Colors.success} />
              <Text style={styles.costLabel}>Bảo hành</Text>
              <Text style={[styles.costValue, { color: Colors.success }]}>
                {order.warrantyMonths} tháng
              </Text>
            </View>
          </View>
          <Text style={styles.costNote}>* Chi phí thực tế sau khi kỹ thuật viên kiểm tra</Text>
        </View>

        {/* Status */}
        <View style={styles.statusBox}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Đơn đang chờ kỹ thuật viên xác nhận</Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('HomeMain')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Về trang chủ</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 16, paddingBottom: 40 },
  successBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    elevation: 2,
  },
  fox: { fontSize: 56, marginBottom: 8 },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  successSub: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 8,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowLabel: { width: 100, fontSize: 13, color: Colors.textSecondary },
  rowValue: { flex: 1, fontSize: 13, color: Colors.text, fontWeight: '500' },
  costCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  costRow: { flexDirection: 'row', alignItems: 'center' },
  costItem: { flex: 1, alignItems: 'center', gap: 4 },
  dividerV: { width: 1, height: 60, backgroundColor: Colors.border },
  costLabel: { fontSize: 12, color: Colors.textSecondary },
  costValue: { fontSize: 17, fontWeight: 'bold', color: Colors.primary },
  costNote: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', marginTop: 10 },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '18',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  statusDot: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.warning,
  },
  statusText: { fontSize: 13, color: Colors.warning, fontWeight: '600' },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
