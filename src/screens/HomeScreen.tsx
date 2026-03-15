import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Banner } from '../components/Banner';
import { DeviceCard } from '../components/DeviceCard';
import { DEVICES } from '../constants/devices';
import { Colors } from '../constants/colors';
import { HomeStackParamList } from '../types';
import { useAuthStore } from '../store/useAuthStore';

type Nav = StackNavigationProp<HomeStackParamList, 'HomeMain'>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.hello}>Xin chào 👋</Text>
          <Text style={styles.name}>{user?.name}</Text>
        </View>

        {/* Banner */}
        <Banner />

        {/* Device list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn thiết bị cần sửa</Text>
          {DEVICES.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onPress={() =>
                navigation.navigate('DeviceModel', {
                  deviceId: device.id,
                  deviceName: device.name,
                })
              }
            />
          ))}
        </View>

        {/* Info strip */}
        <View style={styles.infoStrip}>
          <InfoItem icon="🔧" label="Kỹ thuật viên" value="Chứng nhận chính hãng" />
          <InfoItem icon="⚡" label="Thời gian" value="Đến trong 60 phút" />
          <InfoItem icon="🛡️" label="Bảo hành" value="3 tháng linh kiện" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  greeting: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  hello: { fontSize: 14, color: Colors.textSecondary },
  name: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginTop: 2 },
  section: { marginTop: 8 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  infoStrip: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  infoItem: { flex: 1, alignItems: 'center', gap: 4 },
  infoIcon: { fontSize: 22 },
  infoLabel: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center' },
  infoValue: { fontSize: 10, color: Colors.primary, fontWeight: '600', textAlign: 'center' },
});
