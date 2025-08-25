# Wrestling Circle Jerks Haiku Forge — Gemini CLI Prompt

## Goal
Create a tiny app that generates sardonic, on‑brand **WWE haikus** for social posting. Must output **valid 5‑7‑5 syllable** lines, with options for tone, era, and wrestler references. Style: **Wrestling Circle Jerks**—irreverent, smart, a little mean but not cruel, heavy with insider nods and 80s/90s cable weirdness.

## Deliverables
Produce **two runnable targets in one repo**:

1) **Web App**
- Stack: Node 20, TypeScript, Vite + React, TailwindCSS.  
- UI: minimal, fast, keyboard‑friendly.  
- Components: 
  - inputs (wrestler(s), era, show, match type, tone slider, chaos slider, seed), 
  - generator panel with 3–5 haiku candidates, 
  - “Shuffle” (new seed), 
  - “Copy” and “Save as PNG” (text snapshot with a CRT/anaglyph CSS skin), 
  - “Export CSV/JSON”, 
  - toggle “SFW snark / Spicy snark”.
  - **Hashtags toggle** and **Share to X button** (see below).
- Branding: tiny header “Wrestling Circle Jerks // Haiku Forge”. Add a **CRT/anaglyph** CSS filter class and a subtle scanline background.
- Accessibility: proper labels, focus rings, no tiny text.
- No backend—pure client. Deterministic generation when a `seed` is present.

2) **CLI**
- Node + TypeScript (ts-node or compiled), single command `wcj-haiku`.
- Flags: `--wrestlers`, `--era`, `--show`, `--match`, `--tone`, `--chaos 0-10`, `--seed`, `--count`.
- Outputs newline‑separated haikus; `--json` option returns structured output.
- Flags for hashtags and share‑to‑X (see below).

## Core Logic
- **Syllable engine**: Implement a lightweight English syllable counter (dictionary + heuristic fallback). Reject/repair lines until they fit **5 / 7 / 5**.
- **Lexicon packs** (plain JSON files):
  - Wrestlers (classic + modern) with metadata: aliases, finishers, catchphrases, factions.
  - Eras: Rock ’n’ Wrestling, New Gen, Attitude, Ruthless Aggression, PG, Reality, Tribal Chief era, etc.
  - Shows/PPVs: RAW, SmackDown, NXT, Saturday Night’s Main Event, WrestleMania, Royal Rumble, Bash at the Beach (WCW nod ok), etc.
  - Tropes: screwjobs, run‑ins, dusty finishes, “creative has nothing”, cheap pops, pipe bombs, titantron glitches, pyro misfires.
  - Objects/venues: steel chairs, ladders, announce tables, Gorilla Position, catering, Pontiac Silverdome/Skydome, MSG.
  - Kireji‑like pivots: “but”, “still”, “meanwhile”, “however”, em‑dashes, ellipses.
- **Generator**:
  - Take inputs → pick context‑appropriate lexicon → draft candidate lines → validate syllables → post‑edit with light grammar polishing while preserving 5‑7‑5.
  - **Tone**: (“deadpan”, “nostalgic”, “petty”, “absurdist”).  
  - **Chaos**: 0 = literal, 10 = glitch‑poetic (weave in broadcast static, VHS drift, anaglyph verbs).  
  - Enforce **soft guardrails**: satirical jabs allowed; forbid slurs, real‑world hate, doxxing, or targeted harassment of non‑public figures.

## Determinism
- Implement a seedable RNG (e.g., mulberry32/xorshift). All random choices flow from `seed` so re‑runs are stable.

## Exports
- Web: copy to clipboard, download **CSV** (columns: id, seed, era, show, tone, chaos, line1, line2, line3, tags), download **PNG** of a single haiku card (use `html-to-image` or canvas).
- CLI: `--out haikus.csv` and/or `--json`.

## Hashtags & Share‑to‑X

