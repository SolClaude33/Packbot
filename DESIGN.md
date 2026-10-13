# Packbot design brief

## Sculptural crew and refined color rhythm, 2026-10-13

Nicol approved the vivid alternative and requested new mascots that belong to its graphic identity, plus better section colors. He also authorized useful Kling 3.0 video assets and 3D models. Preserve the approved minimalist bot-face logo, lowercase wordmark, typography, rounded graphic layout, roles and working frontend. Continue locally on `codex/vivid-alternative` and preserve `main`.

Character family: five compact sculptural satin-vinyl companions, a broad bean-shaped head and torso, slightly flatter front, short integrated arms and stable small feet. Two parallel capsule eyes incline ten degrees together, matching the brand face. No mouth, rosy cheeks, fur, hair, fuzz, plush materials, glassy eyeballs or translucent skins. Uniform saturated surfaces, broad bevels, restrained studio lighting and short contact shadows.

Role colors stay consistent throughout the UI: Orbit graphite #161719 with lime eyes and a four-square emblem; Scout cobalt #234DFF with warm-white eyes and a small cyan side lens; Dash cyan #31C8FF with graphite eyes and one short backward fin; Ledger orange #FF6534 with graphite eyes and a raised graphite visor; Bloom lime #CEFF28 with graphite eyes and a small two-piece orange sprout. These details identify the characters without busy costume design.

Section rhythm: orange entry hero with a warm-white crew canvas; warm-white team section; dark starting points with warm-white rows and small role accents; warm-white mission board; open warm-white usage steps; cobalt builder with a warm-white form and lime action; mostly warm-white capabilities with one ink and one orange panel; warm-white FAQ; lime closing and ink footer. Saturation has three main beats, with quiet reading surfaces between them. Keep small text contrast explicit and preserve the earlier responsive corrections.

Asset plan: one transparent 3:2 family sheet at 2k/medium/Flare, referencing the approved v3 sheet for identity only. Extract and optimize five independent cutouts in `public/assets/`, preserving prior finals in `assets-src/`. Check Orbit in the real hero and a specialist card on desktop/mobile before dependent media. Then make one square Orbit animation frame on the hero's lime backdrop and a short Kling 3.0 standard silent gesture clip with a static fallback. Native video plays once on viewport entry and can replay through a labeled Orbit interaction; mobile and reduced motion keep the image. Keep connectors and all controls in code. No live 3D model is needed for the current layouts.

Implemented assets: the selected transparent family sheet (`059a15ed-05a7-4290-a6ad-05a9e812938f`) and square Orbit poster (`27b8cada-b228-4cd7-bba0-d778ba8e2633`) use Higgsfield GPT Image 2.5 Flare, medium/2k, one image each, estimated exactly one credit before each submission. The poster references the selected family. The dependent Kling 3.0 greeting (`651a0ffc-67f6-4dbd-88bd-78967481ac9f`) uses standard mode, sound off, three seconds, and the same poster for start/end, estimated exactly 4.5 credits. Total known estimate: 6.5 credits. Full prompts, references and provider records remain in `assets-src/`. Five alpha WebP cutouts total 192,260 bytes; the 1024px poster is 19,972 bytes and the silent H.264 720px clip is 79,198 bytes, observed 3.041667 seconds at 24fps. Prior cutouts, scene, clip and PNG icon are preserved outside production. The closing combines Scout, Orbit and Ledger for contrast on lime.

Validation: a real desktop/mobile hero and Scout checkpoint preceded dependent media. Final captures at 1440px, 1100px and 390px show the hero, role selectors, starting points, missions, aligned usage steps, builder, capabilities, closing and empty workspaces without observed horizontal overflow. Mobile menu and Research shortlist prefill passed. Desktop video was observed playing once to its end and replaying on click, muted with loop off; mobile mounts no video. Reduced motion and error fallbacks were checked in code. Fresh console showed no warnings/errors. Final TypeScript/Vite build passed with 1594 modules after scoped local access resolved Windows realpath restrictions. Independent capture review found no material visual defects. Existing document/storage/editor logic was unchanged, so its previously passed suite was not repeated. This revision remains local on the vivid branch.

## Vivid alternative, 2026-10-13

Nicol requested an alternative with stronger colors, more animation, a better hero and a logo with the character of fomo.family. Preserve the published pastel version in `main` at `acd0cbc`; implement the alternative locally on `codex/vivid-alternative`. The product roles and existing working frontend remain unchanged.

Direction: a bold cartoon crew desk, organized around Orbit and four independent specialist jobs. The page invites users to choose a specialist or give Orbit an objective. The visible artifact is the crew's assignment map, whose four links open real bot workspaces. No fabricated activity or market information.

