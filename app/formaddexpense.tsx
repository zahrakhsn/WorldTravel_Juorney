import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';
import { Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Stack, useRouter } from 'expo-router';
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref } from "firebase/database";
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ description: '', amount: '', date: '' });
  
  const accentColor = useThemeColor({}, 'accent');
  const router = useRouter();

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

  const validateForm = () => {
    const newErrors = { description: '', amount: '', date: '' };
    if (!description.trim()) newErrors.description = 'Deskripsi wajib diisi';
    if (!amount.trim()) newErrors.amount = 'Jumlah wajib diisi';
    if (!date.trim()) newErrors.date = 'Tanggal wajib diisi';
    setErrors(newErrors);
    return Object.values(newErrors).every(e => !e);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const expensesRef = ref(db, 'expenses/');
      await push(expensesRef, {
        description: description.trim(),
        amount: parseFloat(amount),
        date: date.trim(),
      });
      Alert.alert('Sukses', 'Pengeluaran berhasil disimpan');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Tambah Pengeluaran' }} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.content}>
            <TextInput
              label="Deskripsi"
              placeholder="Contoh: Makan siang"
              value={description}
              onChangeText={text => {
                setDescription(text);
                if (text.trim()) setErrors(prev => ({ ...prev, description: '' }));
              }}
              error={errors.description}
              icon={<FontAwesome5 name="receipt" size={16} color={accentColor} />}
            />

            <TextInput
              label="Jumlah (Rp)"
              placeholder="Contoh: 50000"
              value={amount}
              onChangeText={text => {
                setAmount(text);
                if (text.trim()) setErrors(prev => ({ ...prev, amount: '' }));
              }}
              error={errors.amount}
              icon={<FontAwesome5 name="money-bill" size={16} color={accentColor} />}
              keyboardType="numeric"
            />

            <TextInput
              label="Tanggal"
              value={date}
              onChangeText={text => {
                setDate(text);
                if (text.trim()) setErrors(prev => ({ ...prev, date: '' }));
              }}
              error={errors.date}
              icon={<FontAwesome5 name="calendar" size={16} color={accentColor} />}
            />

            <Button
              label="Simpan Pengeluaran"
              onPress={handleSave}
              variant="primary"
              loading={loading}
              fullWidth
              style={styles.button}
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
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  button: {
    marginTop: Spacing.lg,
  },
});

export default App;
