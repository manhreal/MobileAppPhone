import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface Coupon {
  id: string;
  code: string;
  title: string;
  desc: string;
  discount: string;
  expiry: string;
  color: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const COUPONS: Coupon[] = [
  {
    id: '1',
    code: 'FOXY10',
    title: 'Giảm 10% toàn bộ dịch vụ',
    desc: 'Áp dụng cho tất cả dịch vụ sửa chữa',
    discount: '-10%',
    expiry: '31/03/2026',
    color: '#E53935',
    icon: 'local-offer',
  },
  {
    id: '2',
    code: 'NEWUSER50K',
    title: 'Tặng 50.000đ cho khách mới',
    desc: 'Chỉ áp dụng cho đơn đầu tiên',
    discount: '-50K',
    expiry: '30/04/2026',
    color: '#FF8F00',
    icon: 'card-giftcard',
  },
  {
    id: '3',
    code: 'SCREEN20',
    title: 'Giảm 20% thay màn hình',
    desc: 'Áp dụng khi thay màn hình iPhone/Android',
    discount: '-20%',
    expiry: '15/04/2026',
    color: '#1565C0',
    icon: 'phone-android',
  },
  {
    id: '4',
    code: 'BATTERY30K',
    title: 'Giảm 30.000đ thay pin',
    desc: 'Áp dụng cho dịch vụ thay pin các loại',
    discount: '-30K',
    expiry: '30/04/2026',
    color: '#2E7D32',
    icon: 'battery-charging-full',
  },
  {
    id: '5',
    code: 'FREECHECK',
    title: 'Kiểm tra máy miễn phí',
    desc: 'Miễn phí kiểm tra tình trạng máy, không giới hạn',
    discount: 'FREE',
    expiry: '31/12/2026',
    color: '#6A1B9A',
    icon: 'verified-user',
  },
];

export default function PromotionsScreen() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Ưu đãi dành cho bạn</Text>
        <Text style={styles.pageHint}>Nhấn vào mã để sao chép và dùng khi đặt dịch vụ</Text>

        {COUPONS.map((coupon) => (
          <View key={coupon.id} style={[styles.card, { borderLeftColor: coupon.color }]}>
            <View style={[styles.discountBadge, { backgroundColor: coupon.color }]}>
              <Text style={styles.discountText}>{coupon.discount}</Text>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <MaterialIcons name={coupon.icon} size={18} color={coupon.color} />
                <Text style={styles.cardTitle}>{coupon.title}</Text>
              </View>
              <Text style={styles.cardDesc}>{coupon.desc}</Text>

              <View style={styles.cardFooter}>
                <TouchableOpacity
                  style={[styles.codeBox, { borderColor: coupon.color }]}
                  onPress={() => handleCopy(coupon.code)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.codeText, { color: coupon.color }]}>
                    {copied === coupon.code ? '✓ Đã sao chép!' : coupon.code}
                  </Text>
                  {copied !== coupon.code && (
                    <MaterialIcons name="content-copy" size={14} color={coupon.color} />
                  )}
                </TouchableOpacity>
                <Text style={styles.expiry}>HSD: {coupon.expiry}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.notice}>
          <MaterialIcons name="info-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.noticeText}>
            Mỗi mã chỉ dùng một lần. Không áp dụng cùng lúc nhiều mã.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 16, paddingBottom: 32 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  pageHint: { fontSize: 13, color: Colors.textSecondary, marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 14,
    borderLeftWidth: 5,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  discountBadge: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  cardBody: { flex: 1, padding: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, flex: 1 },
  cardDesc: { fontSize: 12, color: Colors.textSecondary, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderStyle: 'dashed',
  },
  codeText: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  expiry: { fontSize: 11, color: Colors.textSecondary },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  noticeText: { fontSize: 12, color: Colors.textSecondary, flex: 1, lineHeight: 18 },
});
