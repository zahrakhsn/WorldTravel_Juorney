/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0275d8ff';
const tintColorDark = '#4db8ffff';
const accentColorLight = '#ff6b35ff';
const accentColorDark = '#ffb347ff';
const successColor = '#10b981ff';
const warningColor = '#f59e0bff';
const errorColor = '#ef4444ff';

export const Colors = {
  light: {
    text: '#1a1a1aff',
    textSecondary: '#666666ff',
    background: '#ffffffff',
    backgroundSecondary: '#f5f5f5ff',
    tint: tintColorLight,
    accent: accentColorLight,
    icon: '#687076ff',
    tabIconDefault: '#687076ff',
    tabIconSelected: tintColorLight,
    border: '#e0e0e0ff',
    borderLight: '#f0f0f0ff',
    success: successColor,
    warning: warningColor,
    error: errorColor,
    card: '#f9faffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    text: '#ecedee',
    textSecondary: '#b0b0b0ff',
    background: '#0f172aff',
    backgroundSecondary: '#1e293bff',
    tint: tintColorDark,
    accent: accentColorDark,
    icon: '#9ba1a6ff',
    tabIconDefault: '#9ba1a6ff',
    tabIconSelected: tintColorDark,
    border: '#334155ff',
    borderLight: '#475569ff',
    success: '#34d399ff',
    warning: '#fbbf24ff',
    error: '#f87171ff',
    card: '#1e293bff',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as any,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700" as any,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as any,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600" as any,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as any,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: "500" as any,
    lineHeight: 24,
  },
  bodySemibold: {
    fontSize: 16,
    fontWeight: "600" as any,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as any,
    lineHeight: 16,
  },
  captionMedium: {
    fontSize: 12,
    fontWeight: "500" as any,
    lineHeight: 16,
  },
};
