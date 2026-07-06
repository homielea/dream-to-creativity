import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { night } from '../theme/colors';
import { type } from '../theme/typography';

// The hero of the app: a full-bleed, tap-anywhere record surface on
// near-black. HARD RULES apply here — huge target, no typing, silent,
// true-dark, no luminance spikes. State is shown only by a slow dim
// amber pulse; the single line of copy is dim and optional to read.

const DEBOUNCE_MS = 350; // a fumbled double-tap must not discard a capture

export function CaptureTarget({
  isRecording,
  onToggle,
}: {
  isRecording: boolean;
  onToggle: () => void;
}) {
  const pulse = useRef(new Animated.Value(0)).current;
  const lastTapAt = useRef(0);

  useEffect(() => {
    if (isRecording) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 2200, // slow — no strobing, no flash
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 2200,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
    pulse.setValue(0);
    return undefined;
  }, [isRecording, pulse]);

  const handlePress = () => {
    const now = Date.now();
    if (now - lastTapAt.current < DEBOUNCE_MS) return;
    lastTapAt.current = now;
    onToggle();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.surface}
      accessibilityRole="button"
      accessibilityLabel={isRecording ? 'Stop recording' : 'Start recording'}
    >
      <Animated.View
        style={[
          styles.pulseDot,
          {
            opacity: isRecording
              ? pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.7] })
              : 0.18,
          },
        ]}
      />
      <Text style={[type.nightHint, styles.hint]}>
        {isRecording ? 'Speaking. Tap to stop.' : 'Tap anywhere. Speak.'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Fills everything its parent gives it — the parent gives it the screen.
  surface: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: night.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDot: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: night.pulse,
    marginBottom: 28,
  },
  hint: { color: night.text },
});
