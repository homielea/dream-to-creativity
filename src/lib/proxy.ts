import { Digest, DigestFragment, Seed, Transcript } from '../types';
import { newId, nowISO } from './id';

// All AI runs through our own server-side proxy, which holds the Anthropic
// Claude key. The client knows only a base URL (public config, not a secret);
// with no proxy configured or reachable, every caller must degrade gracefully
// — raw audio and raw transcripts are always retained locally.

const PROXY_BASE_URL: string | undefined = process.env.EXPO_PUBLIC_PROXY_URL;
// Optional shared secret matching the proxy's PROXY_TOKEN. A build-time
// env var, so it is a rotation handle, not a secret vault.
const PROXY_TOKEN: string | undefined = process.env.EXPO_PUBLIC_PROXY_TOKEN;
const authHeaders: Record<string, string> = PROXY_TOKEN
  ? { Authorization: `Bearer ${PROXY_TOKEN}` }
  : {};

export function proxyConfigured(): boolean {
  return typeof PROXY_BASE_URL === 'string' && PROXY_BASE_URL.length > 0;
}

interface DigestResponse {
  summary: string;
  fragments: { captureId: string; text: string; relevanceToSeed: number }[];
}

// Ask the proxy to clean each transcript, summarize the night, and score each
// fragment against the planted seed. Throws when unconfigured/unreachable —
// callers fall back to the offline digest.
export async function requestDigest(
  seed: Seed,
  transcripts: Transcript[]
): Promise<Digest> {
  if (!PROXY_BASE_URL) throw new Error('proxy not configured');
  const res = await fetch(`${PROXY_BASE_URL}/digest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    // Only what's needed: seed text + transcript text. Never raw audio here.
    body: JSON.stringify({
      seed: { title: seed.title, problem: seed.problem },
      fragments: transcripts.map((t) => ({ captureId: t.captureId, raw: t.raw })),
    }),
  });
  if (!res.ok) throw new Error(`proxy digest failed: ${res.status}`);
  const data = (await res.json()) as DigestResponse;
  const fragments: DigestFragment[] = data.fragments.map((f) => ({
    captureId: f.captureId,
    text: f.text,
    relevanceToSeed: clamp01(f.relevanceToSeed),
    keep: 'undecided',
  }));
  return {
    id: newId(),
    seedId: seed.id,
    summary: data.summary,
    fragments,
    generatedAt: nowISO(),
  };
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(n) ? n : 0));
}
