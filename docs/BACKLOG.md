# BACKLOG — Dream-to-Creativity Capture

Ordered tickets in milestones. Work top to bottom; respect dependencies. Each ticket lists acceptance criteria; the linked spec (where noted) holds the full flow. Every ticket must also meet the **Definition of Done** at the bottom.

---

## Milestone M0 — Foundation

### T-001 — Scaffold Expo app
Set up Expo SDK 56 + RN + TS (strict) + expo-router. App boots to a placeholder home route.
- [ ] `npx expo start` launches; app renders.
- [ ] `tsconfig` strict mode on; `npx tsc --noEmit` passes.
- [ ] expo-router file routing in place per `docs/ARCHITECTURE.md` folder structure.

### T-002 — Data model + storage
Create `src/types.ts` exactly per `docs/ARCHITECTURE.md`, plus AsyncStorage load/save helpers.
- [ ] `types.ts` defines Seed, Capture, Transcript, Digest (+ unions) as specified.
- [ ] `src/lib/storage.ts` persists/loads JSON to AsyncStorage.
- [ ] `npx tsc --noEmit` passes.

### T-003 — State stores
Implement `seedsStore` and `settingsStore` (Zustand) with the state contract in `docs/ARCHITECTURE.md`.
- [ ] Stores expose the specified actions/invariants.
- [ ] Stores hydrate from and persist to AsyncStorage.
- [ ] Adding a capture persists the audio reference before any transcription attempt.

### T-004 — Theme system
Implement daylight + nighttime-capture palettes and typography per `docs/DESIGN.md`.
- [ ] `src/theme/colors.ts` exports both palettes; nighttime palette is true-dark/low-light.
- [ ] Theme provider in root layout; capture route uses nighttime palette.
- [ ] Banned words absent from all copy constants.

---

## Milestone M1 — The loop (MVP)

### T-010 — Seed entry (Spec 01)
Screen to name and articulate tonight's problem. Spec: `docs/specs/01-seed-entry-priming.md`.
- [ ] User can enter title + problem; a `Seed` (status `draft`) is created and persisted.
- [ ] Validation: cannot plant an empty problem.
- [ ] Daylight palette, calm copy, no banned words.

### T-011 — Priming ritual (Spec 01)
Short guided pre-sleep prime that loads the seed and hands off to capture. Spec: `docs/specs/01-seed-entry-priming.md`.
- [ ] Completing the ritual sets `plantedAt`, status `planted`, `activeSeedId`.
- [ ] Ritual dims progressively toward the dark capture handoff.
- [ ] Silent-friendly; no bright screens at the end.

### T-012 — Eyes-closed voice capture (Spec 02) — CRITICAL
The huge tap-anywhere, dark, silent, no-typing nighttime capture surface. Spec: `docs/specs/02-eyes-closed-capture.md`.
- [ ] Tap-anywhere target fills full width + large majority of height.
- [ ] True-dark palette; lowest brightness; no luminance spikes.
- [ ] Silent by default; optional confirm-haptic off by default.
- [ ] No typing / no text input anywhere on the surface.
- [ ] Tap starts recording near-instantly; tap stops; multiple captures per night supported.
- [ ] Raw audio persisted immediately via `addCapture` (never lost, even on crash/kill).
- [ ] Each HARD RULE in `AGENTS.md` verified explicitly.

### T-013 — Transcription + collection (Spec 03)
Transcribe each capture and stack fragments against tonight's seed. Spec: `docs/specs/03-transcription-collection.md`.
- [ ] Each capture gets a `Transcript` (device or proxy per settings).
- [ ] Transcription failure never loses the capture; raw audio remains playable.
- [ ] Captures are collected under the correct seed via `seedId`.

### T-014 — Morning digest → seed (Spec 04)
Generate and show a cleaned digest linking fragments to the seed, with keep/discard. Spec: `docs/specs/04-morning-digest.md`.
- [ ] `generateDigest` calls the Claude proxy (no keys in client) and builds a `Digest`.
- [ ] Digest restates the seed, shows an AI summary, lists fragments ordered by `relevanceToSeed`.
- [ ] Keep/discard per fragment persists `KeepState`.
- [ ] Offline fallback: digest shows raw/cleaned transcripts without the AI summary.

### T-015 — Seed & solutions archive (Spec 05)
Searchable history of seeds, captures, and kept solutions. Spec: `docs/specs/05-seed-solutions-archive.md`.
- [ ] List of all seeds with status and kept-count.
- [ ] Open a seed to see its captures, digest, and kept fragments.
- [ ] Text search across seed titles/problems and kept fragment text.

---

## Milestone M2 — Polish & trust

### T-020 — Onboarding forces a first seed
- [ ] First run explains the loop (capture, not dreaming) and requires planting one seed.

### T-021 — Privacy & data controls
- [ ] Local-first confirmed; explicit opt-in for the proxy transcription path; delete-capture and delete-seed controls.

### T-022 — Bedtime reminder (habit)
- [ ] Optional gentle reminder to plant a seed; silent-respecting; user-configurable.

---

## Definition of Done

A ticket is done only when **all** of the following hold:

1. All acceptance-criteria checkboxes are satisfied.
2. `npx tsc --noEmit` passes with strict TS and no `any`.
3. Types come from `src/types.ts`; no local re-definitions of model shapes.
4. No secrets/keys/provider URLs in the client; AI/backend via proxy only.
5. Raw audio is never discarded on any capture path.
6. If the ticket touches a nighttime-capture surface, **every HARD RULE in `AGENTS.md` is verified explicitly** (huge tap target, no typing, silent, true-dark, no luminance spike).
7. Copy follows `docs/DESIGN.md` and contains **no banned words** ("sharp", "creative", grounded-mystical register).
8. The change serves the plant → capture → harvest loop; anything else is captured in the spec's notes-for-later, not built.
9. Committed referencing the ticket id.
