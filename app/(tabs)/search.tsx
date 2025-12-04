import { db } from '@/app/(tabs)/firebaseConfig';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EmptyState } from '@/components/ui/empty-state';
import { LocationCard } from '@/components/ui/location-card';
import { TextInput } from '@/components/ui/text-input';
import { Spacing, Typography } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { onValue, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  SectionList,
  StyleSheet,
  View
} from 'react-native';

export default function SearchScreen() {
  const router = useRouter();

  const [allLocations, setAllLocations] = useState<any[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');


  // Fetch data from Firebase
  useEffect(() => {
    const pointsRef = ref(db, 'points/');
    const unsubscribe = onValue(pointsRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const locations = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setAllLocations(locations);
        setFilteredLocations(locations);



      } else {
        setAllLocations([]);
        setFilteredLocations([]);

      }
      setLoading(false);
    }, error => {
      console.error(error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Search filter logic
  useEffect(() => {
    let filtered = allLocations;

    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredLocations(filtered);
  }, [searchQuery, allLocations]);

  // Toggle favorite
  const handleToggleFavorite = (id: string, isFavorite: boolean) => {
    const pointRef = ref(db, `points/${id}`);
    update(pointRef, { isFavorite: !isFavorite }).catch(err => {
      console.error('Error updating favorite:', err);
    });
  };

  // Handle routing to Google Maps
  const handleRoute = (coordinates: string) => {
    const [latitude, longitude] = coordinates.split(',').map(coord => coord.trim());
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <ThemedView style={styles.searchHeader}>
        <ThemedText style={[Typography.h4, { marginBottom: Spacing.lg }]}>
          🔍 Pencarian Destinasi Dunia
        </ThemedText>

        {/* Search Bar */}
        <TextInput
          label="Cari berdasarkan nama"
          placeholder="Contoh: Eiffel Tower"
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="search"
        />


      </ThemedView>

      {/* Results */}
      {filteredLocations.length > 0 ? (
        <SectionList
          sections={[{ title: `${filteredLocations.length} Lokasi Ditemukan`, data: filteredLocations }]}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ marginHorizontal: Spacing.md, marginVertical: Spacing.sm }}>
              <LocationCard
                name={item.name}
                coordinates={item.coordinates}
                accuracy={item.accuration}
                isFavorite={item.isFavorite || false}
                onRoute={() => handleRoute(item.coordinates)}
                onFavorite={() => handleToggleFavorite(item.id, item.isFavorite || false)}
              />
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <ThemedText style={[Typography.h4, styles.header]}>{title}</ThemedText>
          )}
          contentContainerStyle={{ paddingBottom: Spacing.xxl }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="magnifyingglass"
            title="Tidak Ada Hasil"
            description={
              searchQuery
                ? "Tidak ada lokasi yang cocok dengan pencarian Anda."
                : "Mulai cari destinasi Anda."
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },

  header: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, marginBottom: Spacing.sm },
  emptyContainer: { flex: 1, justifyContent: 'center' },
});
