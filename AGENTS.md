# AGENTS.md — Build-agent instructions

This is the operating manual for any agent building the **Dream-to-Creativity Capture** app. Read it fully before writing a single line of code.

## Read these first, in this order

1. `README.md` — what we're building and why (the "capture, not dreaming" wedge).
2. `docs/PRD.md` — problem, user, principles, scope, metrics.
3. `docs/ARCHITECTURE.md` — stack, folders, the `types.ts` data model, state contract, TS conventions.
4. `docs/DESIGN.md` — visual system, the dark nighttime-capture mode, voice/copy rules and banned words.
5. `docs/BACKLOG.md` — the ordered tickets you will execute.
6. `docs/specs/*.md` — one spec per MVP feature; the ticket you pick will name its spec.

## The product loop (never lose this)

**Plant → capture → harvest.** Every feature serves one of three moments: planting a problem seed at night, capturing fragments in the dark, or harvesting a morning digest linked back to the seed. If a change does not serve the loop, it is out of scope.

## HARD RULES — do not violate

These are non-negotiable. A ticket that breaks one is not done, no matter what else it achieves.

1. **The nighttime capture screen must be usable by a half-asleep person, in the dark, with their eyes closed.** Design and test for that human, not for an awake QA engineer holding the phone in daylight.
2. **Huge tap target.** The primary capture control must cover the vast majority of the screen — effectively "tap anywhere." Never require aiming at a small button. Minimum: the interactive area fills the full width and the large majority of the height.
3. **No typing during capture.** Voice only. Zero keyboard, zero text fields, zero fine-motor input on any nighttime-capture surface. Editing/naming happens in daylight surfaces only.
4. **Silent by default.** No sounds, no haptic bursts that could wake a partner, no notification chimes during the night. Any confirmation is visual and dim. (A single optional, gentle haptic tick to confirm record-start is the only permitted feedback, and it must be off by default.)
5. **True dark, low-light only on nighttime surfaces.** Near-black background, minimal dim-red/amber accents, the lowest legible brightness. Never flash a bright screen at a person in a dark bedroom. No white backgrounds, no bright whites, no full-screen luminance spikes.
6. **Never lose raw audio.** Persist the recording before/independently of transcription. Transcription and AI cleanup are lossy conveniences layered on top; the audio is the source of truth.
7. **No secrets in the client.** All Anthropic Claude / backend calls go through the server-side proxy. No API keys, tokens, or provider URLs embedded in the app. See `docs/ARCHITECTURE.md`.
8. **Strict TypeScript.** No `any`, no non-null-assertion abuse. `npx tsc --noEmit` must pass clean.

## Workflow per ticket

1. **Pick the top open ticket** in `docs/BACKLOG.md` (respect milestone order and dependencies).
2. **Open its linked spec** in `docs/specs/` and read the user story, flow, and acceptance-criteria checklist.
3. **Re-read the HARD RULES** if the ticket touches a nighttime-capture surface.
4. **Implement** the smallest change that satisfies the acceptance criteria. Match the folder structure, data model (`types.ts`), and state contract in `docs/ARCHITECTURE.md`. Match the visual system and copy rules in `docs/DESIGN.md` (mind the BANNED words).
5. **Type-check:** `npx tsc --noEmit` must pass.
6. **Self-verify against the acceptance-criteria checklist** in the spec. For any nighttime surface, verify each HARD RULE explicitly.
7. **Meet the Definition of Done** in `docs/BACKLOG.md`.
8. **Commit** referencing the ticket id (e.g. `T-012: eyes-closed capture screen`).

## Run commands

```bash
npm install
npx expo start          # launch the app (Expo Go / dev client)
npx tsc --noEmit        # strict type-check — required before a ticket is done
npx expo start --clear  # clear Metro cache if the bundler misbehaves
```

## Scope discipline

- Docs are the source of truth. If code and docs disagree, the docs win — fix the code or raise the conflict, do not silently diverge.
- Do not add features not in `docs/BACKLOG.md`. Capture ideas in the spec's "notes-for-later" section instead.
- Do not gold-plate the nighttime UX with animation or delight that costs latency or brightness. Boring, instant, and dark beats clever.
