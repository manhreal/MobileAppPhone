import React, { useLayoutEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import { showAlert } from '../store/useAlertStore';
import { ISSUES } from '../constants/devices';
import { Colors } from '../constants/colors';
import { HomeStackParamList, Issue } from '../types';

type Route = RouteProp<HomeStackParamList, 'ScanIssue'>;
type Nav = StackNavigationProp<HomeStackParamList, 'ScanIssue'>;

const formatPrice = (price: number) =>
  price.toLocaleString('vi-VN') + 'đ';

export default function ScanIssueScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { deviceId, deviceName, modelId, modelName } = route.params;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [scanning, setScanning] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={headerStyles.scanBtn}
          onPress={handleScan}
          activeOpacity={0.8}
        >
          <MaterialIcons name="qr-code-scanner" size={16} color="#fff" />
          <Text style={headerStyles.scanText}>Quét lỗi</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleScan = () => {
    setScanning(true);
    showAlert('Quét lỗi', 'Đang phân tích thiết bị... Tính năng AI Scan sẽ sớm ra mắt!');
    setTimeout(() => setScanning(false), 1000);
  };

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleNext = () => {
    if (selected.size === 0) {
      showAlert('Chọn lỗi', 'Vui lòng chọn ít nhất một lỗi máy');
      return;
    }
    const issues: Issue[] = ISSUES.filter((i) => selected.has(i.id));
    navigation.navigate('ServiceForm', { deviceId, deviceName, modelId, modelName, issues });
  };

  const totalPrice = ISSUES.filter((i) => selected.has(i.id))
    .reduce((sum, i) => sum + i.price, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={ISSUES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerBox}>
            <Text style={styles.sub}>{deviceName} · {modelName}</Text>
            <Text style={styles.title}>Máy đang gặp lỗi gì?</Text>
            <Text style={styles.hint}>Chọn tất cả lỗi bạn đang gặp phải</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = selected.has(item.id);
          return (
            <TouchableOpacity
              style={[styles.item, isSelected && styles.itemSelected]}
              onPress={() => toggle(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.itemLeft}>
                <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                  {item.label}
                </Text>
                {isSelected && (
                  <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
                )}
              </View>
              <View style={styles.itemRight}>
                {!isSelected && (
                  <Text style={styles.priceDim}>{formatPrice(item.price)}</Text>
                )}
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <MaterialIcons name="check" size={16} color="#fff" />}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListFooterComponent={
          <View>
            {selected.size > 0 && (
              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Tổng dự tính:</Text>
                <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.button, selected.size === 0 && styles.buttonDisabled]}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>
                Tiếp tục đặt dịch vụ {selected.size > 0 ? `(${selected.size} lỗi)` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const headerStyles = StyleSheet.create({
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 12,
    gap: 4,
  },
  scanText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16 },
  headerBox: { marginBottom: 16 },
  sub: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginBottom: 4 },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  hint: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  itemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '40',
  },
  itemLeft: { flex: 1 },
  itemText: { fontSize: 15, color: Colors.text },
  itemTextSelected: { color: Colors.primary, fontWeight: '600' },
  priceText: { fontSize: 13, color: Colors.primary, fontWeight: '700', marginTop: 3 },
  itemRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priceDim: { fontSize: 13, color: Colors.textSecondary },
  checkbox: {
    width: 24, height: 24, borderRadius: 6,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  totalLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  totalPrice: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
    elevation: 2,
  },
  buttonDisabled: { backgroundColor: Colors.disabled },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
