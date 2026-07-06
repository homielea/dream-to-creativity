import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import * as Brightness from 'expo-brightness';
import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { CaptureTarget } from '../../src/components/CaptureTarget';
import { persistRecording } from '../../src/lib/audio';
import { newId } from '../../src/lib/id';
import { transcribe } from '../../src/lib/transcription';
import { useSeedsStore } from '../../src/store/seedsStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { night } from '../../src/theme/colors';
import { spacing, type } from '../../src/theme/typography';

// Spec 02 — CAPTURE, the make-or-break screen. Used by a half-asleep person,
// in the dark, eyes closed. HARD RULES: tap-anywhere target, no typing,
// silent by default, true-dark, raw audio persisted before anything else.

const MAX_RECORDING_MS = 10 * 60 * 1000; // fell-asleep-recording cap; audio still persisted

export default function CaptureScreen() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const activeSeedId = useSeedsStore((s) => s.activeSeedId);
  const addCapture = useSeedsStore((s) => s.addCapture);
  const attachTranscript = useSeedsStore((s) => s.attachTranscript);
  const { confirmHaptic, transcriptionMode, proxyOptIn } = useSettingsStore();

  const [isRecording, setIsRecording] = useState(false);
  const [ready, setReady] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const stopping = useRef(false);
  const maxTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAt = useRef(0); // wall clock — some platforms report currentTime as 0

  // Audio mode + permission. Recording must start instantly on tap, so all
  // slow setup happens once, up front.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const perm = await requestRecordingPermissionsAsync();
        if (cancelled) return;
        if (!perm.granted) {
          setPermissionDenied(true);
          return;
        }
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
        await recorder.prepareToRecordAsync();
        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) setPermissionDenied(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lowest comfortable brightness while here; restore on exit. Never raise.
  useFocusEffect(
    useCallback(() => {
      let previous: number | null = null;
      (async () => {
        try {
          previous = await Brightness.getBrightnessAsync();
          if (previous > 0.05) await Brightness.setBrightnessAsync(0.05);
        } catch {
          // No brightness control here (web / permission) — palette is already true-dark.
        }
      })();
      return () => {
        (async () => {
          try {
            if (previous !== null) await Brightness.setBrightnessAsync(previous);
          } catch {
            // nothing to restore
          }
        })();
      };
    }, [])
  );

  const stopAndPersist = useCallback(async () => {
    if (stopping.current) return;
    stopping.current = true;
    if (maxTimer.current) clearTimeout(maxTimer.current);
    try {
      const durationMs = Math.max(
        Math.round(recorder.currentTime * 1000),
        startedAt.current > 0 ? Date.now() - startedAt.current : 0
      );
      await recorder.stop();
      const tempUri = recorder.uri;
      if (tempUri && activeSeedId) {
        // Persist audio FIRST; transcription is a lossy layer that comes later.
        const finalUri = persistRecording(tempUri, newId());
        const capture = addCapture(activeSeedId, finalUri, durationMs);
        void transcribe({
          captureId: capture.id,
          audioUri: finalUri,
          mode: transcriptionMode,
          proxyOptIn,
        }).then((t) => {
          if (t) attachTranscript(capture.id, t);
        });
      }
      await recorder.prepareToRecordAsync(); // ready for the next fragment, no navigation
    } finally {
      stopping.current = false;
      setIsRecording(false);
    }
  }, [recorder, activeSeedId, addCapture, attachTranscript, transcriptionMode, proxyOptIn]);

  const toggle = useCallback(() => {
    if (!ready || stopping.current) return;
    if (isRecording) {
      void stopAndPersist();
      return;
    }
    recorder.record();
    startedAt.current = Date.now();
    setIsRecording(true);
    maxTimer.current = setTimeout(() => void stopAndPersist(), MAX_RECORDING_MS);
    if (confirmHaptic && Platform.OS !== 'web') {
      // The one permitted feedback: a single gentle tick, opt-in, off by default.
      void Haptics.selectionAsync().catch(() => undefined);
    }
  }, [ready, isRecording, recorder, confirmHaptic, stopAndPersist]);

  if (!activeSeedId) {
    // Reached without a planted seed — stay dark, point gently home.
    return (
      <View style={styles.fallback}>
        <Text style={[type.nightHint, styles.fallbackText]} onPress={() => router.replace('/')}>
          Nothing planted tonight. Tap to go back.
        </Text>
      </View>
    );
  }

  if (permissionDenied) {
    // Never a bright modal at night — a dim line, resolvable in the morning.
    return (
      <View style={styles.fallback}>
        <Text style={[type.nightHint, styles.fallbackText]} onPress={() => router.replace('/')}>
          The microphone is off for this app. Enable it in Settings, in the morning.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <CaptureTarget isRecording={isRecording} onToggle={toggle} />
      <Text style={[type.caption, styles.leave]} onPress={() => router.replace('/')}>
        leave
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: night.bg },
  fallback: {
    flex: 1,
    backgroundColor: night.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  fallbackText: { color: night.text, textAlign: 'center', padding: spacing.lg },
  // A whisper in the corner — far outside the capture path, tiny by design;
  // the capture surface itself remains the entire rest of the screen.
  leave: {
    color: '#2E3038',
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
