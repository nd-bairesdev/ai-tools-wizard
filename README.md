# AI Tools Wizard — bairesdev.com/ai-tools

A Next.js + Tailwind implementation of the BairesDev AI Tools Wizard.

The page renders the wizard, results, full tool inventory, and methodology section without site chrome (no header or footer), so it can be embedded into the existing bairesdev.com layout.

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS 3.4 with a custom theme matching the BairesDev brand book
- Outfit (display + body) and JetBrains Mono (numerics) loaded from Google Fonts

No backend. The scoring engine runs entirely client-side; result permalinks are encoded into the URL hash so a shared link drops the recipient straight into the result view.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/
  layout.tsx          # Root layout, fonts loaded via <link>
  page.tsx            # Page composition only (no header/footer)
  globals.css         # Tailwind base + reusable component classes

components/
  Hero.tsx            # Editorial hero block
  Wizard.tsx          # Five-question wizard, results, what-if panel
  Inventory.tsx       # Full tool inventory with category filter and sort
  Methodology.tsx     # Scoring rubric, weighting matrix, disclosures
  ContactCTA.tsx      # Soft sales pitch above the embedded site footer
  ScoreViz.tsx        # ScoreBar (compact) + ScoreDots (reference)

lib/
  tools.ts            # 38-tool inventory with scores and blurbs
  questions.ts        # The 5 wizard questions and option labels
  scoring.ts          # Weighted scoring + recommendation logic
```

## Brand compliance

The visual system follows the BairesDev brand book:

- Typography: Outfit (medium for headlines, light for display, bold for emphasis, regular for body)
- Primary color: `#F66135` (brand orange) on all CTAs, with `#FBB39E` as the soft variant
- Secondary palette available in Tailwind config: blue `#1A73E8`, green `#16A87A`, yellow `#FFAC00` plus their soft variants
- Neutrals: `#111111` ink, `#A1A1A1` light gray, `#E7E7E7` line gray
- White and off-white sectional backgrounds with subtle horizontal rules

## How the wizard works

1. The user lands on the intro panel inside the wizard card.
2. They click "Start" and answer five questions, one at a time.
3. On the fifth answer, a result view replaces the question pane.
4. The result page shows: top recommendation, two runner-ups, "Why this one?" reasoning, share buttons, and a "What if I changed an answer?" panel that re-ranks live.
5. Answers are encoded into the URL hash (e.g. `#r=cDoeP`) so the result is permalinkable.

## Scoring

Each tool has 1-10 scores on four dimensions (higher is better in every column).

- Hard filter by category (Q1) and technical level (Q2). Non-technical users never see a tool with `requiresCLI` or an Install score below 7.
- Hard filter for privacy (Q5): only tools with `selfHostable: true` are surfaced.
- Weight multipliers on each dimension based on Q5 priority (e.g. "Raw capability" multiplies Power by 2.5x, Install by 0.5x).
- Soft boosts based on Q3 (usage) and Q4 (context).

The methodology section reproduces this exactly so the page is verifiable.

## Customization

- Add a tool: append an entry to `lib/tools.ts`. Boolean signals (`apiFirst`, `freeTier`, `selfHostable`, `longContext`, `persistentMemory`, `consumerInterface`, `requiresCLI`) influence scoring boosts. Update `lastReviewed`.
- Change weighting: edit `PRIORITY_WEIGHTS` in `lib/scoring.ts`.
- Edit a question: `lib/questions.ts`. New options are picked up automatically by the wizard and the what-if panel.
