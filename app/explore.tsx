import { db } from '@/app/(tabs)/firebaseConfig';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import { Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { onValue, ref } from 'firebase/database';

export default function ExploreScreen() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const accentColor = useThemeColor({}, 'accent');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');

  const [locations, setLocations] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pointsRef = ref(db, 'points/');
    const unsubscribe = onValue(pointsRef, (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const locs = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setLocations(locs.slice(0, 6)); // Top 6 locations
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const categories = [
    { icon: '🏖️', label: 'Pantai', color: tintColor, count: 12 },
    { icon: '🏛️', label: 'Budaya', color: accentColor, count: 8 },
    { icon: '🍜', label: 'Kuliner', color: successColor, count: 15 },
    { icon: '🌿', label: 'Alam', color: warningColor, count: 10 },
  ];

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText style={[Typography.h2, { fontWeight: 'bold' }]}>
            🔎 Jelajahi
          </ThemedText>
          <ThemedText style={[Typography.body, { marginTop: Spacing.sm, opacity: 0.7 }]}>
            Temukan catatan destinasi wisata yang telah dibuat
          </ThemedText>
        </ThemedView>

      {/* Search Banner */}
      <TouchableOpacity 
        onPress={() => router.push('/(tabs)/search')}
        style={styles.searchBanner}
      >
        <FontAwesome5 name="search" size={20} color="#999" style={{ marginRight: Spacing.md }} />
        <ThemedText style={[Typography.body, { opacity: 0.6, flex: 1 }]}>
          Cari destinasi...
        </ThemedText>
        <FontAwesome5 name="sliders-h" size={18} color={tintColor} />
      </TouchableOpacity>

      {/* Categories */}
      <ThemedView style={styles.section}>
        <ThemedText style={[Typography.h4, { marginBottom: Spacing.lg }]}>
          Kategori Wisata
        </ThemedText>
        <View style={styles.categoriesGrid}>
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.categoryCard, { borderColor: cat.color }]}
              onPress={() => router.push('/(tabs)/search')}
            >
              <ThemedText style={{ fontSize: 32, marginBottom: Spacing.sm }}>
                {cat.icon}
              </ThemedText>
              <ThemedText style={[Typography.bodySemibold]}>
                {cat.label}
              </ThemedText>
              <ThemedText style={[Typography.caption, { marginTop: Spacing.xs, opacity: 0.6 }]}>
                {cat.count} tempat
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      {/* Featured Destinations */}
      <ThemedView style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={[Typography.h4]}>⭐ Destinasi Unggulan</ThemedText>
          <TouchableOpacity onPress={() => router.push('/(tabs)/lokasi')}>
            <ThemedText style={[Typography.caption, { color: tintColor }]}>
              Lihat Semua →
            </ThemedText>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : locations.length > 0 ? (
          <View style={{ gap: Spacing.md }}>
            {locations.map((loc: any) => (
              <TouchableOpacity
                key={loc.id}
                onPress={() => router.push('/(tabs)/lokasi')}
              >
                <Card variant="elevated">
                  <View style={styles.destinationCard}>
                    <View style={styles.destInfo}>
                      <ThemedText style={[Typography.bodySemibold, { fontSize: 16 }]}>
                        📍 {loc.name}
                      </ThemedText>
                      <ThemedText style={[Typography.caption, { marginTop: Spacing.xs, opacity: 0.7 }]}>
                        {loc.coordinates}
                      </ThemedText>
                      {loc.isFavorite && (
                        <View style={styles.favoriteBadge}>
                          <FontAwesome5 name="heart" size={12} color="white" solid />
                          <ThemedText style={[Typography.caption, { color: 'white', marginLeft: 4 }]}>
                            Favorit
                          </ThemedText>
                        </View>
                      )}
                    </View>
                    <FontAwesome5 name="chevron-right" size={18} color={tintColor} />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <ThemedText style={[Typography.body, { textAlign: 'center', marginVertical: Spacing.lg }]}>
            Belum ada destinasi
          </ThemedText>
        )}
      </ThemedView>

      {/* Quick Tips */}
      <ThemedView style={styles.section}>
        <ThemedText style={[Typography.h4, { marginBottom: Spacing.lg }]}>
          💡 Tips Perjalanan
        </ThemedText>
        <Card variant="outlined" style={styles.tipCard}>
          <View style={styles.tipItem}>
            <FontAwesome5 name="lightbulb" size={20} color={warningColor} />
            <View style={{ marginLeft: Spacing.md, flex: 1 }}>
              <ThemedText style={[Typography.bodySemibold]}>
                Pantai Terbaik
              </ThemedText>
              <ThemedText style={[Typography.caption, { marginTop: 4, opacity: 0.7 }]}>
                Kunjungi saat sunrise untuk melihat keindahan maksimal
              </ThemedText>
            </View>
          </View>
        </Card>
        <Card variant="outlined" style={styles.tipCard}>
          <View style={styles.tipItem}>
            <FontAwesome5 name="lightbulb" size={20} color={successColor} />
            <View style={{ marginLeft: Spacing.md, flex: 1 }}>
              <ThemedText style={[Typography.bodySemibold]}>
                Makanan Lokal
              </ThemedText>
              <ThemedText style={[Typography.caption, { marginTop: 4, opacity: 0.7 }]}>
                Coba warung lokal untuk pengalaman kuliner autentik
              </ThemedText>
            </View>
          </View>
        </Card>
      </ThemedView>

      {/* CTA Button */}
      <ThemedView style={styles.ctaSection}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/(tabs)/search')}
        >
          <FontAwesome5 name="search" size={18} color="white" />
          <ThemedText style={[Typography.bodySemibold, { color: 'white', marginLeft: Spacing.md }]}>
            Mulai Jelajahi
          </ThemedText>
          <FontAwesome5 name="arrow-right" size={16} color="white" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  searchBanner: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  destinationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  destInfo: {
    flex: 1,
  },
  favoriteBadge: {
    flexDirection: 'row',
    backgroundColor: '#ff4444',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: Spacing.xs,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  tipCard: {
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ctaSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  ctaButton: {
    backgroundColor: '#0275d8',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
