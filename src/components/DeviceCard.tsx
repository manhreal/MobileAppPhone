import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Device } from '../types';
import { Colors } from '../constants/colors';

interface Props {
  device: Device;
  onPress: () => void;
}

const ICON_COLORS = ['#E53935', '#1E88E5', '#43A047'];

export const DeviceCard = ({ device, onPress }: Props) => {
  const color = ICON_COLORS[(device.id - 1) % ICON_COLORS.length];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.iconBox, { backgroundColor: color + '18' }]}>
        <MaterialIcons name={device.icon as any} size={36} color={color} />
      </View>
      <Text style={styles.name}>{device.name}</Text>
      <MaterialIcons name="chevron-right" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});
