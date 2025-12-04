import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const iconColor = useThemeColor({}, 'icon');
  const textSecondary = useThemeColor({}, 'textSecondary');

  return (
    <View style={styles.container}>
      {icon && (
        <IconSymbol
          name={icon as any}
          size={64}
          color={iconColor}
          style={styles.icon}
        />
      )}
      <ThemedText style={[Typography.h4, styles.title]}>
        {title}
      </ThemedText>
      {description && (
        <ThemedText style={[Typography.body, { color: textSecondary, textAlign: 'center' }]}>
          {description}
        </ThemedText>
      )}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  icon: {
    marginBottom: Spacing.md,
    opacity: 0.5,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  action: {
    marginTop: Spacing.lg,
  },
});
