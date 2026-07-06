# Spec 03 — Transcription + overnight fragment collection

**Ticket:** T-013
**Loop stage:** CAPTURE → (bridge to) HARVEST
**Surface:** background / non-interactive

## User story

As someone who captured several fragments overnight, I want each one transcribed and collected under the problem I planted, so that in the morning there's readable text tied to my seed instead of a pile of unlabeled audio clips.

## Flow

1. After a capture is persisted (Spec 02), transcription is attempted for that `Capture`.
2. Transcription runs via the configured `transcriptionMode` (`device` STT or `proxy`) — see `settingsStore` and `src/lib/transcription.ts`.
3. On success a `Transcript` is attached to the capture (`attachTranscript`) with `raw` text, `source`, and `confidence` if available. `cleaned` stays `null` until the digest step (Spec 04) runs Claude cleanup.
4. All of tonight's captures remain collected under the seed via `seedId` / `Seed.captureIds` — an ordered overnight stack.
5. Transcription can lag or run in batch (e.g. deferred to morning) without blocking capture; the capture surface never waits on it.

## Acceptance criteria

- [ ] Each capture gets a `Transcript` with `raw` and correct `source` (`device` | `proxy`).
- [ ] Transcription failure (no network, STT error) **never loses the capture**; raw audio stays playable and a retry is possible.
- [ ] Transcript is a lossy layer only — audio remains the source of truth (`audioUri` untouched).
- [ ] Captures are correctly collected under tonight's seed (`seedId`) and appear in capture order.
- [ ] `confidence` stored when the STT provides it; absent gracefully otherwise.
- [ ] If `transcriptionMode` is `proxy`, audio/transcript goes only through the server-side proxy (no keys in client) and only when the user opted in.
- [ ] `npx tsc --noEmit` passes.

## Notes for later

- On-device offline transcription for full privacy (fast-follow).
- Language detection / multi-language.
- Denoise / boost mumbled half-asleep audio before STT.
- Batch transcription cost/latency optimization; retry/backoff policy.
