import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateDigestForSeed } from '../lib/digest';
import { newId, nowISO } from '../lib/id';
import { zustandStorage } from '../lib/storage';
import {
  Capture,
  Digest,
  ID,
  KeepState,
  Seed,
  Transcript,
} from '../types';

interface SeedsState {
  seeds: Seed[];
  captures: Capture[];
  transcripts: Transcript[];
  digests: Digest[];
  activeSeedId: ID | null; // tonight's seed
  hydrated: boolean;

  createSeed: (title: string, problem: string) => Seed;
  primeSeed: (id: ID) => void;
  // Persists the audio reference immediately; transcript filled later.
  addCapture: (seedId: ID, audioUri: string, durationMs: number) => Capture;
  attachTranscript: (captureId: ID, transcript: Transcript) => void;
  // Calls the proxy; falls back to raw transcripts if offline. Never deletes captures.
  generateDigest: (seedId: ID) => Promise<Digest>;
  saveDigest: (digest: Digest) => void;
  setCaptureKeep: (captureId: ID, keep: KeepState) => void;
  setFragmentKeep: (digestId: ID, captureId: ID, keep: KeepState) => void;
  archiveSeed: (id: ID) => void;
  setHydrated: () => void;
}

export const useSeedsStore = create<SeedsState>()(
  persist(
    (set, get) => ({
      seeds: [],
      captures: [],
      transcripts: [],
      digests: [],
      activeSeedId: null,
      hydrated: false,

      createSeed: (title, problem) => {
        const seed: Seed = {
          id: newId(),
          title: title.trim(),
          problem: problem.trim(),
          createdAt: nowISO(),
          plantedAt: null,
          status: 'draft',
          captureIds: [],
          digestId: null,
        };
        set((s) => ({ seeds: [...s.seeds, seed] }));
        return seed;
      },

      primeSeed: (id) =>
        set((s) => ({
          seeds: s.seeds.map((seed) =>
            seed.id === id
              ? { ...seed, plantedAt: nowISO(), status: 'planted' as const }
              : seed
          ),
          activeSeedId: id,
        })),

      addCapture: (seedId, audioUri, durationMs) => {
        const capture: Capture = {
          id: newId(),
          seedId,
          audioUri, // never mutated after creation
          durationMs,
          capturedAt: nowISO(),
          transcript: null,
          keep: 'undecided',
        };
        set((s) => ({
          captures: [...s.captures, capture],
          seeds: s.seeds.map((seed) =>
            seed.id === seedId
              ? { ...seed, captureIds: [...seed.captureIds, capture.id] }
              : seed
          ),
        }));
        return capture;
      },

      attachTranscript: (captureId, transcript) =>
        set((s) => ({
          transcripts: [
            ...s.transcripts.filter((t) => t.captureId !== captureId),
            transcript,
          ],
          captures: s.captures.map((c) =>
            c.id === captureId ? { ...c, transcript } : c
          ),
        })),

      generateDigest: async (seedId) => {
        const state = get();
        const seed = state.seeds.find((s) => s.id === seedId);
        if (!seed) throw new Error(`unknown seed: ${seedId}`);
        const { digest } = await generateDigestForSeed(
          seed,
          capturesForSeed(state, seedId)
        );
        get().saveDigest(digest);
        return digest;
      },

      saveDigest: (digest) =>
        set((s) => ({
          // A digest never deletes captures.
          digests: [...s.digests.filter((d) => d.seedId !== digest.seedId), digest],
          seeds: s.seeds.map((seed) =>
            seed.id === digest.seedId
              ? { ...seed, digestId: digest.id, status: 'harvested' as const }
              : seed
          ),
        })),

      setCaptureKeep: (captureId, keep) =>
        set((s) => ({
          captures: s.captures.map((c) =>
            c.id === captureId ? { ...c, keep } : c
          ),
        })),

      setFragmentKeep: (digestId, captureId, keep) => {
        get().setCaptureKeep(captureId, keep);
        set((s) => ({
          digests: s.digests.map((d) =>
            d.id === digestId
              ? {
                  ...d,
                  fragments: d.fragments.map((f) =>
                    f.captureId === captureId ? { ...f, keep } : f
                  ),
                }
              : d
          ),
        }));
      },

      archiveSeed: (id) =>
        set((s) => ({
          seeds: s.seeds.map((seed) =>
            seed.id === id ? { ...seed, status: 'archived' as const } : seed
          ),
          activeSeedId: s.activeSeedId === id ? null : s.activeSeedId,
        })),

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'dream-capture-seeds-v1',
      storage: zustandStorage,
      partialize: ({ seeds, captures, transcripts, digests, activeSeedId }) => ({
        seeds,
        captures,
        transcripts,
        digests,
        activeSeedId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

export function capturesForSeed(state: SeedsState, seedId: ID): Capture[] {
  return state.captures
    .filter((c) => c.seedId === seedId)
    .sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
}

export function digestForSeed(state: SeedsState, seedId: ID): Digest | null {
  return state.digests.find((d) => d.seedId === seedId) ?? null;
}

export function keptCountForSeed(state: SeedsState, seedId: ID): number {
  return state.captures.filter((c) => c.seedId === seedId && c.keep === 'kept')
    .length;
}