References: https://fomo.family/ inspected at desktop, plus Nicol's supplied minimalist symbol. Preserve Packbot's compact lowercase vector letterforms and add a rounded bot face with two transparent capsule eyes inclined together by ten degrees. The face is a single monochrome silhouette with no mouth or extra detail, readable at 24px. Nicol specifically kept the letters and requested a face close to Packbot's earlier icon. Local references: `work/fomo-reference.jpg` and `work/fomo-symbol-reference.png`.

Palette: orange #FF6534, cobalt #234DFF, acid lime #CEFF28, ink #161719 and warm white #FFFCF4. Ink on orange/lime; white on cobalt. Typography pairs bold rounded Nunito Sans headings with readable body copy and occasional Fredoka bot names. Saturated sections alternate with quiet reading surfaces. Rounded controls and broad corners preserve the character family.

Hero: large left-aligned “Your next move. Bring the pack.”, two functioning actions, dominant Orbit on a lime shape and four smaller specialist access cards. Desktop keeps a 43/57 copy/scene relationship; mobile gives copy, actions and a self-contained character scene their own vertical space. Reuse the five approved transparent WebP characters. The earlier pastel scene/video remain available but do not organize this alternative's hero. No new remote media is needed.

Section rhythm: warm-white team portrait and selector, broad starting-point rows, cobalt mission selector, simple usage steps, lime builder with a white form, bold capability blocks, readable FAQ and orange closing crew. Workspace retains its structure and calm fields, with the new wordmark and stronger navigation and selection colors.

Motion: brief staggered hero entrance, once-drawn assignment connectors, hover/focus responses, short selection transitions and once-only section reveals. Use transform/opacity and clean up observers. Content stays readable without animation; reduced motion shows the final composition immediately. Preserve all existing presets, forms, bot editors, saved documents and navigation. The characters remain smooth cartoon bots with no fur, fuzzy anatomy or hair.

Implementation and review: shared `Brand.tsx` lockup, `useReveal.ts` observer and four hand-authored SVG assets in `public/assets/`: full logo, symbol, wordmark and favicon. No new media generation or dependency is required. Hero stacks below 1241px to keep the crew map inside its frame. Desktop, 1100px and 390px captures checked the real page, selectors, preset/builder validation, workspace navigation, FAQ and footer. The own review setup was removed by its ID and title. Build/type checks and SVG XML validation passed. A fresh independent visual review found no material defects. Stronger backgrounds required explicit text colors in cards and search controls; the mobile editor's stacked flex basis now uses its content height.

## Current product: Orbit and four crypto specialists

Nicol clarified on 2026-10-13 that Packbot's utility spans research, sniping, signal-led trading and preparation of the user's own token launch. Orbit is the head of the team, its orchestrator. Four specialist tools have their own jobs, editors and saved setups; Orbit organizes an objective into linked specialist jobs and handoffs. This supersedes the shared five-stage strategy, discovery-only Launch interpretation, and the unselected Portfolio proposal. Retain the approved cartoon characters, assets, color, typography and rounded layouts. Do not generate more media for this correction.

Scout: Research. Questions, sources, observed assets, findings and conclusions.
Dash: Sniper. Target pairs, entry filters, liquidity/age bounds, size/slippage and exclusions; check a candidate from inputs supplied by the user.
Ledger: Trader. Pair, direction, timeframe, signals, entry/stop/target and size; calculate reward/risk from complete coherent inputs.
Bloom: Launch. Prepare the user's own token identity, supply, allocation, liquidity, links and readiness checklist.
Orbit: Orchestrator. Mission objective, editable specialist jobs, real linked documents, manual To do/In progress/Done status and progress summaries. Create specialist setup creates and links one real local document atomically; opening a setup does not change its task status. Deleting a task keeps its document, and deleting a document leaves the link recoverable through Undo. Copies of Orbit missions receive independent tasks and empty links.

Landing: “Meet Packbot. Your crypto crew.” Hero explicitly lists Research, Snipe, Trade and Launch, with Orbit coordinating the crew. “One team captain. Four focused specialists.” introduces the roles. Five starting points include Team mission; the mission selector has no connecting arrows or part numbers. Builder chooses the bot and creates that bot's setup, defaulting to Orbit. Three usage steps, capabilities, FAQ and closing describe the broader crypto workspace.

