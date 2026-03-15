import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import { DEVICE_MODELS } from '../constants/devices';
import { Colors } from '../constants/colors';
import { HomeStackParamList } from '../types';

type Route = RouteProp<HomeStackParamList, 'DeviceModel'>;
type Nav = StackNavigationProp<HomeStackParamList, 'DeviceModel'>;

export default function DeviceModelScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { deviceId, deviceName } = route.params;

  const models = DEVICE_MODELS.filter((m) => m.deviceId === deviceId);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={models}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.header}>Chọn dòng {deviceName} của bạn</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate('ScanIssue', {
                deviceId,
                deviceName,
                modelId: item.id,
                modelName: item.name,
              })
            }
            activeOpacity={0.8}
          >
            <Text style={styles.itemText}>{item.name}</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color={Colors.primary} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16 },
  header: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 12,
  },
  itemText: { fontSize: 15, color: Colors.text, fontWeight: '500' },
  separator: { height: 8 },
});
