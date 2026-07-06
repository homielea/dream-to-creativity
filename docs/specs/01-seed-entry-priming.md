# Spec 01 — Seed entry + pre-sleep priming ritual

**Tickets:** T-010 (seed entry), T-011 (priming ritual)
**Loop stage:** PLANT
**Surface:** daylight mode → dims toward nighttime handoff

## User story

As a professional with a hard problem, I want to name the exact thing I'm stuck on and do a short pre-sleep ritual to load it into my mind, so that my sleeping brain works on the right problem and I'm ready to capture whatever surfaces.

## Flow

1. From home, user taps "Plant a problem."
2. **Seed entry:** user types a short **title** (e.g. "Act 2 feels flat") and a fuller **problem** articulation ("The midpoint has no reversal; the reader has no reason to keep going"). Copy prompt: "What are you turning over tonight?"
3. On save, a `Seed` is created with status `draft` and persisted.
4. User taps "Prime & sleep." The **priming ritual** begins.
5. **Priming ritual:** a short, slow, low-stimulation guided sequence that restates the problem back to the user and encourages them to hold it, then let it go. A few unhurried steps ("Read it once more" → "Hold the problem" → "Let it go. Sleep on it"). Screen brightness and contrast step **down** progressively.
6. On completion: `plantedAt` set, status → `planted`, `activeSeedId` set to this seed.
7. Ritual hands off to the eyes-closed capture surface (Spec 02) already dark and dim — so if the user drifts off, one tap captures.

## Acceptance criteria

- [ ] User can enter a title and a problem; empty problem cannot be planted (validation).
- [ ] Saving creates a persisted `Seed` (status `draft`) using `createSeed`.
- [ ] Priming completion sets `plantedAt`, status `planted`, and `activeSeedId` via `primeSeed`.
- [ ] The ritual is slow-paced and steps brightness/contrast down toward the dark handoff.
- [ ] Handoff lands on the capture surface in nighttime (true-dark) mode, ready to record with one tap.
- [ ] Daylight-mode entry uses the calm palette and copy from `docs/DESIGN.md`.
- [ ] No banned words ("sharp", "creative", grounded-mystical) in any copy.
- [ ] `npx tsc --noEmit` passes.

## Notes for later

- Multiple active seeds / "problem stack" (fast-follow) — MVP is one active seed.
- Optional gentle audio guidance during priming (before sleep, so sound may be acceptable — validate against the silent-at-night principle).
- Personalized priming length; remembered from last use.
- Smart bedtime reminder that deep-links straight into seed entry.
