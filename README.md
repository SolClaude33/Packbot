# Packbot

Packbot is a local React frontend for a crypto crew: Orbit coordinates research, sniping, trading, and token launch preparation across four specialist bots.

## Local development

```bash
npm install
npm run dev
```

The development server runs at `http://127.0.0.1:5173`. Use `npm run typecheck` for TypeScript validation and `npm run build` for the production build.

For a clean local install that matches the hosted build:

```bash
npm ci
npm run build
npm run preview
```

The production preview runs at `http://127.0.0.1:4173`. The `/workspace` route is a client-side route and can be opened directly in development, preview, and the configured Vercel project.

## Workspaces

Orbit organizes goals and specialist handoffs, creates linked setups, and tracks task progress. Scout keeps research sources, questions, and findings. Dash holds sniper filters and checks candidate metrics. Ledger organizes signals and trade rules, with long/short price calculations. Bloom prepares token details, allocations, liquidity, and launch checklists.

Each setup belongs to one bot. The workspace supports save, search, duplication, deletion with undo, and JSON export. Validated V1 and V2 imports merge into the workspace. Existing V1 records migrate with their original notes preserved, and the original browser key remains as a backup. V2 documents use versioned local storage. Production characters and the silent crew greeting are served from `public/assets/`. The greeting loops on desktop and mobile while visible, with a static poster for reduced motion or unavailable playback. Dedicated Orbit, Scout and falling Bloom poses give the landing sections their own compositions.

## Import into Vercel

Import `https://github.com/SolClaude33/Packbot` from the Vercel dashboard and use these settings:

- Root Directory: `.`
- Framework Preset: Vite
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js: `22.x`
- Environment Variables: none

The repository configuration in `vercel.json` supplies the same build settings and the SPA fallback for `/workspace`. It does not rewrite `/assets`, so media and generated bundles remain ordinary static files.

Workspace documents stay in the visitor's browser storage and can be moved with JSON import and export.
