import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import { Colors } from '../constants/colors';
import { showAlert } from '../store/useAlertStore';
import { HomeStackParamList } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { createOrder } from '../services/orderService';

type Route = RouteProp<HomeStackParamList, 'ServiceForm'>;
type Nav = StackNavigationProp<HomeStackParamList, 'ServiceForm'>;

type TimeMode = 'now' | 'schedule';

export default function ServiceFormScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { deviceId, deviceName, modelId, modelName, issues } = route.params;

  const user = useAuthStore((s) => s.user);
  const addOrder = useOrderStore((s) => s.addOrder);

  const [customerName, setCustomerName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState('');
  const [timeMode, setTimeMode] = useState<TimeMode>('now');
  const [scheduledAt, setScheduledAt] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const getScheduledValue = () => {
    if (timeMode === 'now') return 'Ngay bây giờ';
    return scheduledAt.trim();
  };

  const handleSubmit = () => {
    const timeValue = getScheduledValue();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      showAlert('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường bắt buộc (*)');
      return;
    }
    if (timeMode === 'schedule' && !scheduledAt.trim()) {
      showAlert('Thiếu thông tin', 'Vui lòng nhập thời gian hẹn');
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      const order = createOrder({
        userId: user.id,
        deviceId,
        deviceName,
        modelId,
        modelName,
        issues,
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        scheduledAt: timeValue,
        note: note.trim(),
      });
      addOrder(order);
      navigation.navigate('OrderSummary', { orderId: order.id });
    } catch (e) {
      showAlert('Lỗi', 'Không thể tạo đơn, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
        {/* Summary chip */}
        <View style={styles.chip}>
          <Text style={styles.chipText}>{deviceName} · {modelName}</Text>
          <Text style={styles.chipSub}>{issues.map((i) => i.label).join(', ')}</Text>
        </View>

        {/* Fields */}
        <Field label="Họ tên *" value={customerName} onChangeText={setCustomerName} placeholder="Nguyễn Văn A" />
        <Field label="Số điện thoại *" value={phone} onChangeText={setPhone} placeholder="09xxxxxxxx" keyboardType="phone-pad" />
        <Field label="Địa chỉ đến sửa *" value={address} onChangeText={setAddress} placeholder="Số nhà, đường, phường, quận..." multiline />

        {/* Time selector */}
        <View style={styles.field}>
          <Text style={styles.label}>Thời gian mong muốn *</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, timeMode === 'now' && styles.toggleBtnActive]}
              onPress={() => setTimeMode('now')}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="flash-on"
                size={16}
                color={timeMode === 'now' ? '#fff' : Colors.textSecondary}
              />
              <Text style={[styles.toggleText, timeMode === 'now' && styles.toggleTextActive]}>
                Ngay bây giờ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, timeMode === 'schedule' && styles.toggleBtnActive]}
              onPress={() => setTimeMode('schedule')}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="schedule"
                size={16}
                color={timeMode === 'schedule' ? '#fff' : Colors.textSecondary}
              />
              <Text style={[styles.toggleText, timeMode === 'schedule' && styles.toggleTextActive]}>
                Hẹn giờ
              </Text>
            </TouchableOpacity>
          </View>
          {timeMode === 'schedule' && (
            <TextInput
              style={styles.input}
              value={scheduledAt}
              onChangeText={setScheduledAt}
              placeholder="VD: Sáng mai 8h, hoặc 15/03 buổi chiều"
              placeholderTextColor={Colors.textSecondary}
            />
          )}
        </View>

        <Field label="Ghi chú thêm" value={note} onChangeText={setNote} placeholder="Mật khẩu máy, ghi chú khác..." multiline />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>{loading ? 'Đang xử lý...' : '🦊  Đặt dịch vụ ngay'}</Text>
        </TouchableOpacity>

        <Text style={styles.techCareLabel}>
          🛡️ Repair with peace of mind with Tech Care insurance
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad';
  multiline?: boolean;
}

const Field = ({ label, value, onChangeText, placeholder, keyboardType = 'default', multiline }: FieldProps) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.inputMulti]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.textSecondary}
      keyboardType={keyboardType}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 16, paddingBottom: 40 },
  chip: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  chipText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  chipSub: { color: '#FFCDD2', fontSize: 12, marginTop: 2 },
  field: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 8,
  },
  inputMulti: { minHeight: 80, paddingTop: 12 },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: '#fff',
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  toggleTextActive: { color: '#fff' },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
  },
  buttonDisabled: { backgroundColor: Colors.disabled },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  techCareLabel: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 14,
    lineHeight: 18,
  },
});
