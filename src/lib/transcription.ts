import { Platform } from 'react-native';
import { Transcript, TranscriptSource } from '../types';
import { nowISO } from './id';

// Transcription is a lossy convenience layered over the audio. It may lag,
// run later, or fail entirely — none of that may ever touch the capture or
// its audioUri. Failure here resolves to null; a retry is always possible
// because the audio survives.
//
// MVP status by mode:
// - 'device': no on-device STT module ships with Expo's managed workflow;
//   this resolves null (transcript pending) and is the safe default.
// - 'proxy': opt-in only. Sends audio to our server-side transcription
//   endpoint (which holds any provider keys); disabled unless the user
//   opted in AND a proxy URL is configured.

const PROXY_BASE_URL: string | undefined = process.env.EXPO_PUBLIC_PROXY_URL;

export interface TranscriptionRequest {
  captureId: string;
  audioUri: string;
  mode: TranscriptSource;
  proxyOptIn: boolean;
}

export async function transcribe(
  req: TranscriptionRequest
): Promise<Transcript | null> {
  try {
    if (req.mode === 'proxy') {
      if (!req.proxyOptIn || !PROXY_BASE_URL) return null;
      return await transcribeViaProxy(req.captureId, req.audioUri);
    }
    return null; // device STT: not available in MVP; audio remains the truth
  } catch {
    return null; // never let a transcription error surface as a lost capture
  }
}

async function transcribeViaProxy(
  captureId: string,
  audioUri: string
): Promise<Transcript | null> {
  const form = new FormData();
  if (Platform.OS === 'web') {
    const blob = await (await fetch(audioUri)).blob();
    form.append('audio', blob, `${captureId}.webm`);
  } else {
    // React Native's FormData accepts a file descriptor object.
    form.append('audio', {
      uri: audioUri,
      name: `${captureId}.m4a`,
      type: 'audio/m4a',
    } as unknown as Blob);
  }
  const res = await fetch(`${PROXY_BASE_URL}/transcribe`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { text: string; confidence?: number };
  return {
    captureId,
    raw: data.text,
    cleaned: null, // cleanup happens in the digest step
    source: 'proxy',
    confidence: typeof data.confidence === 'number' ? data.confidence : null,
    createdAt: nowISO(),
  };
}
