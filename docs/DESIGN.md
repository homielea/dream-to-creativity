# DESIGN — Dream-to-Creativity Capture

Two worlds share one product: a calm **daylight** mode for planting and harvesting, and a true-dark **nighttime capture** mode for the eyes-closed moment. The nighttime mode is the make-or-break; design everything else around protecting it.

## Design principles

1. **Instant over pretty.** In the dark, latency is the enemy. No launch animation before capture is possible.
2. **Dark protects sleep.** Never emit a bright screen into a dark bedroom. Lowest legible brightness always wins.
3. **The hand knows, the eyes don't.** Nighttime interactions assume closed eyes: tap-anywhere, no aiming, no reading.
4. **Calm, not clinical; confident, not mystical.** We're a fine instrument, not a crystal shop and not a hospital.

## Visual system

### Nighttime capture mode (DARK, low-light) — the critical surface

- **Background:** near-black (`#05060A` – `#0A0B10`). Never white, never a bright gradient, never a full-screen luminance spike.
- **Accents:** dim red / warm amber only (`#5A1F1F` fills, `#B0553A`/`#8A6A3B` for the faint recording indicator). Red/amber preserve dark adaptation better than blue/white. No bright blues or cool whites at night.
- **Text:** used sparingly and dim (`#5C5F6B` on near-black). A nighttime surface should be understandable with almost no reading.
- **Brightness:** request the lowest comfortable screen brightness on the capture screen; restore on exit. Never raise brightness at night.
- **Recording indicator:** a single, slow, dim pulse (amber) — low luminance, no strobing, no bright flash.
- **Motion:** minimal and slow. No bright transitions. Fade, never flash.

### Daylight mode (planting + harvesting)

- Calm, warm-neutral paper background (`#F4F1EA`), ink text (`#1D1B16`), a single restrained accent (deep indigo `#2B2A4A` or muted gold `#8A6A3B`).
- Generous whitespace, large readable type, unhurried. This is where naming, editing, keep/discard, and archive browsing happen — all the awake work.
- Respects system dark preference with a normal (not nighttime-capture) dark theme; the ultra-dark palette is reserved for the capture surface.

## Components

- **CaptureTarget** — the hero of the app. A full-bleed, tap-anywhere record surface on near-black. Covers full width and the large majority of height (see HARD RULES). Tap to start, tap again to stop; state shown only by a dim amber pulse. No small buttons, no labels to aim at.
- **SeedCard** — a planted problem: title, one-line problem, status, capture count. Used on home and archive.
- **PrimingRitual** — a short, guided, low-stimulation sequence that loads the seed into mind before sleep. Slow pacing, dim as it progresses toward the dark capture handoff.
- **FragmentItem** — one capture in a list: cleaned text (or raw fallback), duration, a play control for the raw audio, and a keep/discard toggle.
- **DigestView** — the morning harvest: seed restated at top, AI summary, then fragments ordered by relevance-to-seed, each with keep/discard.
- **KeepDiscardControl** — a large, forgiving two-choice control for the morning pass (daylight only).

## Voice & copy rules

- **Sell capture, not dreaming.** Lead with catching the idea, not with dream magic.
- **Calm, confident, spare.** Short lines. The user is either half-asleep or newly awake — never make them parse.
- **Concrete over mystical.** "Here's what you caught" beats "the veil between worlds."
- **Second person, present tense.** "Plant a problem." "Speak what surfaces." "Here's your harvest."
- **Reassure, don't hype.** Especially around whether it "works": point at capture, not miracles.

### The loop vocabulary (use consistently)

- **Plant / seed** — write the problem before sleep.
- **Capture / catch** — speak what surfaces in the night.
- **Harvest / digest** — read the cleaned morning summary.

### BANNED words

Do not use these anywhere in UI copy, marketing, or code comments that surface to users:

- **"sharp"** — off-brand for a calm nighttime tool.
- **"creative"** — telling the user they're being creative is cheap; show the captured idea instead.
- **any "grounded-mystical" register** — no "grounded," no mystical/woo vocabulary: no *magic*, *mystical*, *veil*, *portal*, *manifest*, *cosmic*, *soul*, *sacred*, *the universe*. We are a precise instrument, not an oracle.

### Copy examples

- Seed entry: "What are you turning over tonight?"
- Priming: "Hold the problem. Let it go. Sleep on it."
- Capture (dim, barely-there): "Tap anywhere. Speak."
- Digest header: "Here's what you caught."
- Empty archive: "Nothing planted yet. Start with one problem."