Workspace: five bot destinations, isolated saved documents, module-specific fields and useful empty states. Selecting a bot navigates between its documents, preserving each document's type. Direct bot and document links select the intended module and saved setup. Local V2 documents use a config per bot. Existing V1 data remains backed up, migrates with the full original record in readable Saved notes, and retains IDs/titles/briefs. Experimental Portfolio data, if present, is kept in readable notes instead of interpreted as tasks. Imports merge validated V1/V2 records without losing existing documents; duplicate IDs and links between imported documents are remapped together. Malformed or inaccessible storage is not silently overwritten. Drafts can save while incomplete, and calculations require valid inputs. The interface has no fabricated prices, signals, trade results or execution states. Backend remains a later task.

Brand update, 2026-10-13: Nicol selected Packbot. Update visible identity, metadata, accessible labels and document copy. Retain the repository/project identifier pack. The later independent-bot revision introduces V2 storage with a lossless migration and preserves the original V1 key as a backup.

## Current revision: smooth cartoon crew

Latest clarification from Nicol: “fluffy” meant a more cartoon aesthetic, not soft hair or a fuzzy character. All final characters must have smooth surfaces with no fur, hair, fibers or fluffy material. Keep the colorful rounded page, new fonts, expanded content and simple capsule-eye bot anatomy. The generated furry v2 sheet is a discarded iteration, not a production asset. Use smooth cartoon 3D characters in the same palette and original accessories. This correction supersedes all furry/puffbot material descriptions below.

Nicol's 2026-10-13 feedback supersedes the visual direction below: the first landing felt too serious and short. Redesign the landing and carry its new styling into the existing workspace while preserving the validated data model, storage and interactions. Use Packbot as the brand and retain the five role names. The product stays crypto strategy authoring and organization. All UI remains English with no disclaimers or demo/test labels.

Visual identity: cheerful smooth cartoon bots, chunky rounded display type (Fredoka), readable Nunito Sans body, deep navy-purple ink, paper #fffaf2, lavender #e6ddff, peach #ffcfb5, blue #c9e8ff, mint #ccebdc, bright violet #7857ec and coral #ff8b69 accents. Cards have 24–40px corners, buttons are pills, surfaces have soft short shadows. Avoid uppercase microtext dominance, serif italics, rigid rules and corporate phrasing. Add two or three small hand-drawn line accents in code.

Mascot reference inspected: https://x.ai/bot. Extract only simple rounded bean silhouette and two capsule eyes. Packbot's own family uses smooth matte-satin cartoon surfaces, tiny rounded feet and little mitten arms, understated expressions, no animal muzzles or oversized glass eyes. Orbit mint/lime with orbital button badge; Scout cream with small lavender glasses; Dash sky blue with two smooth swept knobs; Ledger peach/coral with a tiny lavender visor above the eyes; Bloom lavender with a smooth mint sprout. All share one bean-shaped bot anatomy and material, distinguishing roles through color and accents. Selected v3 is a transparent 3×2 contact sheet (five occupied cells) at 2k/medium/Flare, estimated1 exact credit, derived from v2 with all fur removed and extracted to `/assets/{id}.webp`. Preserve v1 originals and rejected iterations in `assets-src/`, outside production.

New page narrative and section references:

1. Hero: playful generous heading “Big ideas. Better with your pack.”, concise explicit crypto copy, two pill actions. Large character group in a rounded pastel world, floating task stickers, no corporate podium. Show recognizable crew on mobile with retained prominence.
2. Meet the pack: five clickable rounded member controls and a large colorful character portrait beside concise personality, role and useful tasks. Selected member opens the workspace with its specialist id.
3. Starting points: three differentiated brief cards for Research shortlist, Entry checklist and Launch review. Each has a real editable preset, useful task bullets and “Use this brief”. Selecting one fills the integrated builder and moves focus there; no fixed financial thresholds or invented results.
4. Teamwork: interactive horizontal/organic handoff diagram with the five bots. Selecting a stage explains a real section of a strategy document, with structure or user-provided content rather than fake bot responses.
5. How it comes together: three rounded step panels, choose a starting point, add your own rules, keep the plan. Copy shows the mechanism and links to useful actions.
6. Build your first plan: editable name/brief/specialist form in a rounded playful card. Retain real save and required-name validation; show selected brief title and allow custom content.
7. All the little details: asymmetrical capabilities mosaic grounded in actual notes, numeric criteria, local saving, duplication, review setting and portable JSON. Useful links to workspace only.
8. FAQ and closing: rounded accordion, friendly practical text; broad coral/lavender closing with characters and a primary workspace action. Footer carries the new brand.

