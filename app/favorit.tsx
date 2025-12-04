import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LocationCard } from '@/components/ui/location-card';
import { Spacing, Typography } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, remove, update } from 'firebase/database';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';

export default function FavoritScreen() {
  const firebaseConfig = {
    apiKey: "AIzaSyCj4GAAaqgVzcteMmxz9tw1s_rbfTolJ54",
    authDomain: "reactnative-75982.firebaseapp.com",
    databaseURL: "https://reactnative-75982-default-rtdb.firebaseio.com",
    projectId: "reactnative-75982",
    storageBucket: "reactnative-75982.firebasestorage.app",
    messagingSenderId: "260606670385",
    appId: "1:260606670385:web:8d722c132046c90a890710"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const router = useRouter();

  const [sections, setSections] = useState<Array<{title: string; data: any[]}>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handlePress = (coordinates: string): void => {
    // @ts-ignore
    const [latitude, longitude] = coordinates.split(',').map((coord: string) => coord.trim());
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  // @ts-ignore
  const handleEdit = (item): void => {
    router.push({
      pathname: "/formeditlocation",
      params: {
        id: item.id,
        name: item.name,
        coordinates: item.coordinates,
        accuration: item.accuration || ''
      }
    });
  };

  // @ts-ignore
  const handleDelete = (id): void => {
    Alert.alert(
      "Hapus Lokasi",
      "Apakah Anda yakin ingin menghapus lokasi ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          onPress: () => {
            const pointRef = ref(db, `points/${id}`);
            remove(pointRef);
          },
          style: "destructive"
        }
      ]
    );
  };

  // @ts-ignore
  const handleToggleFavorite = (id, isFavorite): void => {
    const pointRef = ref(db, `points/${id}`);
    update(pointRef, {
      isFavorite: !isFavorite
    }).catch((err: any) => {
      console.error('Error updating favorite:', err);
    });
  };

  useEffect(() => {
    const pointsRef = ref(db, 'points/');
    const unsubscribe = onValue(pointsRef, (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const pointsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).filter(item => item.isFavorite); // Filter for favorite items
        setSections([{ title: 'Destinasi Favorit', data: pointsArray }]);
      } else {
        setSections([]);
      }
      setLoading(false);
    }, (error: any) => {
      console.error(error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      {sections.length > 0 && sections[0].data.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <LocationCard
                name={item.name}
                coordinates={item.coordinates}
                accuracy={item.accuration}
                isFavorite={item.isFavorite || false}
                onPress={() => handlePress(item.coordinates)}
                onRoute={() => handlePress(item.coordinates)}
                onFavorite={() => handleToggleFavorite(item.id, item.isFavorite || false)}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item.id)}
              />
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <ThemedText style={[Typography.h4, styles.header]}>
              {title}
            </ThemedText>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: Spacing.xxl }}
        />
      ) : (
        <EmptyState
          icon="heart.slash.fill" // Changed icon for empty favorites
          title="Belum Ada Destinasi Favorit" // Changed title
          description="Tambahkan lokasi ke favorit Anda dari daftar destinasi wisata." // Changed description
          action={
            <Button
              label="Lihat Semua Destinasi" // Changed button label
              onPress={() => router.push('/(tabs)/lokasi')} // Navigates to the main locations list
              variant="primary"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.md,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
  },
});