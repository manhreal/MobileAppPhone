import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { OrderCard } from '../components/OrderCard';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { Colors } from '../constants/colors';

export default function OrdersScreen() {
  const user = useAuthStore((s) => s.user);
  const { orders, loadOrders } = useOrderStore();

  useEffect(() => {
    if (user) loadOrders(user.id);
  }, [user]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.title}>Đơn của tôi</Text>}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="receipt-long" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>Chưa có đơn nào</Text>
            <Text style={styles.emptyHint}>Hãy đặt dịch vụ đầu tiên của bạn!</Text>
          </View>
        }
        renderItem={({ item }) => <OrderCard order={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, flexGrow: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.text, marginBottom: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { fontSize: 16, color: Colors.textSecondary, marginTop: 16, fontWeight: '600' },
  emptyHint: { fontSize: 13, color: Colors.disabled, marginTop: 4 },
});
