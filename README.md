# Dream-to-Creativity Capture

> Plant a problem before sleep. Harvest the 4am solution before it evaporates. We sell **capture**, not dreaming.

A voice-first mobile app for people who solve problems in their sleep and lose the answer by breakfast. At night you articulate a specific problem (a "seed"). In the dark, half-asleep, you tap one giant button and speak whatever surfaces — eyes closed, no typing, silent. By morning you get an auto-transcribed, cleaned-up **digest** that ties every fragment back to the seed you planted.

---

## The insight (the wedge)

The "I solved it in a dream" myth is real — the sewing-machine needle, the benzene ring, Paul McCartney's *Yesterday*. But everyone forgets the dream by breakfast. **We are not selling the dream. We are selling capture.**

That single reframing does three things:

1. **Dodges the lucid-dreaming churn trap.** Lucid-dreaming apps sell a skill most users never master, then churn. We sell a tool that works on night one, for anyone, with zero training.
2. **Points at a paying, motivated audience.** Professionals who already believe in incubation ("sleeping on it") and who lose real money/ideas when a 4am insight evaporates.
3. **Sidesteps the "does dream magic work?" debate.** Hypnagogic and hypnopompic states genuinely surface non-linear ideas. Whether you call it a dream or not, the capture is real and the value is real.

**Wedge in one line:** the world's lowest-friction way to catch an idea while you are barely conscious.

## Positioning

- **Not** a dream journal (those are backward-looking, retrospective, and gamified around recall).
- **Not** a lucid-dreaming trainer (skill-gated, high churn, toy-novelty perception).
- **Not** a generic voice-memo app (no priming, no seed-linking, no digest, and its UX assumes you are awake and looking at the screen).
- **We are** a *problem-incubation and capture instrument* for professional minds — the notebook on the nightstand, reimagined for the exact moment you are least able to write.

Category: creativity / productivity / sleep-adjacent.

## Target user

Creative professionals and founders who obsess over problems and already practice incubation:

- Writers, screenwriters, songwriters stuck on a plot/hook.
- Designers and architects chasing a form that won't resolve.
- Engineers and researchers holding a hard bug or proof in their head.
- Founders turning over a strategic or product decision.

Shared traits: they keep a notebook by the bed, they believe "sleep on it" works, and they have felt the specific pain of an idea dissolving before they could grab it.

**Anti-persona:** the lucid-dreaming hobbyist chasing novelty/entertainment, and the casual user with no active problem to plant. If there is no seed, there is nothing to harvest — the loop is dead.

## MVP

The whole product is one loop: **plant → capture → harvest.**

1. **Seed entry + pre-sleep priming ritual** — name the specific problem, then a short guided prime that loads it into your mind before you drift off.
2. **Eyes-closed voice capture** — one huge tap target, true dark, silent, no typing. Usable by a half-asleep person who never opens their eyes. Multiple captures per night.
3. **Auto-transcription + overnight fragment collection** — each capture is recorded, transcribed, and stacked against tonight's seed.
4. **Morning digest** — an auto-cleaned summary that links fragments back to the seed, with a fast keep/discard pass.
5. **Seed history + "solutions harvested" archive** — every seed, its captures, and what you kept, searchable over time.

## Monetization

- **Prosumer subscription** (individual): unlimited seeds/captures, cloud transcription, digest cleanup, full archive/search. Free tier capped (e.g. a few seeds, local-only transcription, no cleanup) to prove night-one value.
- **Team / studio tier**: shared seed boards, per-project archives, and export into the tools a studio already lives in.
- **Integrations** (later): push kept solutions into Notion, Obsidian, Linear, or Things.

## GTM

- **Beachhead:** writers and indie founders — communities that already romanticize the notebook-by-the-bed and love a beautiful tool. Seed via Twitter/X build-in-public, indie-hacker and writing newsletters, and a few high-credibility testimonials.
- **Proof, not magic:** lead every touchpoint with incubation research and real "here's what I caught last night" artifacts, never with dream mysticism.
- **Loop content:** the digest is inherently shareable ("look what I caught at 4am") — instrument a tasteful share of the *cleaned* digest as the primary viral surface.
- **Land-and-expand to teams:** once individuals at a studio use it, sell the shared seed board.

## Risks

| Risk | Mitigation |
| --- | --- |
| "Does it actually work?" skepticism | Lean on incubation/hypnagogia research + testimonials; value is real capture regardless of "dream magic." |
| Nighttime UX fails a half-asleep user | Treat the dark eyes-closed capture as make-or-break; obsess over tap target, silence, latency, and forgiving audio. |
| Empty-loop churn (no seed → no harvest) | Priming ritual + reminders make planting a habit; onboarding forces a first seed. |
| Transcription of mumbled, half-asleep speech is poor | Keep raw audio always; treat transcript as a lossy convenience; AI cleanup digests intent, not verbatim. |
| Privacy of overnight audio in the bedroom | Local-first storage, explicit consent, no audio to any third party except the transcription path the user opts into. |

## Tech stack

Docs-only package. Intended implementation (see `docs/ARCHITECTURE.md` for the full table):

- **Expo SDK 56** + React Native + TypeScript
- **expo-router** (file-based navigation)
- **Zustand** (state) + **AsyncStorage** (persistence)
- **expo-av / expo-audio** (recording) + **speech-to-text/transcription**
- **Anthropic Claude via a server-side proxy** for transcript cleaning, digesting, and seed-linking — **no API keys in the client.**

## Run instructions

This repository is a **documentation package only — there is no app code here.** To work the package:

1. Read `AGENTS.md` first (build-agent rules and workflow).
2. Read `docs/PRD.md`, then `docs/ARCHITECTURE.md`, then `docs/DESIGN.md`.
3. Work tickets in order from `docs/BACKLOG.md`; each MVP feature has a spec in `docs/specs/`.

When app scaffolding exists, the expected commands are:

```bash
npm install
npx expo start          # run the app (Expo Go / dev client)
npx tsc --noEmit        # type-check — must pass before any ticket is done
```

## End-to-end verification

The browser journey that verified this app during development is committed,
not ephemeral. With the app running on web:

```bash
npx expo start --web --port 8091   # terminal 1
npm run e2e                          # terminal 2
```

`e2e/verify.mjs` drives the full first-run journey in a real browser and
asserts the product's promises, not just that screens render. `PORT`
overrides the port; `PW_CHROMIUM` points at a chromium binary when
playwright's own download isn't available.
