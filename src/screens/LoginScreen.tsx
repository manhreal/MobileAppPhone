import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { showAlert } from '../store/useAlertStore';
import { useAuthStore } from '../store/useAuthStore';
import { findOrCreateUser } from '../services/userService';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  const handleLogin = () => {
    const cleaned = phone.trim().replace(/\s/g, '');
    if (cleaned.length < 9 || cleaned.length > 11) {
      showAlert('Lỗi', 'Số điện thoại không hợp lệ');
      return;
    }
    setLoading(true);
    try {
      const user = findOrCreateUser(cleaned);
      setUser(user);
    } catch (e) {
      showAlert('Lỗi', 'Đăng nhập thất bại, thử lại nhé!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Logo */}
        <View style={styles.logoBox}>
          <Text style={styles.fox}>🦊</Text>
          <Text style={styles.brand}>FOXY</Text>
          <Text style={styles.tagline}>Đặt lịch sửa thiết bị tại nhà</Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại..."
            placeholderTextColor={Colors.textSecondary}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={11}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.hint}>
            Nhập số điện thoại để đăng nhập hoặc tạo tài khoản mới tự động
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoBox: { alignItems: 'center', marginBottom: 40 },
  fox: { fontSize: 72 },
  brand: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, marginTop: 8 },
  tagline: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  label: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.background,
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 2,
  },
  buttonDisabled: { backgroundColor: Colors.disabled },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  hint: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 16,
    lineHeight: 18,
  },
});
