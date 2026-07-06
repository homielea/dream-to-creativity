import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDuration } from '../lib/audio';
import { radius, spacing, type } from '../theme/typography';
import { useDayTheme } from '../theme/useTheme';
import { Capture, KeepState } from '../types';

// One capture in a list: cleaned text (or raw fallback), duration, playback
// of the raw audio, and a keep/discard control. Daylight surface.

export function FragmentItem({
  capture,
  text,
  onKeep,
}: {
  capture: Capture;
  text?: string; // digest-cleaned text when available
  onKeep?: (keep: KeepState) => void;
}) {
  const { palette } = useDayTheme();
  const player = useAudioPlayer(capture.audioUri);
  const status = useAudioPlayerStatus(player);

  const shown =
    (text && text.length > 0 ? text : null) ??
    capture.transcript?.cleaned ??
    capture.transcript?.raw ??
    null;

  const togglePlay = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.seekTo(0);
      player.play();
    }
  };

  return (
    <View style={[styles.item, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <Text style={[type.body, { color: shown ? palette.ink : palette.inkSoft }]}>
        {shown ?? 'No transcript yet. The audio is safe.'}
      </Text>
      <View style={styles.row}>
        <Pressable onPress={togglePlay} style={[styles.play, { borderColor: palette.border }]}>
          <Text style={[type.caption, { color: palette.indigo }]}>
            {status.playing ? 'Pause' : 'Play'} · {formatDuration(capture.durationMs)}
          </Text>
        </Pressable>
        {onKeep && (
          <View style={styles.keepRow}>
            <KeepButton
              label="Keep"
              active={capture.keep === 'kept'}
              activeColor={palette.gold}
              onPress={() => onKeep(capture.keep === 'kept' ? 'undecided' : 'kept')}
            />
            <KeepButton
              label="Discard"
              active={capture.keep === 'discarded'}
              activeColor={palette.danger}
              onPress={() => onKeep(capture.keep === 'discarded' ? 'undecided' : 'discarded')}
            />
          </View>
        )}
      </View>
    </View>
  );
}

function KeepButton({
  label,
  active,
  activeColor,
  onPress,
}: {
  label: string;
  active: boolean;
  activeColor: string;
  onPress: () => void;
}) {
  const { palette } = useDayTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.keep,
        { borderColor: active ? activeColor : palette.border },
        active && { backgroundColor: `${activeColor}22` },
      ]}
    >
      <Text style={[type.caption, { color: active ? activeColor : palette.inkSoft }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  play: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  keepRow: { flexDirection: 'row', gap: spacing.sm },
  keep: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
});
