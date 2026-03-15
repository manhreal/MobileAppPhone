import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { OrderCard } from '../components/OrderCard';
import { Colors } from '../constants/colors';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { Order } from '../types';

type Tab = 'history' | 'warranty';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { orders, loadOrders } = useOrderStore();
  const [activeTab, setActiveTab] = useState<Tab>('history');

  useEffect(() => {
    if (user) loadOrders(user.id);
  }, [user]);

  const doneOrders = orders.filter((o) => o.status === 'done');
  const warrantyOrders = doneOrders; // In demo: all done orders have warranty

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn chắc muốn đăng xuất?', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView>
        {/* Profile header */}
        <View style={styles.header}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'K'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.phone}>{user?.phone}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Stat label="Tổng đơn" value={String(orders.length)} />
          <Stat label="Hoàn thành" value={String(doneOrders.length)} />
          <Stat label="Đang sửa" value={String(orders.filter((o) => o.status === 'processing').length)} />
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TabBtn active={activeTab === 'history'} label="Lịch sử đơn" onPress={() => setActiveTab('history')} />
          <TabBtn active={activeTab === 'warranty'} label="Bảo hành" onPress={() => setActiveTab('warranty')} />
        </View>

        {/* Content */}
        {activeTab === 'history' ? (
          orders.length === 0 ? (
            <EmptyState icon="receipt-long" text="Chưa có đơn nào" />
          ) : (
            orders.map((o) => <OrderCard key={o.id} order={o} />)
          )
        ) : warrantyOrders.length === 0 ? (
          <EmptyState icon="verified-user" text="Chưa có bảo hành nào" />
        ) : (
          warrantyOrders.map((o) => <WarrantyCard key={o.id} order={o} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.stat}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const TabBtn = ({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) => (
  <TouchableOpacity
    style={[styles.tab, active && styles.tabActive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const EmptyState = ({ icon, text }: { icon: keyof typeof MaterialIcons.glyphMap; text: string }) => (
  <View style={styles.empty}>
    <MaterialIcons name={icon} size={52} color={Colors.border} />
    <Text style={styles.emptyText}>{text}</Text>
  </View>
);

const WarrantyCard = ({ order }: { order: Order }) => {
  const issues: string[] = JSON.parse(order.issues || '[]');
  const endDate = new Date(order.createdAt);
  endDate.setMonth(endDate.getMonth() + order.warrantyMonths);

  return (
    <View style={styles.warrantyCard}>
      <View style={styles.warrantyHeader}>
        <MaterialIcons name="verified-user" size={20} color={Colors.success} />
        <Text style={styles.warrantyTitle}>{order.modelName}</Text>
      </View>
      <Text style={styles.warrantyIssues}>{issues.join(', ')}</Text>
      <View style={styles.warrantyFooter}>
        <Text style={styles.warrantyLabel}>Hết hạn bảo hành:</Text>
        <Text style={styles.warrantyDate}>{endDate.toLocaleDateString('vi-VN')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    gap: 14,
  },
  avatarBox: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  name: { fontSize: 17, fontWeight: 'bold', color: Colors.text },
  phone: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  logoutBtn: { padding: 8 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 1,
    paddingVertical: 16,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: Colors.primary },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: Colors.border,
    borderRadius: 12,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: '#fff', elevation: 2 },
  tabText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: Colors.primary },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: Colors.textSecondary, marginTop: 12, fontSize: 14 },
  warrantyCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
    elevation: 2,
  },
  warrantyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  warrantyTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  warrantyIssues: { fontSize: 13, color: Colors.textSecondary },
  warrantyFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  warrantyLabel: { fontSize: 12, color: Colors.textSecondary },
  warrantyDate: { fontSize: 12, fontWeight: '700', color: Colors.success },
});
