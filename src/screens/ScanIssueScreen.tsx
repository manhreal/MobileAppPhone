import React, { useState } from 'react';
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

export default function ScanIssueScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { deviceId, deviceName, modelId, modelName } = route.params;

  const [selected, setSelected] = useState<Set<string>>(new Set());

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
              <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                {item.label}
              </Text>
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <MaterialIcons name="check" size={16} color="#fff" />}
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListFooterComponent={
          <TouchableOpacity
            style={[styles.button, selected.size === 0 && styles.buttonDisabled]}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>
              Tiếp tục đặt dịch vụ {selected.size > 0 ? `(${selected.size} lỗi)` : ''}
            </Text>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
}

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
  itemText: { fontSize: 15, color: Colors.text },
  itemTextSelected: { color: Colors.primary, fontWeight: '600' },
  checkbox: {
    width: 24, height: 24, borderRadius: 6,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
  },
  buttonDisabled: { backgroundColor: Colors.disabled },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
