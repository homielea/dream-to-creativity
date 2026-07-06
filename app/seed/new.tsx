import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Body, Button, Caption, Screen, Title } from '../../src/components/ui';
import { useSeedsStore } from '../../src/store/seedsStore';
import { night } from '../../src/theme/colors';
import { radius, spacing, type } from '../../src/theme/typography';
import { useDayTheme } from '../../src/theme/useTheme';
import { Seed } from '../../src/types';

// Spec 01 — PLANT. Seed entry in daylight, then a slow priming ritual that
// steps the screen down toward the dark capture handoff.

type Phase = 'entry' | 'ritual';

export default function NewSeed() {
  const [phase, setPhase] = useState<Phase>('entry');
  const [seed, setSeed] = useState<Seed | null>(null);

  return phase === 'entry' ? (
    <SeedEntry
      onPlanted={(s) => {
        setSeed(s);
        setPhase('ritual');
      }}
    />
  ) : seed ? (
    <PrimingRitual seed={seed} />
  ) : null;
}

function SeedEntry({ onPlanted }: { onPlanted: (seed: Seed) => void }) {
  const { palette } = useDayTheme();
  const createSeed = useSeedsStore((s) => s.createSeed);
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const canPlant = problem.trim().length > 0;

  const inputStyle = {
    backgroundColor: palette.card,
    borderColor: palette.border,
    color: palette.ink,
  };

  return (
    <Screen>
      <Title>What are you turning over tonight?</Title>
      <Body soft style={styles.lead}>
        Name it precisely. Your sleeping mind works on the problem you hand it.
      </Body>
      <Caption style={styles.label}>A short name</Caption>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder="Act 2 feels flat"
        placeholderTextColor={palette.inkSoft}
        value={title}
        onChangeText={setTitle}
      />
      <Caption style={styles.label}>The problem, in full</Caption>
      <TextInput
        style={[styles.input, styles.multiline, inputStyle]}
        placeholder="The midpoint has no reversal; the reader has no reason to keep going."
        placeholderTextColor={palette.inkSoft}
        value={problem}
        onChangeText={setProblem}
        multiline
      />
      <Button
        label="Prime & sleep"
        disabled={!canPlant}
        onPress={() => {
          const created = createSeed(title.trim() || problem.trim().slice(0, 40), problem);
          onPlanted(created);
        }}
      />
      <Button label="Back" kind="ghost" onPress={() => router.back()} />
    </Screen>
  );
}

// The ritual restates the problem, then lets it go. Each step is slower and
// darker than the last, landing on the capture surface already dim.
const RITUAL_BACKGROUNDS = ['#4A4636', '#232220', night.bgRest] as const;
const STEP_MS = 7000;

function PrimingRitual({ seed }: { seed: Seed }) {
  const primeSeed = useSeedsStore((s) => s.primeSeed);
  const [step, setStep] = useState(0);

  const steps = [
    { hint: 'Read it once more.', text: seed.problem },
    { hint: 'Hold the problem.', text: seed.title },
    { hint: 'Let it go. Sleep on it.', text: '' },
  ];

  useEffect(() => {
    const t = setTimeout(() => advance(step), STEP_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const advance = (from: number) => {
    if (from < steps.length - 1) {
      setStep(from + 1);
    } else {
      primeSeed(seed.id);
      router.replace('/capture');
    }
  };

  const current = steps[step];

  return (
    <View style={[styles.ritual, { backgroundColor: RITUAL_BACKGROUNDS[step] }]}>
      <Text style={[type.title, styles.ritualHint, step === 2 && styles.ritualHintDim]}>
        {current.hint}
      </Text>
      {current.text.length > 0 && (
        <Text style={[type.body, styles.ritualText, step > 0 && styles.ritualTextDim]}>
          {current.text}
        </Text>
      )}
      <View style={styles.ritualSpacer} />
      <Text style={[type.caption, styles.ritualAdvance]} onPress={() => advance(step)}>
        continue
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lead: { marginBottom: spacing.lg },
  label: { marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  multiline: { minHeight: 110, textAlignVertical: 'top' },
  ritual: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  ritualHint: { color: '#C9C2AE', textAlign: 'center', marginBottom: spacing.lg },
  ritualHintDim: { color: night.text },
  ritualText: { color: '#A8A290', textAlign: 'center' },
  ritualTextDim: { color: '#6E6A5E' },
  ritualSpacer: { height: spacing.xl * 2 },
  ritualAdvance: { color: '#57544A', padding: spacing.md },
});
