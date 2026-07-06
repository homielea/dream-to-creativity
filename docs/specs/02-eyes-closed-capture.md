# Spec 02 — Eyes-closed voice capture (CRITICAL)

**Ticket:** T-012
**Loop stage:** CAPTURE
**Surface:** nighttime mode (true-dark, low-light)

> This is the make-or-break screen. It is used by a **half-asleep person, in a dark bedroom, with their eyes closed.** Every decision here optimizes for that human. If this screen is even slightly hard, the whole product fails. Re-read the HARD RULES in `AGENTS.md` before building.

## User story

As someone who just surfaced an idea at 4am while barely awake, I want to grab my phone, tap without aiming or looking, and speak — then drop back to sleep — so that the idea is captured before it evaporates and I never have to wake up, read, or type.

## Flow

1. The capture surface is reached from the priming handoff (Spec 01) or directly from home for tonight's `activeSeedId`. It is already dark and dim.
2. The **entire screen is the tap target.** The user taps anywhere. Recording starts near-instantly.
3. State is shown only by a single slow, dim amber pulse — no reading required. Optional confirm-haptic (off by default) may tick once at record-start.
4. The user speaks. Mumbled, fragmentary, half-asleep speech is expected and fine.
5. The user taps anywhere again to stop. The capture is persisted immediately (`addCapture`) — audio reference saved **before** any transcription.
6. The surface returns to a resting dark state, ready for the next capture. **Multiple captures per night** are supported without any navigation.
7. If the app is killed or crashes mid-night, already-persisted captures survive; an in-progress recording is flushed to disk as robustly as possible.

## HARD RULES this screen must satisfy (verify each explicitly)

- [ ] **Huge tap target:** interactive area fills full width and the large majority of the height — effectively "tap anywhere." No small button to aim at.
- [ ] **No typing:** zero keyboard, text fields, or fine-motor input anywhere on the surface.
- [ ] **Silent by default:** no sounds, no notification chimes, no partner-waking haptics. Optional single confirm-haptic is off by default.
- [ ] **True dark / low-light:** near-black background, dim red/amber accents only, lowest legible brightness. No white, no bright transitions, no full-screen luminance spike.

## Acceptance criteria

- [ ] Tapping anywhere on the surface starts recording; tapping again stops it.
- [ ] Time from tap to recording-active feels instant (no launch animation blocking capture).
- [ ] Raw audio persisted immediately on stop via `addCapture(seedId, audioUri, durationMs)`; `audioUri` never mutated afterward.
- [ ] Capture is linked to the current `activeSeedId`.
- [ ] Multiple captures in one night work without leaving the surface.
- [ ] Recording indicator is a single slow, dim amber pulse — no strobing, no bright flash.
- [ ] Screen brightness is lowered on entry and restored on exit; brightness is never raised here.
- [ ] All four HARD RULES above verified.
- [ ] No banned words in any (dim, minimal) copy.
- [ ] `npx tsc --noEmit` passes.

## Edge cases

- Microphone permission denied → handle gracefully in daylight, never with a bright modal at night; degrade to a clear morning prompt.
- Phone locked / screen off → document the intended behavior (e.g. rely on the user tapping the phone awake into this screen); do not require unlock gymnastics. Keep it as simple as physically possible.
- Extremely short taps / accidental double-taps → debounce so a fumbled tap doesn't discard a real capture.
- Very long recording (user fell asleep recording) → cap duration sensibly; still persist what was captured.

## Notes for later

- Wake-word or hardware-button start (no tap at all).
- Background/lock-screen capture.
- Auto-stop on prolonged silence.
- Haptic-only "you're recording" reassurance patterns for total darkness.
