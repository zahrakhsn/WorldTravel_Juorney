import { push, ref } from 'firebase/database';
import React, { useState } from 'react';

import { db } from '@/app/(tabs)/firebaseConfig';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';
import { Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';

import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [accuracy, setAccuracy] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', location: '', accuracy: '' });
  
  const accentColor = useThemeColor({}, 'accent');

  // Get current location
  const getCoordinates = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Ditolak', 'Izin akses lokasi diperlukan');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const coords = `${loc.coords.latitude}, ${loc.coords.longitude}`;
      setLocation(coords);
      // @ts-ignore
      setAccuracy(`${Math.round(loc.coords.accuracy ?? 0)} m`);
      setErrors(prev => ({ ...prev, location: '', accuracy: '' }));
    } catch (error) {
      Alert.alert('Error', 'Gagal mendapatkan lokasi');
    } finally {
      setLoading(false);
    }
  };


  const validateForm = () => {
    const newErrors = { name: '', location: '', accuracy: '' };
    if (!name.trim()) newErrors.name = 'Nama lokasi wajib diisi';
    if (!location.trim()) newErrors.location = 'Koordinat wajib diisi';
    if (!accuracy.trim()) newErrors.accuracy = 'Akurasi wajib diisi';
    setErrors(newErrors);
    return Object.values(newErrors).every(e => !e);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);

      const locationsRef = ref(db, 'points/');
      await push(locationsRef, {
        name: name.trim(),
        coordinates: location.trim(),
        accuration: accuracy.trim(),
      });
      Alert.alert('Sukses', 'Lokasi berhasil disimpan');
      setName('');
      setLocation('');
      setAccuracy('');
      setErrors({ name: '', location: '', accuracy: '' });
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan data');
      console.error(error); // Log error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Tambah Lokasi Baru' }} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.content}>
            <TextInput
              label="Nama Lokasi"
              placeholder="Contoh: Pantai Kuta"
              value={name}
              onChangeText={text => {
                setName(text);
                if (text.trim()) setErrors(prev => ({ ...prev, name: '' }));
              }}
              error={errors.name}
              icon={<FontAwesome5 name="location-arrow" size={16} color={accentColor} />}
            />

            <TextInput
              label="Koordinat"
              placeholder="Contoh: -8.123456, 115.234567"
              value={location}
              onChangeText={text => {
                setLocation(text);
                if (text.trim()) setErrors(prev => ({ ...prev, location: '' }));
              }}
              error={errors.location}
              icon={<FontAwesome5 name="map-marker-alt" size={16} color={accentColor} />}
            />

            <TextInput
              label="Akurasi"
              placeholder="Contoh: 15 m"
              value={accuracy}
              onChangeText={text => {
                setAccuracy(text);
                if (text.trim()) setErrors(prev => ({ ...prev, accuracy: '' }));
              }}
              error={errors.accuracy}
              icon={<FontAwesome5 name="ruler" size={16} color={accentColor} />}
              helperText="Tingkat akurasi pembacaan GPS"
            />

            <Button
  label="Ambil Lokasi Saat Ini"
  onPress={getCoordinates}
  variant="secondary"
  loading={loading}
  style={[styles.button, { width: '90%', alignSelf: 'center' }]}
/>

<Button
  label="Simpan Lokasi"
  onPress={handleSave}
  variant="primary"
  loading={loading}
  style={[styles.button, { width: '90%', alignSelf: 'center' }]}
/>

          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: Spacing.lg,
  },
  button: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
  },
});


export default App;