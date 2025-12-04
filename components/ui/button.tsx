import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BorderRadius, Spacing, Shadows, Typography } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
}: ButtonProps) {
  const backgroundColor = useThemeColor({}, 'tint');
  const accentColor = useThemeColor({}, 'accent');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const errorColor = useThemeColor({}, 'error');

  const sizeStyles = {
    sm: { 
      paddingHorizontal: Spacing.md, 
      paddingVertical: Spacing.sm,
      minHeight: 32,
    },
    md: { 
      paddingHorizontal: Spacing.lg, 
      paddingVertical: Spacing.md,
      minHeight: 44,
    },
    lg: { 
      paddingHorizontal: Spacing.xl, 
      paddingVertical: Spacing.lg,
      minHeight: 54,
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: disabled ? '#cccccc' : backgroundColor,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: disabled ? '#e0e0e0' : accentColor,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: disabled ? '#cccccc' : borderColor,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    danger: {
      backgroundColor: disabled ? '#ffcccc' : errorColor,
      borderWidth: 0,
    },
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && { width: '100%' },
        style,
        { ...Shadows.md },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' ? backgroundColor : '#fff'} 
          size="small"
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              Typography.bodySemibold,
              {
                color: variant === 'outline' || variant === 'ghost' ? textColor : '#fff',
                marginLeft: icon ? Spacing.sm : 0,
              },
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
});