Implemented motion: a silent Kling3.0 standard crew loop enriches the desktop hero. The selected smooth cartoon sheet supplied the reference for a lavender scene with a mint platform, then that scene supplied the same start and end frames for the clip. The generation used `kling3_0`, `mode: std`, `sound: off`, duration 3 seconds, with an exact estimate of 4.5 credits. Local H.264 optimization produced `public/assets/crew-loop.mp4` (137,212 bytes, observed duration 3.041667 seconds), with `crew-scene.webp` as first paint and static fallback. Nicol requested removal of the visible Pause/Play button on 2026-10-13. The decorative loop now has no visible control; mobile mounts only the five static characters, reduced motion starts static, and playback failure retains the poster. No editable 3D mesh was produced. The hero has a wide rounded scene on desktop and an individual overlapping lineup on mobile. No remote website sandbox or hosting.

Readability: small violet labels use #5f3bb8, 5.76:1 on lavender, while large accent headings use #7857ec. The closing heading accent also uses #5f3bb8, 3.26:1 on coral. Task stickers sit above the faces. Preset selection clears only the required-name error when it supplies a valid name; unrelated save errors remain visible.

Acceptance: visibly more cartoon, rounder, more colorful, new type; expanded sections with genuinely distinct purposes; original coherent smooth bots with no fur; desktop/mobile/intermediate captures and preserved workspace functionality. A reference/crop checkpoint comes before dependent assets. The older brief below records the first iteration only.

## Product

A frontend for creating and organizing crypto trading strategies with five specialist companions. Reference: https://usehotbot.com/. Retain the clarity of role-based mascots and strategy configuration; create original branding, characters, copy, composition, and controls.

## Identity and section references

Warm cream `#f5f3ec`, ink `#1d2521`, citrus `#d5ed8c`, coral `#f37452`, muted cobalt and lavender. A friendly, tangible world of satin soft-vinyl creatures. Oversized editorial sans display; a restrained serif italic provides one contrast. Fine rules, open spacing, readable compact metadata. No noisy gradient backgrounds or fabricated proof.

Hero reference: generously spaced navigation, a small label, centered headline “Good instincts. Better company.” with the second phrase in an italic serif, concise trading-specific supporting copy, primary “Build your strategy” and secondary “Meet the pack”. Below: large organic five-character lineup with Orbit ahead, each name and specialty under it, a soft curved cream stage, quiet shadows. Subject importance is retained on mobile with a compact overlapping group.

Team reference: interactive row of specialist tabs, a wide split composition with one large mascot and editorial biography, personality note and concrete capabilities. Avoid repeating five generic cards. Next: ink workspace section containing actual editable strategy controls with citrus accents and real save behavior. End: concise FAQ and typographic CTA/footer. Every CTA opens a real local workflow.

## Members and asset plan

Orbit: citrus seed creature, coordinator. Scout: ivory owl with glasses, research. Dash: cobalt rabbit with antenna ears, entry lookout. Ledger: coral bear with forehead visor, trade planning. Bloom: lavender sprout, launch discovery. Five individual transparent WebP assets extracted from one 3:2 contact sheet generated through Higgsfield GPT Image 2.5 Flare, medium, 2k, transparent, count 1. Verified estimate: 1 exact credit. No source image references. Production paths: `/assets/orbit.webp`, `/assets/scout.webp`, `/assets/dash.webp`, `/assets/ledger.webp`, `/assets/bloom.webp`.

## Frontend scope

Landing `/` and workspace `/workspace`. Create, name, edit, duplicate, delete with recovery, search, save, export, and import strategy documents. Configure sources, observed tokens, entry filters, trade planning, launch criteria, and review mode. Persist locally with a versioned schema. Initial workspace is empty; do not invent market data or generated chat. Message-like brief composition may save the user's own instructions, with no fake response.

## Responsive and acceptance

Desktop, intermediate, and mobile captures. Mobile navigation and team selector remain usable, forms reflow, workspace sidebar becomes a compact switcher, no horizontal page overflow. Clear focus, contrast, labels, import errors, and reduced motion. Build/type checks and useful interaction checks with recorded results. Do not add backend, hosting, wallets, transactions, demo labels, or disclaimers.

## Integration decisions

The desktop crew uses a compact 350px stage, with the coordinator slightly forward and extra space below to preserve its caption. On narrow screens the stage is 225px high, five silhouettes remain visible, and captions move to the specialist selector. Strategy fields use USD market-cap/liquidity values, hours for age, and SOL for allocation. The selected specialist emphasizes its section while Orbit summarizes actual filled fields. Numerical validation, bounded documents, import normalization, and local persistence preserve useful authoring behavior. No generated conversation is included.
