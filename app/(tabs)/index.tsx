import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { db } from '@/app/(tabs)/firebaseConfig';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import { Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import { onValue, ref } from 'firebase/database';

export default function HomeScreen() {
  const router = useRouter();
  const accentColor = useThemeColor({}, 'accent');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const tintColor = useThemeColor({}, 'tint');

  const [totalLocations, setTotalLocations] = useState(0);
  const [locationsSaved, setLocationsSaved] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allPoints, setAllPoints] = useState<any[]>([]); // New state to store all points

  // Ambil data dari Firebase
  useEffect(() => {
    const pointsRef = ref(db, 'points/');
    const unsubscribe = onValue(pointsRef, (snapshot: any) => {
            const data = snapshot.val();
            if (data) {
              const pointsArray = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
              }));
              setAllPoints(pointsArray); // Store all points with their details
      
              setTotalLocations(pointsArray.length);
              setLocationsSaved(pointsArray.length);
      
              // Count favorites
              const favorites = pointsArray.filter(point => point.isFavorite === true);
              setFavoriteCount(favorites.length);
            } else {
              setAllPoints([]); // Clear all points if no data
              setTotalLocations(0);
              setLocationsSaved(0);
              setFavoriteCount(0);
            }      setLoading(false);
    }, (error: any) => {
      console.error('Error reading from Firebase:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const highlights = [
    { 
      label: 'Total Catatan', 
      value: totalLocations.toString(), 
      icon: '📍', 
      desc: 'catatan perjalanan tersimpan',
      source: 'Database Real-time'
    },
    { 
      label: 'Favorit', 
      value: favoriteCount.toString(), 
      icon: '❤️', 
      desc: 'catatan favorit',
      source: 'Database Real-time'
    },
  ];

  const features = [
  { 
    icon: 'book', 
    title: 'Catatan Perjalanan', 
    description: 'Lihat seluruh catatan perjalanan wisata Anda', 
    color: tintColor,
    onPress: () => router.push('/(tabs)/lokasi')
  },
  { 
    icon: 'pen', 
    title: 'Tulis Catatan Baru', 
    description: 'Buat catatan wisata baru dengan foto dan cerita', 
    color: accentColor,
    onPress: () => router.push('/forminputlocation')
  },
  { 
    icon: 'map-marked-alt', 
    title: 'Destinasi Favorit', 
    description: 'Lihat destinasi favorit Anda', 
    color: accentColor,
    onPress: () => router.push('/favorit')
  },
];


  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Header dengan Logo */}
      <ThemedView style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <ThemedText style={[Typography.h1]}>WorldTravel</ThemedText>
          <ThemedText style={[Typography.h2, { color: accentColor, marginLeft: Spacing.sm }]}>Journey</ThemedText>
        </View>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
        />
      </ThemedView>

      {/* Tagline */}
      <Card variant="elevated" style={styles.taglineCard}>
        <ThemedText style={[Typography.h4]}>Catatan Perjalanan Wisata</ThemedText>
<ThemedText style={[Typography.body, { marginTop: Spacing.md, opacity: 0.8 }]}>
  Catat pengalaman wisata Anda mulai dari lokasi yang dikunjungi hingga rencana trip selanjutnya.
</ThemedText>

      </Card>

      {/* Highlight Stats */}
      <ThemedView style={styles.statsContainer}>
        <ThemedText style={[Typography.h4, { marginBottom: Spacing.lg }]}>Statistik Aplikasi</ThemedText>
        <View style={styles.statsGrid}>
          {highlights.map((item, index) => (
            <Card key={index} variant="outlined" style={styles.statCard}>
              <ThemedText style={[Typography.h3]}>{item.icon}</ThemedText>
              <ThemedText style={[Typography.h3, { marginTop: Spacing.sm }]}>{item.value}</ThemedText>
              <ThemedText style={[Typography.caption, { marginTop: Spacing.xs, opacity: 0.7 }]}>
                {item.label}
              </ThemedText>
              <ThemedText style={[Typography.caption, { marginTop: Spacing.xs, opacity: 0.5, fontSize: 9 }]}>
                {item.desc}
              </ThemedText>
            </Card>
          ))}
        </View>
      </ThemedView>

      {/* Fitur-Fitur */}
      <ThemedView style={styles.featuresSection}>
        <ThemedText style={[Typography.h4, { marginBottom: Spacing.lg }]}>Fitur</ThemedText>
        {features.map((feature, index) => (
          <TouchableOpacity 
            key={index}
            onPress={feature.onPress}
            activeOpacity={0.7}
          >
            <Card variant="elevated" style={styles.featureCard}>
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                  <FontAwesome5 name={feature.icon} size={24} color={feature.color} />
                </View>
                <View style={styles.featureInfo}>
                  <ThemedText style={[Typography.bodySemibold]}>{feature.title}</ThemedText>
                  <ThemedText style={[Typography.caption, { marginTop: Spacing.xs, opacity: 0.7 }]}>
                    {feature.description}
                  </ThemedText>
                </View>
                <FontAwesome5 name="chevron-right" size={16} color={feature.color} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ThemedView>


      {/* Info Aplikasi */}
      <Card variant="outlined" style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <ThemedText style={[Typography.h3]}>ℹ️</ThemedText>
          <ThemedText style={[Typography.h4, { marginLeft: Spacing.md, flex: 1 }]}>
            Tentang Aplikasi
          </ThemedText>
        </View>
        <ThemedText style={[Typography.body, { marginTop: Spacing.md }]}>
          WorldTravel Journey adalah solusi digital untuk para travelers yang ingin mencatat keindahan pariwisata secara maksimal dengan fitur navigasi dan penyimpanan favorit.
        </ThemedText>
      </Card>

      {/* Footer */}
      <ThemedView style={styles.footer}>
        <ThemedText style={[Typography.caption, { textAlign: 'center', opacity: 0.6 }]}>
          WorldTravel Journey v1.0.0
        </ThemedText>
        <ThemedText style={[Typography.caption, { textAlign: 'center', opacity: 0.6, marginTop: Spacing.sm }]}>
          Dibuat Oleh: Zahra Khusnul Khotimah
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  taglineCard: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  statsContainer: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  featuresSection: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  featureCard: {
    marginHorizontal: 0,
    marginVertical: Spacing.sm,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  quickActionsSection: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  infoCard: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  imageGallerySection: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  imageGalleryContainer: {
    paddingBottom: Spacing.md,
  },
  imageGalleryItem: {
    marginRight: Spacing.md,
    width: 120, // Adjust as needed
  },
  galleryImage: {
    width: '100%',
    height: 100, // Adjust as needed
    borderRadius: 8,
    resizeMode: 'cover',
  },
  imageCaption: {
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});