### Web UI
- Add a **“Hashtags”** toggle (default **on**) and a **“Share to X”** button next to **Copy**.
- When generating a haiku, also produce a **hashtag set**:
  - Always include: `#WrestlingCircleJerks` and `#WrestlingHaiku`.
  - Then add up to **two** more relevant tags based on the current inputs (wrestler(s), era, show, match, tone).
  - Display as removable chips; if user deletes optional tags, don’t re‑add them unless **Shuffle** or inputs change.
- **Share to X** opens a new tab with a prefilled tweet via `https://x.com/intent/tweet?text=<ENCODED_TEXT>`.
  - Text format (no emojis, <= 280 chars):
    ```
    <line1> / <line2> / <line3> — <optional short context>
    <hashtags>
    ```
  - `<optional short context>` should be at most ~40 chars, derived from inputs (e.g., “RAW • Attitude Era”, “Daniel Bryan • Reality Era”). Omit if it risks exceeding 280.
  - Must URL‑encode safely. If over 280 chars, **truncate the context**, then drop optional hashtags (keep the two required), then as last resort compress separators to ` | `.

### Hashtag Generator (Library)
Implement `buildHashtags(inputs: { wrestlers?: string[], era?: string, show?: string, match?: string, tone?: string }): string[]` that returns **2–4** hashtags where the first two are fixed:
- Always: `#WrestlingCircleJerks`, `#WrestlingHaiku`.
- Candidate pool (choose up to two non‑duplicate, alphanumeric, no spaces):
  - From **show**: RAW → `#WWERAW`, SmackDown → `#SmackDown`, NXT → `#WWENXT`, PPVs map to canonical tags (WrestleMania → `#WrestleMania`, Royal Rumble → `#RoyalRumble`, SummerSlam → `#SummerSlam`, Survivor Series → `#SurvivorSeries`, Money in the Bank → `#MITB`).
  - From **era**: Attitude → `#AttitudeEra`, Ruthless Aggression → `#RuthlessAggression`, Reality → `#RealityEra`, PG → `#PGEra`, Tribal Chief era → `#TribalChief`.
  - From **wrestlers** (prefer top‑1): sanitize to known tags when available (e.g., Roman Reigns → `#RomanReigns`, Seth Rollins → `#SethRollins`, Becky Lynch → `#BeckyLynch`, etc.). Maintain a small lookup; otherwise pascal‑case alphanumerics.
  - From **match**: Ladder → `#LadderMatch`, Cage → `#CageMatch`, Iron Man → `#IronManMatch`, Rumble → `#RoyalRumble`.
  - From **tone** (only if nothing else chosen): Deadpan → `#DeadpanWrestling`, Nostalgic → `#WrestlingNostalgia`, Petty → `#WrestlingPetty`, Absurdist → `#WrestlingAbsurd`.
- Selection rules:
  - Start with an empty optional list; attempt to pick **one** show/PPV tag if present, then **one** wrestler or era tag.
  - If still short, fill from match/tone.
  - Never exceed two optional tags; never duplicate; keep tags ≤ 24 chars if possible.

### Share‑to‑X Builder
Implement `buildTweetText(haiku: {l1:string,l2:string,l3:string}, meta: { era?:string, show?:string, wrestlers?:string[], match?:string }, hashtags: string[], maxLen = 280): string`
- Compose the text block as specified; compute length using standard JS string length (approximate is fine). If over budget:
  1) Drop context.
  2) Drop optional hashtags one by one (keep the two required).
  3) If still long, compress separators from “ / ” to “ | ”.
  4) As absolute last resort, elide middle line with “…” while preserving 5‑7‑5 in the UI; the tweet may show `…` but UI must keep full haiku intact.

