// Data model — the contract from docs/ARCHITECTURE.md. All stores and screens
// use these types; do not redefine model shapes locally.

// Unique id + ISO-8601 timestamp aliases
export type ID = string;
export type ISODate = string;

// A planted problem. The thing you incubate.
export interface Seed {
  id: ID;
  title: string; // short problem name, e.g. "Act 2 feels flat"
  problem: string; // the full articulation planted before sleep
  createdAt: ISODate;
  plantedAt: ISODate | null; // when the priming ritual completed
  status: SeedStatus;
  captureIds: ID[]; // captures collected against this seed
  digestId: ID | null; // the morning digest, once generated
}

export type SeedStatus =
  | 'draft' // written, not yet primed
  | 'planted' // primed, awaiting the night
  | 'harvested' // digest generated + reviewed
  | 'archived';

// A single overnight voice capture. Audio is the source of truth.
export interface Capture {
  id: ID;
  seedId: ID;
  audioUri: string; // local file path — NEVER discarded
  durationMs: number;
  capturedAt: ISODate;
  transcript: Transcript | null; // lossy layer over audio; may lag or fail
  keep: KeepState; // set during the morning keep/discard pass
}

export type KeepState = 'undecided' | 'kept' | 'discarded';

// Transcription of one capture.
export interface Transcript {
  captureId: ID;
  raw: string; // verbatim STT output (messy, half-asleep speech)
  cleaned: string | null; // Claude-cleaned readable text (server side)
  source: TranscriptSource;
  confidence: number | null; // 0..1 if the STT provides it
  createdAt: ISODate;
}

export type TranscriptSource = 'device' | 'proxy';

// The morning harvest for one seed: fragments summarized + linked to the seed.
export interface Digest {
  id: ID;
  seedId: ID;
  summary: string; // Claude-generated overview of the night
  fragments: DigestFragment[];
  generatedAt: ISODate;
}

// One fragment inside a digest, tied back to its capture and scored vs the seed.
export interface DigestFragment {
  captureId: ID;
  text: string; // cleaned fragment text
  relevanceToSeed: number; // 0..1 — how much it speaks to the planted problem
  keep: KeepState;
}
