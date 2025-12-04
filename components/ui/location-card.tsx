import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

interface LocationCardProps {
  name: string;
  coordinates: string;
  accuracy?: string;
  isFavorite?: boolean;
  onPress?: () => void;
  onRoute?: () => void;
  onFavorite?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function LocationCard({
  name,
  coordinates,
  accuracy,
  isFavorite,
  onPress,
  onRoute,
  onFavorite,
  onEdit,
  onDelete,
}: LocationCardProps) {
  const accentColor = useThemeColor({}, 'accent');
  const errorColor = useThemeColor({}, 'error');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <Card style={styles.card}>
      <TouchableOpacity 
        style={styles.content}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.info}>
          <ThemedText style={[Typography.bodySemibold]}>
            📍 {name}
          </ThemedText>
          <ThemedText style={[Typography.caption, styles.coordinates]}>
            {coordinates}
          </ThemedText>
          {accuracy && (
            <ThemedText style={[Typography.caption, styles.accuracy]}>
              Akurasi: {accuracy}
            </ThemedText>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.actions}>
        {onFavorite && (
          <TouchableOpacity onPress={onFavorite} style={styles.actionButton}>
            <FontAwesome5 name="heart" size={16} color={isFavorite ? '#ff4444' : '#ccc'} solid={isFavorite} />
          </TouchableOpacity>
        )}
        {onRoute && (
          <TouchableOpacity onPress={onRoute} style={[styles.actionButton, styles.routeButton]}>
            <FontAwesome5 name="directions" size={16} color="white" />
            <ThemedText style={styles.routeButtonText}>Rute</ThemedText>
          </TouchableOpacity>
        )}
        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <FontAwesome5 name="pencil-alt" size={16} color={accentColor} />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <FontAwesome5 name="trash" size={16} color={errorColor} />
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
  },
  info: {
    gap: Spacing.xs,
  },
  coordinates: {
    opacity: 0.7,
  },
  accuracy: {
    opacity: 0.6,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    padding: Spacing.sm,
  },
  routeButton: {
    flexDirection: 'row',
    backgroundColor: '#0275d8',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 6,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  routeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
