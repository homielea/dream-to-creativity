import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing, type } from '../theme/typography';
import { useDayTheme } from '../theme/useTheme';
import { Seed, SeedStatus } from '../types';

const STATUS_LABEL: Record<SeedStatus, string> = {
  draft: 'Draft',
  planted: 'Planted',
  harvested: 'Harvested',
  archived: 'Archived',
};

export function SeedCard({
  seed,
  keptCount,
  onPress,
}: {
  seed: Seed;
  keptCount: number;
  onPress: () => void;
}) {
  const { palette } = useDayTheme();
  const date = new Date(seed.createdAt);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: palette.card, borderColor: palette.border },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[type.title, { color: palette.ink }]}>{seed.title}</Text>
      <Text style={[type.caption, { color: palette.inkSoft }]} numberOfLines={1}>
        {seed.problem}
      </Text>
      <View style={styles.metaRow}>
        <Text style={[type.caption, { color: palette.inkSoft }]}>
          {STATUS_LABEL[seed.status]} · {date.toLocaleDateString()} ·{' '}
          {seed.captureIds.length} caught
        </Text>
        {keptCount > 0 && (
          <Text style={[type.caption, { color: palette.gold }]}>{keptCount} kept</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  pressed: { opacity: 0.75 },
});
