# Spec 04 — Morning digest linking captures to the seed

**Ticket:** T-014
**Loop stage:** HARVEST
**Surface:** daylight mode

## User story

As someone who wakes up to a pile of overnight fragments, I want a clean summary that ties what I said back to the problem I planted and lets me quickly keep the useful bits, so that I harvest real ideas without wading through messy raw audio.

## Flow

1. In the morning, the user opens tonight's seed (or the digest surfaces from home).
2. `generateDigest(seedId)` calls the **Claude proxy** (no keys in client). Claude: cleans each transcript, writes a short `summary` of the night, and scores each fragment's `relevanceToSeed` (0..1) against the planted problem.
3. A `Digest` is built and persisted; the seed's `digestId` is set and status → `harvested`.
4. **Digest view** shows, top to bottom: the **seed restated**, the **AI summary**, then **fragments ordered by `relevanceToSeed`** (most relevant first). Each fragment shows cleaned text, a play control for the raw audio, and a keep/discard toggle.
5. The user does a fast **keep/discard pass**. Each choice persists a `KeepState` on the fragment/capture (`setKeep`).
6. Kept fragments become the seed's "harvested solutions," surfaced in the archive (Spec 05).

## Acceptance criteria

- [ ] `generateDigest` calls the server-side Claude proxy only; no keys/URLs in the client.
- [ ] Digest restates the seed, shows a Claude `summary`, and lists `DigestFragment`s ordered by `relevanceToSeed` descending.
- [ ] Each fragment offers cleaned text + raw-audio playback + keep/discard.
- [ ] Keep/discard persists `KeepState`; kept fragments are retrievable as the seed's harvest.
- [ ] Generating a digest sets `digestId` and status `harvested`; it never deletes captures or audio.
- [ ] **Offline / proxy-unreachable fallback:** the digest still renders each capture's raw/cleaned transcript and audio, minus the AI summary/scoring, and can be regenerated later.
- [ ] Copy is calm, concrete ("Here's what you caught"), no banned words, no mystical register.
- [ ] `npx tsc --noEmit` passes.

## Notes for later

- Digest tone/length preferences (terse vs. narrative).
- "Cross-night" digests when a seed spans multiple nights.
- One-tap export of kept solutions to Notion/Obsidian/Linear/Things (fast-follow).
- Let Claude propose a next-night refined seed based on what was caught.
- Share a single cleaned digest as the tasteful viral surface (GTM).
