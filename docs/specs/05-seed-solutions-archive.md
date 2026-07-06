# Spec 05 — Seed history + solutions harvested archive

**Ticket:** T-015
**Loop stage:** HARVEST (long-term value)
**Surface:** daylight mode

## User story

As a returning user, I want to browse every problem I've planted and the solutions I've harvested, and search across them, so that my accumulated 4am ideas become a lasting, retrievable body of work rather than one-off notes.

## Flow

1. From home, user opens the **Archive**.
2. Archive lists all seeds (most recent first): title, status, date, and a **kept-count** ("3 kept").
3. Tapping a seed opens **seed detail**: the original problem, its digest summary, all captures (with audio playback + transcripts), and the **kept fragments** highlighted as the harvest.
4. **Search:** a text query filters across seed titles/problems and kept-fragment text, so the user can find "that thing about the Act 2 reversal" months later.
5. From seed detail the user can revisit audio, re-run a digest, or archive the seed (status `archived`).

## Acceptance criteria

- [ ] Archive lists all seeds with status, date, and kept-count, most recent first.
- [ ] Seed detail shows the problem, digest summary, captures (audio + transcript), and kept fragments as the harvest.
- [ ] Text search filters across seed titles/problems and kept-fragment text.
- [ ] Raw audio remains playable for every capture (never discarded).
- [ ] Archiving a seed sets status `archived` without deleting its captures/digest.
- [ ] Empty state uses calm copy ("Nothing planted yet. Start with one problem."), no banned words.
- [ ] `npx tsc --noEmit` passes.

## Notes for later

- Tags / collections across seeds (e.g. per project, per book).
- Cross-seed themes ("you keep circling this idea") via Claude.
- Export the whole archive; sync/backup.
- Team/studio shared archive (team tier).
- Full-text search over all transcripts, not just kept fragments.
