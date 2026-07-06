# ARCHITECTURE — Dream-to-Creativity Capture

Docs-only package. This defines the intended implementation so every build agent produces the same shape.

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| App framework | **Expo SDK 56** | Managed workflow; dev client when native modules needed. |
| UI | **React Native** | — |
| Language | **TypeScript (strict)** | `npx tsc --noEmit` must pass; no `any`. |
| Navigation | **expo-router** | File-based routing. |
| State | **Zustand** | Small stores; see state contract below. |
| Persistence | **AsyncStorage** | Local-first; JSON-serialized stores. Source of truth for metadata. |
| Audio recording | **expo-av** (or `expo-audio`) | Records capture clips; files stored on device (FileSystem). Raw audio is never discarded. |
| Speech-to-text | **Transcription service** | MVP: device STT (`expo-speech-recognition` / platform STT) OR audio-to-proxy transcription. Decision open — see PRD. Transcript is a lossy layer over audio. |
| AI / backend | **Anthropic Claude via server-side proxy** | Used for cleaning/digesting transcripts and linking fragments to the seed. **No keys in client.** |

### AI / backend rules

- The client calls **our own proxy endpoint** (e.g. `POST /digest`, `POST /clean`), never Anthropic directly.
- The proxy holds the Anthropic API key and injects it server-side. **No API keys, provider URLs, or secrets in the app bundle.**
- Claude responsibilities (server side): clean a raw transcript into readable text; digest a night's fragments into a summary; link/score each fragment's relevance to the planted seed.
- Requests carry only what's needed (transcript text and seed text/metadata). Prefer sending transcripts, not raw audio, to the AI layer. If audio must be transcribed server-side, that is an explicit, opt-in path.
- The client degrades gracefully if the proxy is unreachable: raw audio + raw transcript are always retained locally; cleanup/digest can run later.

## Folder structure

```
dream-to-creativity/            # app root (created during build)
  app/                          # expo-router routes
    _layout.tsx                 # root layout, theme provider
    index.tsx                   # home / today (plant a seed or view tonight)
    seed/
      new.tsx                   # seed entry + priming ritual
      [id].tsx                  # seed detail (captures + digest)
    capture/
      index.tsx                 # EYES-CLOSED nighttime capture (dark, huge target)
    digest/
      [seedId].tsx              # morning digest + keep/discard
    archive/
      index.tsx                 # seed & solutions archive (searchable)
  src/
    types.ts                    # data model (below) — single source of truth
    store/
      seedsStore.ts             # seeds + captures + digests state (Zustand)
      settingsStore.ts          # theme, silent/haptic prefs, transcription mode
    lib/
      audio.ts                  # record/start/stop/persist; never loses raw audio
      transcription.ts          # STT wrapper (device or proxy)
      proxy.ts                  # calls to server-side Claude proxy (clean/digest/link)
      storage.ts                # AsyncStorage load/save helpers
      id.ts                     # id generation, timestamps
    theme/
      colors.ts                 # DARK nighttime palette + daylight palette
      typography.ts
    components/
      CaptureTarget.tsx         # the huge tap-anywhere record surface
      SeedCard.tsx
      FragmentItem.tsx
      DigestView.tsx
  docs/                         # this package's docs (already present)
```

## Data model (`src/types.ts`)

The model is the contract. All stores and screens use these types.

```typescript
// Unique id + ISO-8601 timestamp aliases
export type ID = string;
export type ISODate = string;

// A planted problem. The thing you incubate.
export interface Seed {
  id: ID;
  title: string;             // short problem name, e.g. "Act 2 feels flat"
  problem: string;           // the full articulation planted before sleep
  createdAt: ISODate;
  plantedAt: ISODate | null; // when the priming ritual completed
  status: SeedStatus;
  captureIds: ID[];          // captures collected against this seed
  digestId: ID | null;       // the morning digest, once generated
}

export type SeedStatus =
  | 'draft'      // written, not yet primed
  | 'planted'    // primed, awaiting the night
  | 'harvested'  // digest generated + reviewed
  | 'archived';

// A single overnight voice capture. Audio is the source of truth.
export interface Capture {
  id: ID;
  seedId: ID;
  audioUri: string;          // local file path — NEVER discarded
  durationMs: number;
  capturedAt: ISODate;
  transcript: Transcript | null; // lossy layer over audio; may lag or fail
  keep: KeepState;           // set during the morning keep/discard pass
}

export type KeepState = 'undecided' | 'kept' | 'discarded';

// Transcription of one capture.
export interface Transcript {
  captureId: ID;
  raw: string;               // verbatim STT output (messy, half-asleep speech)
  cleaned: string | null;    // Claude-cleaned readable text (server side)
  source: TranscriptSource;
  confidence: number | null; // 0..1 if the STT provides it
  createdAt: ISODate;
}

export type TranscriptSource = 'device' | 'proxy';

// The morning harvest for one seed: fragments summarized + linked to the seed.
export interface Digest {
  id: ID;
  seedId: ID;
  summary: string;           // Claude-generated overview of the night
  fragments: DigestFragment[];
  generatedAt: ISODate;
}

// One fragment inside a digest, tied back to its capture and scored vs the seed.
export interface DigestFragment {
  captureId: ID;
  text: string;              // cleaned fragment text
  relevanceToSeed: number;   // 0..1 — how much it speaks to the planted problem
  keep: KeepState;
}
```

## State contract

Two Zustand stores, both persisted to AsyncStorage.

**`seedsStore`** — owns seeds, captures, transcripts, digests.
- State: `seeds: Seed[]`, `captures: Capture[]`, `transcripts: Transcript[]`, `digests: Digest[]`, plus `activeSeedId: ID | null` (tonight's seed).
- Actions (representative):
  - `createSeed(title, problem): Seed`
  - `primeSeed(id): void` — sets `plantedAt`, status `planted`, `activeSeedId`.
  - `addCapture(seedId, audioUri, durationMs): Capture` — persists audio ref immediately; transcript filled later.
  - `attachTranscript(captureId, transcript): void`
  - `generateDigest(seedId): Promise<Digest>` — calls proxy; falls back to raw transcripts if offline.
  - `setKeep(captureId | fragment, keep): void`
  - `archiveSeed(id): void`
- Invariants: adding a capture must persist the audio reference **before** any transcription attempt. Never mutate `audioUri` after creation. A digest never deletes captures.

**`settingsStore`** — theme mode (`night` | `day` | `system`), `silent` (default true), `confirmHaptic` (default false), `transcriptionMode` (`device` | `proxy`), free/paid tier flags.

## Agent conventions

- **Strict TypeScript.** No `any`, no unchecked non-null assertions, exhaustive switch on union types (`SeedStatus`, `KeepState`, etc.).
- **`npx tsc --noEmit` must pass** before a ticket is done.
- Import types from `src/types.ts` — do not redefine model shapes locally.
- Keep side effects (audio, transcription, proxy, storage) in `src/lib/*`; screens and stores stay declarative.
- No secrets, keys, or provider URLs in the client — proxy only.
- Nighttime-capture surfaces obey the HARD RULES in `AGENTS.md` and the dark palette in `docs/DESIGN.md`.
