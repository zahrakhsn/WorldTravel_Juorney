import React from 'react';
import { 
  StyleSheet, 
  TextInput as RNTextInput, 
  TextInputProps as RNTextInputProps, 
  View,
  Text 
} from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export function TextInput({
  label,
  error,
  icon,
  helperText,
  ...props
}: TextInputProps) {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const errorColor = useThemeColor({}, 'error');
  const placeholderColor = useThemeColor({}, 'textSecondary');

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[Typography.bodyMedium, { color: textColor, marginBottom: Spacing.sm }]}>
          {label}
        </Text>
      )}
      <View style={[
        styles.inputWrapper,
        { 
          backgroundColor,
          borderColor: error ? errorColor : borderColor,
          borderWidth: error ? 2 : 1,
        }
      ]}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <RNTextInput
          style={[
            styles.input,
            Typography.body,
            { 
              color: textColor,
              paddingLeft: icon ? 0 : Spacing.md,
            },
          ]}
          placeholderTextColor={placeholderColor}
          {...props}
        />
      </View>
      {error ? (
        <Text style={[Typography.caption, { color: errorColor, marginTop: Spacing.xs }]}>
          {error}
        </Text>
      ) : helperText ? (
        <Text style={[Typography.caption, { color: placeholderColor, marginTop: Spacing.xs }]}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingRight: Spacing.md,
    minHeight: 48,
  },
  icon: {
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
  },
});
