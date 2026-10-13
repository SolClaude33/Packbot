# Repository Guidelines

## Project and structure

Packbot is a local frontend with Orbit as orchestrator and four specialists: Scout research, Dash sniping, Ledger trading, and Bloom launch preparation. The personal project identifier remains `pack`. Use Spanish when collaborating with Nicol, and English for every user-facing string, including metadata, accessible labels, validation, and exported content.

Keep application code and bot editors in `src/`, served assets in `public/assets/`, and generated originals in `assets-src/`. Use `work/` for temporary scripts and validation evidence. Do not reference original sheets or scratch files from production UI. The application uses React 19, TypeScript, and Vite. The personal planning note is identified as `Projects/pack` and resolves through Nicol's configured vault.

## Verified commands

From the root, use `npm install`, `npm run dev` (5173), `npm run typecheck`, and `npm run build` (types plus `dist/`). Typecheck and build passed during implementation. `npm run preview` serves the build locally at 4173.

## Product and visual conventions

Packbot now uses a playful, colorful world of five smooth cartoon bots: Orbit, Scout, Dash, Ledger, and Bloom. Nicol clarified that the characters must have no fur, fuzzy texture, or fluffy anatomy. Use rounded display typography, readable rounded body text, lavender, peach, sky, mint and lime surfaces, generous 24–40px corners, and pill controls. Follow the current revision in `DESIGN.md`. Use semantic HTML, clearly labeled controls, visible keyboard focus, and reduced-motion support. New interface copy must not include demo/test labels, disclaimers, em dashes, invented testimonials, or performance claims.

## Functionality and validation

Each saved setup belongs to one bot and uses its own editor. Keep V2 documents bounded, validate imports, merge without data loss, and preserve complete V1 records when migrating. Bot switching navigates without changing document types. Orbit tasks link real specialist documents; task states are manual. Do not simulate AI responses, balances, quotes, executed trades, wallet connections, or remote services. Inspect real desktop/mobile layouts and exercise the affected interactions after build and type checks. Record actual outcomes, never assumed passes.

## Security and boundaries

Development, dependencies, builds, and previews remain local. Nicol authorized publishing this frontend to the existing `SolClaude33/Packbot` GitHub repository. Preserve remote history and use normal pushes; do not create another repository or deploy to Vercel. Vercel configuration prepares the project for Nicol's deployment. No backend, financial execution, credential collection, or analytics is authorized. Use Higgsfield only for planned media, at most three credits per image. Keep credentials, tokens, private paths, and confidential data out of code and notes.
