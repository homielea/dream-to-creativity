import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { capturesForSeed, useSeedsStore } from '../src/store/seedsStore';
import { spacing } from '../src/theme/typography';
import { Body, Button, Caption, Card, Screen, Title } from '../src/components/ui';

export default function Home() {
  const hydrated = useSeedsStore((s) => s.hydrated);
  const seeds = useSeedsStore((s) => s.seeds);
  const activeSeedId = useSeedsStore((s) => s.activeSeedId);
  const captureCount = useSeedsStore((s) =>
    activeSeedId ? capturesForSeed(s, activeSeedId).length : 0
  );

  if (!hydrated) return null;

  const activeSeed = seeds.find((s) => s.id === activeSeedId) ?? null;
  const hasAnySeed = seeds.length > 0;

  return (
    <Screen>
      <Title>Tonight</Title>
      {activeSeed ? (
        <>
          <Card>
            <Body>{activeSeed.title}</Body>
            <Caption style={styles.problem}>{activeSeed.problem}</Caption>
            <Caption>
              {captureCount === 0
                ? 'Planted. Nothing caught yet.'
                : `${captureCount} ${captureCount === 1 ? 'fragment' : 'fragments'} caught.`}
            </Caption>
          </Card>
          <Button label="Open capture" onPress={() => router.push('/capture')} />
          {captureCount > 0 && (
            <Button
              label="Here's what you caught"
              kind="ghost"
              onPress={() => router.push(`/digest/${activeSeed.id}`)}
            />
          )}
        </>
      ) : (
        <>
          <Body soft style={styles.intro}>
            {hasAnySeed
              ? 'Nothing planted for tonight yet.'
              : 'Name the problem you are turning over. Sleep. Catch what surfaces before it evaporates.'}
          </Body>
          <View style={styles.spacer} />
          <Button label="Plant a problem" onPress={() => router.push('/seed/new')} />
        </>
      )}
      <Button label="Archive" kind="ghost" onPress={() => router.push('/archive')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  problem: { marginTop: spacing.xs, marginBottom: spacing.sm },
  intro: { marginBottom: spacing.md },
  spacer: { height: spacing.md },
});
