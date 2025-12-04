import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ 
  children, 
  style, 
  variant = 'default'
}: CardProps) {
  const borderColor = useThemeColor({}, 'border');

  const variantStyles = {
    default: [styles.default, { ...Shadows.md }],
    elevated: [styles.elevated, { ...Shadows.lg }],
    outlined: [styles.outlined, { borderColor }],
  };

  return (
    <ThemedView style={[variantStyles[variant], style]}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  default: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
  },
  elevated: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
  },
  outlined: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
  },
});
