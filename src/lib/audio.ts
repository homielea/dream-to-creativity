import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

// Raw audio is the source of truth and is NEVER discarded. A recorder hands us
// a temporary uri; before anything else touches it we move it somewhere
// durable and hand back the final, immutable uri.
//
// Web has no durable file system — the recorder's blob uri is returned as-is
// and durability is best-effort for that platform (documented limitation).

const CAPTURES_DIR = 'captures';

export function persistRecording(tempUri: string, captureIdHint: string): string {
  if (Platform.OS === 'web') return tempUri;
  try {
    const dir = new Directory(Paths.document, CAPTURES_DIR);
    if (!dir.exists) dir.create({ intermediates: true });
    const ext = extensionOf(tempUri) ?? 'm4a';
    const dest = new File(dir, `${captureIdHint}.${ext}`);
    const src = new File(tempUri);
    src.move(dest);
    return dest.uri;
  } catch {
    // Moving failed — the temp uri still points at real audio. Losing the
    // recording would violate a HARD RULE; keeping the temp path does not.
    return tempUri;
  }
}

function extensionOf(uri: string): string | null {
  const m = /\.([A-Za-z0-9]{1,5})(?:\?|$)/.exec(uri);
  return m ? m[1].toLowerCase() : null;
}

export function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
