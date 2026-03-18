import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Colors } from '../constants/colors';

export const Banner = () => (
  <View style={styles.container}>
    <View style={styles.inner}>
      <Text style={styles.fox}>🦊</Text>
      <View>
        <Text style={styles.title}>FOXY</Text>
        <Text style={styles.sub}>Nhanh – Uy tín – Bảo hành 3 tháng</Text>
      </View>
    </View>
    <Text style={styles.badge}>Nâng cấp quyền lợi</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    margin: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  fox: { fontSize: 42 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  sub: { color: '#FFCDD2', fontSize: 12, marginTop: 2 },
  badge: {
    backgroundColor: Colors.secondary,
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
});
