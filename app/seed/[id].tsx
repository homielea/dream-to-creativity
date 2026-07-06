import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { FragmentItem } from '../../src/components/FragmentItem';
import { Body, Button, Caption, Card, Screen, Title } from '../../src/components/ui';
import {
  capturesForSeed,
  digestForSeed,
  useSeedsStore,
} from '../../src/store/seedsStore';
import { spacing } from '../../src/theme/typography';

// Spec 05 — seed detail: the problem, its digest, every capture with audio,
// and the kept fragments highlighted as the harvest.

export default function SeedDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const seed = useSeedsStore((s) => s.seeds.find((x) => x.id === id) ?? null);
  const captures = useSeedsStore(useShallow((s) => (id ? capturesForSeed(s, id) : [])));
  const digest = useSeedsStore((s) => (id ? digestForSeed(s, id) : null));
  const setCaptureKeep = useSeedsStore((s) => s.setCaptureKeep);
  const archiveSeed = useSeedsStore((s) => s.archiveSeed);

  if (!seed) {
    return (
      <Screen>
        <Body soft>This seed is gone from the record. Head back.</Body>
        <Button label="Archive" kind="ghost" onPress={() => router.replace('/archive')} />
      </Screen>
    );
  }

  const kept = captures.filter((c) => c.keep === 'kept');

  return (
    <Screen>
      <Title>{seed.title}</Title>
      <Card>
        <Caption style={styles.label}>The problem</Caption>
        <Body>{seed.problem}</Body>
      </Card>

      {digest && digest.summary.length > 0 && (
        <Card>
          <Caption style={styles.label}>The night, in short</Caption>
          <Body>{digest.summary}</Body>
        </Card>
      )}

      {kept.length > 0 && (
        <>
          <Caption style={styles.section}>Harvest — what you kept</Caption>
          {kept.map((c) => (
            <FragmentItem key={c.id} capture={c} onKeep={(k) => setCaptureKeep(c.id, k)} />
          ))}
        </>
      )}

      <Caption style={styles.section}>
        {captures.length === 0
          ? 'No fragments were caught for this seed.'
          : `All fragments (${captures.length})`}
      </Caption>
      {captures
        .filter((c) => c.keep !== 'kept')
        .map((c) => (
          <FragmentItem key={c.id} capture={c} onKeep={(k) => setCaptureKeep(c.id, k)} />
        ))}

      {captures.length > 0 && (
        <Button
          label="Open the digest"
          kind="ghost"
          onPress={() => router.push(`/digest/${seed.id}`)}
        />
      )}
      {seed.status !== 'archived' && (
        <Button
          label="Archive this seed"
          kind="ghost"
          onPress={() => {
            archiveSeed(seed.id);
            router.replace('/archive');
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: spacing.xs },
  section: { marginTop: spacing.sm, marginBottom: spacing.sm },
});
