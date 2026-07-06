import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, spacing, type } from '../theme/typography';
import { useDayTheme } from '../theme/useTheme';

// Daylight-surface building blocks. Nighttime surfaces do not use these —
// they are built from raw views on the night palette.

export function Screen({ children }: { children: React.ReactNode }) {
  const { palette } = useDayTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.bg }]} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Title({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  const { palette } = useDayTheme();
  return <Text style={[type.display, { color: palette.ink, marginBottom: spacing.sm }, style]}>{children}</Text>;
}

export function Body({ children, soft, style }: { children: React.ReactNode; soft?: boolean; style?: TextStyle }) {
  const { palette } = useDayTheme();
  return (
    <Text style={[type.body, { color: soft ? palette.inkSoft : palette.ink }, style]}>
      {children}
    </Text>
  );
}

export function Caption({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  const { palette } = useDayTheme();
  return <Text style={[type.caption, { color: palette.inkSoft }, style]}>{children}</Text>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { palette } = useDayTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: palette.card, borderColor: palette.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Button({
  label,
  onPress,
  kind = 'primary',
  disabled,
}: {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'ghost' | 'quiet';
  disabled?: boolean;
}) {
  const { palette } = useDayTheme();
  const base: ViewStyle =
    kind === 'primary'
      ? { backgroundColor: palette.indigo }
      : kind === 'ghost'
        ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.border }
        : { backgroundColor: 'transparent' };
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        base,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[type.title, { color: kind === 'primary' ? '#F6F5FB' : palette.ink }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  button: {
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.75 },
});
