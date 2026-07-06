import { Capture, Digest, Seed } from '../types';
import { newId, nowISO } from './id';
import { requestDigest } from './proxy';

// Generate the morning digest for a seed. Tries the Claude proxy; when the
// proxy is unconfigured or unreachable, falls back to an offline digest built
// from whatever transcripts exist — no AI summary, no scoring, nothing lost,
// regenerable later.

export async function generateDigestForSeed(
  seed: Seed,
  captures: Capture[]
): Promise<{ digest: Digest; offline: boolean }> {
  const transcripts = captures
    .map((c) => c.transcript)
    .filter((t): t is NonNullable<typeof t> => t !== null);
  if (transcripts.length > 0) {
    try {
      const digest = await requestDigest(seed, transcripts);
      return { digest, offline: false };
    } catch {
      // fall through to the offline digest
    }
  }
  return { digest: buildOfflineDigest(seed, captures), offline: true };
}

export function buildOfflineDigest(seed: Seed, captures: Capture[]): Digest {
  return {
    id: newId(),
    seedId: seed.id,
    summary: '', // empty = render the no-summary fallback state
    fragments: captures.map((c) => ({
      captureId: c.id,
      text: c.transcript?.cleaned ?? c.transcript?.raw ?? '',
      relevanceToSeed: 0,
      keep: c.keep,
    })),
    generatedAt: nowISO(),
  };
}
