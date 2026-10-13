# Repository Guidelines

## Project and structure

Packbot is a local frontend with Orbit as orchestrator and four specialists: Scout research, Dash sniping, Ledger trading, and Bloom launch preparation. The personal project identifier remains `pack`. Use Spanish when collaborating with Nicol, and English for every user-facing string, including metadata, accessible labels, validation, and exported content.

Keep application code and bot editors in `src/`, served assets in `public/assets/`, and generated originals in `assets-src/`. Use `work/` for temporary scripts and validation evidence. Do not reference original sheets or scratch files from production UI. The application uses React 19, TypeScript, and Vite. The personal planning note is identified as `Projects/pack` and resolves through Nicol's configured vault.

## Verified commands

From the root: `npm install`, `npm run dev` (5173), `npm run typecheck`, and `npm run build` (types plus `dist/`). `npm run preview` serves at 4173.

## Product and visual conventions

Five smooth cartoon bots share black capsule eyes: plain purple Orbit, cobalt Scout with glasses, yellow Dash with a backwards cap, orange Ledger with visor, and lime Bloom with sprout. Preserve the approved logo/wordmark; follow `DESIGN.md`. The teal greeting loops on desktop/mobile while visible; reduced motion retains the poster. Use dedicated research and crew-pile scenes. Bloom falls without a line beside the long steps. Use roomy compositions, functional selectors, labeled controls and visible focus. No fur, demo/test labels, disclaimers, em dashes or invented claims.

## Functionality and validation

Each saved setup belongs to one bot and uses its own editor. Keep V2 documents bounded, validate imports, merge without data loss, and preserve complete V1 records when migrating. Bot switching navigates without changing document types. Orbit tasks link real specialist documents; task states are manual. Do not simulate AI responses, balances, quotes, executed trades, wallet connections, or remote services. Inspect real desktop/mobile layouts and exercise the affected interactions after build and type checks. Record actual outcomes, never assumed passes.

## Security and boundaries

Development, dependencies, builds, and previews remain local. Nicol authorized publishing the approved vivid version to `SolClaude33/Packbot` on `main`; the pastel baseline remains in Git history. Preserve remote history and use normal pushes; do not create another repository. Nicol handles Vercel deployment. No backend, financial execution, credential collection or analytics is authorized. Use Higgsfield only for planned assets, verified at most three credits per image; generated site videos use Kling 3.0 standard, silent. Keep credentials, tokens, private paths and confidential data out of code and notes.
