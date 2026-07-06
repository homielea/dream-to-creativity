import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { SeedCard } from '../../src/components/SeedCard';
import { Body, Screen } from '../../src/components/ui';
import { useSeedsStore } from '../../src/store/seedsStore';
import { radius, spacing } from '../../src/theme/typography';
import { useDayTheme } from '../../src/theme/useTheme';

// Spec 05 — the lasting body of work: every seed, searchable.

export default function Archive() {
  const { palette } = useDayTheme();
  const seeds = useSeedsStore((s) => s.seeds);
  const captures = useSeedsStore((s) => s.captures);
  const [query, setQuery] = useState('');

  const keptCount = (seedId: string): number =>
    captures.filter((c) => c.seedId === seedId && c.keep === 'kept').length;

  const q = query.trim().toLowerCase();
  const matches = (seedId: string, title: string, problem: string): boolean => {
    if (q.length === 0) return true;
    if (title.toLowerCase().includes(q) || problem.toLowerCase().includes(q)) return true;
    // kept-fragment text is searchable too
    return captures.some(
      (c) =>
        c.seedId === seedId &&
        c.keep === 'kept' &&
        (c.transcript?.cleaned ?? c.transcript?.raw ?? '').toLowerCase().includes(q)
    );
  };

  const shown = [...seeds]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .filter((s) => matches(s.id, s.title, s.problem));

  return (
    <Screen>
      <TextInput
        style={[
          styles.search,
          { backgroundColor: palette.card, borderColor: palette.border, color: palette.ink },
        ]}
        placeholder="Search seeds and kept fragments"
        placeholderTextColor={palette.inkSoft}
        value={query}
        onChangeText={setQuery}
      />
      {shown.map((seed) => (
        <SeedCard
          key={seed.id}
          seed={seed}
          keptCount={keptCount(seed.id)}
          onPress={() => router.push(`/seed/${seed.id}`)}
        />
      ))}
      {seeds.length === 0 && <Body soft>Nothing planted yet. Start with one problem.</Body>}
      {seeds.length > 0 && shown.length === 0 && <Body soft>Nothing matches that search.</Body>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
    marginBottom: spacing.md,
  },
});
