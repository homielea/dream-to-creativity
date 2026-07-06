import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { FragmentItem } from '../../src/components/FragmentItem';
import { Body, Button, Caption, Card, Screen, Title } from '../../src/components/ui';
import { proxyConfigured } from '../../src/lib/proxy';
import {
  capturesForSeed,
  digestForSeed,
  useSeedsStore,
} from '../../src/store/seedsStore';
import { spacing } from '../../src/theme/typography';

// Spec 04 — HARVEST. Seed restated, summary, fragments by relevance,
// fast keep/discard. Falls back gracefully when the proxy is unreachable.

export default function DigestScreen() {
  const { seedId } = useLocalSearchParams<{ seedId: string }>();
  const seed = useSeedsStore((s) => s.seeds.find((x) => x.id === seedId) ?? null);
  const captures = useSeedsStore(
    useShallow((s) => (seedId ? capturesForSeed(s, seedId) : []))
  );
  const digest = useSeedsStore((s) => (seedId ? digestForSeed(s, seedId) : null));
  const generateDigest = useSeedsStore((s) => s.generateDigest);
  const setFragmentKeep = useSeedsStore((s) => s.setFragmentKeep);
  const setCaptureKeep = useSeedsStore((s) => s.setCaptureKeep);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (seed && !digest && captures.length > 0 && !generating) {
      setGenerating(true);
      void generateDigest(seed.id).finally(() => setGenerating(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed?.id, digest?.id]);

  if (!seed) {
    return (
      <Screen>
        <Body soft>This seed is gone from the record. Head back.</Body>
        <Button label="Home" kind="ghost" onPress={() => router.replace('/')} />
      </Screen>
    );
  }

  const ordered = digest
    ? [...digest.fragments].sort((a, b) => b.relevanceToSeed - a.relevanceToSeed)
    : [];
  const captureById = new Map(captures.map((c) => [c.id, c]));

  return (
    <Screen>
      <Title>Here's what you caught.</Title>
      <Card>
        <Caption style={styles.seedLabel}>The problem you planted</Caption>
        <Body>{seed.problem}</Body>
      </Card>

      {generating && <Body soft>Putting the night together…</Body>}

      {digest && digest.summary.length > 0 && (
        <Card>
          <Caption style={styles.seedLabel}>The night, in short</Caption>
          <Body>{digest.summary}</Body>
        </Card>
      )}
      {digest && digest.summary.length === 0 && captures.length > 0 && (
        <Caption style={styles.offline}>
          {proxyConfigured()
            ? 'The summary is unavailable right now. Your fragments and audio are all here; regenerate any time.'
            : 'No summary service is set up. Your fragments and audio are all here; regenerate once it is.'}
        </Caption>
      )}

      {ordered.map((f) => {
        const capture = captureById.get(f.captureId);
        if (!capture) return null;
        return (
          <FragmentItem
            key={f.captureId}
            capture={capture}
            text={f.text}
            onKeep={(keep) =>
              digest ? setFragmentKeep(digest.id, f.captureId, keep) : setCaptureKeep(f.captureId, keep)
            }
          />
        );
      })}

      {captures.length === 0 && (
        <Body soft>No fragments for this seed yet. The night is still ahead of you.</Body>
      )}

      {digest && captures.length > 0 && (
        <Button
          label="Regenerate digest"
          kind="ghost"
          onPress={() => {
            setGenerating(true);
            void generateDigest(seed.id).finally(() => setGenerating(false));
          }}
        />
      )}
      <Button label="Done" onPress={() => router.replace('/')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  seedLabel: { marginBottom: spacing.xs },
  offline: { marginBottom: spacing.md },
});
