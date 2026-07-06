# PRD — Dream-to-Creativity Capture

## Problem & insight

Professionals who work on hard problems routinely surface ideas at the edge of sleep — in the hypnagogic drift going down and the hypnopompic haze coming up. These states are non-linear and genuinely generative (the sewing-machine needle, the benzene ring, *Yesterday*). **The problem is not producing the idea. The problem is catching it.** By the time you are awake enough to write, the idea has dissolved.

Existing tools fail this exact moment:
- **Dream journals** are retrospective and assume you'll recall and type in the morning — too late.
- **Lucid-dreaming apps** sell a hard-to-learn skill and churn.
- **Voice memos** assume you are awake, looking at the screen, and aiming at a small button — impossible half-asleep in the dark.

**Insight / wedge:** don't sell the dream, sell **capture**. Give an obsessed professional the lowest-friction possible way to (a) load a specific problem into their mind before sleep, (b) speak whatever surfaces without opening their eyes or typing, and (c) wake up to a clean digest tied back to the problem they planted.

## Target user

Creative professionals and founders who obsess over problems and already believe in incubation:

- Writers / screenwriters / songwriters stuck on a plot, hook, or line.
- Designers / architects chasing an unresolved form.
- Engineers / researchers holding a bug, model, or proof in their head.
- Founders turning over a strategic or product decision.

They keep a notebook by the bed. They say "let me sleep on it" and mean it. They have felt an idea evaporate and it hurt.

### Anti-persona

- **The novelty-seeking lucid-dreaming hobbyist.** Wants entertainment and dream-control tricks; will churn when there's no game.
- **The seed-less user.** Has no active problem to plant. Without a seed there is nothing to harvest — the loop cannot run and the product has no value for them. Onboarding must surface this fast rather than pretend otherwise.

## Non-negotiable principles

1. **The loop is the product: plant → capture → harvest.** Every feature serves planting a seed, capturing in the dark, or harvesting a digest linked to the seed.
2. **Nighttime capture is designed for a half-asleep person, in the dark, eyes closed.** Huge tap target, no typing, silent, true-dark, instant.
3. **Never lose raw audio.** Transcription and AI cleanup are lossy conveniences over the recording, which is the source of truth.
4. **Sell capture, not dream magic.** Copy and positioning lead with real captured artifacts and incubation research, never mysticism.
5. **Privacy of the bedroom.** Local-first; audio only leaves the device through a transcription path the user explicitly opts into; no third-party audio sharing.
6. **No keys in the client.** All AI/backend via server-side proxy.

## MVP scope

| # | Feature | What it is | Spec |
| --- | --- | --- | --- |
| 1 | Seed entry + priming ritual | Name tonight's specific problem, then a short guided prime that loads it before sleep. | `docs/specs/01-seed-entry-priming.md` |
| 2 | Eyes-closed voice capture | One huge tap target; true dark; silent; no typing; multiple captures/night. | `docs/specs/02-eyes-closed-capture.md` |
| 3 | Transcription + collection | Record → transcribe → stack fragments against tonight's seed. | `docs/specs/03-transcription-collection.md` |
| 4 | Morning digest → seed | Auto-cleaned digest linking fragments to the seed; keep/discard pass. | `docs/specs/04-morning-digest.md` |
| 5 | Seed & solutions archive | Every seed, its captures, and what was kept — searchable over time. | `docs/specs/05-seed-solutions-archive.md` |

## Fast-follow (post-MVP, high priority)

- Integrations: export kept solutions to Notion / Obsidian / Linear / Things.
- Smart bedtime reminder to plant a seed (habit formation).
- Multiple active seeds / "problem stack."
- On-device (offline) transcription option for full privacy.
- Digest tone/length preferences.

## Out of scope (MVP)

- Lucid-dreaming training, reality checks, dream-control mechanics.
- Sleep tracking / staging / alarms.
- Social feed, public sharing surfaces (beyond a manual share of one cleaned digest).
- Team / studio shared boards (that's the team tier, later).
- Rich text editing of captures at night.

## Success metrics

**North star:** *kept solutions per active user per week* — the harvested-value signal, proof the loop closes.

Supporting:
- **Seed → capture conversion:** % of nights with a planted seed that get ≥1 capture.
- **Capture usability:** time from tap-to-record and record-to-persisted (must feel instant); capture success rate (no lost audio).
- **Harvest engagement:** % of digests opened; % of fragments given an explicit keep/discard.
- **Retention:** W1/W4 retention among users who planted ≥1 seed in week 1.
- **Trust:** transcription "good enough to understand intent" rating.

## Risks → mitigations

| Risk | Mitigation |
| --- | --- |
| "Does it work?" skepticism | Lead with incubation research + real captured artifacts + testimonials; value is capture, not magic. |
| Nighttime UX unusable half-asleep | HARD RULES in `AGENTS.md`; obsessive spec in `docs/specs/02`; test as a half-asleep-in-the-dark user. |
| Empty-loop churn (no seed) | Priming ritual, onboarding forces first seed, gentle bedtime reminder. |
| Poor transcription of mumbled speech | Keep raw audio always; AI cleanup digests intent, not verbatim; let user replay audio. |
| Bedroom-audio privacy fears | Local-first, explicit opt-in for the transcription path, clear data controls, no third-party audio. |
| Bright screen wakes user/partner | True-dark mode enforced; no luminance spikes; silent by default. |

## Open questions

- Where does transcription run for MVP — device STT, or send audio to the proxy? (Privacy vs. quality tradeoff; see `docs/ARCHITECTURE.md`.)
- One active seed per night, or allow a small stack? (MVP leans one; fast-follow multi.)
- How aggressive should AI cleanup be — light denoise vs. interpretive digest? Default light, user-tunable later.
- Should the priming ritual include audio/voice, given the silent-at-night rule? (Priming happens *before* sleep, so gentle audio may be acceptable — validate.)
- Free-tier limits that prove night-one value without cannibalizing the subscription.