### Web Components
- In `HaikuCard.tsx`, add **HashtagChips** and a **ShareToXButton**.
- `ShareToXButton` builds `tweetUrl`:
  ```ts
  const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(buildTweetText(...))}`;
  window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  ```

### CLI
- New flags: `--hashtags` (boolean, default true), `--share-x` (string, optional: if provided, write the **tweet‑ready** text to stdout instead of raw haiku; accepts `compact|full` to include/omit context), `--no-hashtags` alias for `--hashtags=false`.
- Example:
  ```
  wcj-haiku --wrestlers "Reigns" --show "SmackDown" --era "Tribal Chief" --count 3 --seed 99 --share-x full
  ```
  Outputs three tweet‑ready texts, each on a new line. When `--json` is used, include a `tweetText` field when `--share-x` is active.

### Tests
- `buildHashtags`:
  - Always returns at least the two fixed tags.
  - Adds at most two optional tags; no duplicates; sanitized.
  - Mapping correctness: Attitude → `#AttitudeEra`, RAW → `#WWERAW`, WrestleMania → `#WrestleMania`.
- `buildTweetText`:
  - Respects 280 char limit by progressive fallback.
  - Proper URL encoding when embedded in `intent/tweet`.
  - Drops optional tags before required tags.
- E2E: With inputs `{wrestlers:["Roman Reigns"], era:"Tribal Chief", show:"SmackDown"}`, hashtags must include `#WrestlingCircleJerks #WrestlingHaiku` and choose up to two of `#RomanReigns #TribalChief #SmackDown`.

## Sample Seeds & Expected Style
Generate these during scaffolding as fixtures and in README:

- **Seed 1987, Era: Rock ’n’ Wrestling, Tone: nostalgic**
  - “cheap pop in Detroit” (5)  
  - “Hogan points, crowd shakes the cams” (7)  
  - “pyro, then ad break” (5)

- **Seed 1997, Era: Attitude, Tone: petty**
  - “glass shatters, we stand” (5)  
  - “corporate says ‘don’t try this’” (7)  
  - “we try it anyway” (5)

- **Seed 2014, Era: Reality, Tone: deadpan, Wrestler: Daniel Bryan**
  - “yes chant in rafters” (5)  
  - “creative finds the handcuffs” (7)  
  - “goatface, gold confetti” (5)

- **Seed 2021, Era: Tribal Chief, Tone: absurdist**
  - “island of relev—” (5)  
  - “camera pans, glitch and snow” (7)  
  - “table sets the table” (5)

## Wrestling Circle Jerks Flavor (must‑have)
- Sardonic but affectionate smart‑mark voice.
- Occasional meta lines about **production trucks, hard‑cam, heatless pushes**, “we’re cooking,” budget pyro, piped‑in crowd.
- 80s/90s TV texture: **VHS static, UHF ghosting, late‑night rerun vibe**.
- Avoid libel/defamation; keep it playful.

## Project Structure
```
/app
  /web (Vite React TypeScript)
    /src
      /lib/syllables/*
      /lib/rng/*
      /lib/social.ts   <-- hashtag & tweet builders
      /data/*.json
      /components/HaikuCard.tsx
      /components/Controls.tsx
    tailwind.config.ts
  /cli (TypeScript)
    index.ts
    lib/
    data/ (symlink or copy from web)
  /tests
  README.md (quickstart, examples, screenshots)
  LICENSE (MIT)
```

## Nice‑to‑Have (if time)
- “Tag builder” that emits suggested hashtags (e.g., `#WWEHaiku #WrestlingCircleJerks #RAW #SmackDown #AttitudeEra`).
- Button to generate **threaded bundles** of 5 haikus with numbered slugs.
- Simple “custom lexicon” textarea the user can paste into.

## Dev Notes
- No server calls; no tracking.  
- Keep dependencies light.  
- Code comments where the tone/lexicon rules live so we can tweak later.

---

### How to run (example)
- Web: `npm i && npm run dev` inside `/app/web`.  
- CLI: `npm i && npm run build` then `node dist/index.js --wrestlers "Reigns, Rollins" --era "Reality" --chaos 7 --count 3 --seed 777`.
