# Doubleclicc Player Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for native execution, or superpowers:subagent-driven-development if the user selects delegation. Steps use checkbox syntax for tracking.

**Goal:** Integrate the supplied banner, prove Google navigation, remove redundant sections, and leave a clean, deployable site.

**Architecture:** Preserve the static page with a React island compiled by Vite. No runtime backend is required. GitHub Pages serves dist/.

**Tech Stack:** HTML/CSS, existing JavaScript, TypeScript 5.9.3, React/ReactDOM 19.2.3, Remotion packages 4.0.534, Vite, npm, Python unittest, Playwright.

**Spec:** [Player integration design](../specs/2026-10-09-player-integration-design.md). Both documents were approved by the user on 2026-10-09 for native execution.

## Global constraints

- Preserve user changes to README.md and the supplied untracked source.
- Google proof destination: `https://google.com/`, same-tab navigation.
- Remotion packages: remotion, @remotion/player, @remotion/transitions, @remotion/fonts, all exactly 4.0.534.
- Preserve 750 frames, 30fps, five scenes, silent looping, 1920×1080 desktop and 1080×1440 portrait; container breakpoint 768px.
- Keep a semantic H1, supporting copy, accessible controls, and reduced-motion/error fallbacks.
- Remove current SYS.02 #leaks and SYS.03 #systems only after the banner proof passes.
- Support `/` and `/doubleclicc/`; preserve required check name `Navigation links` and release protections.
- Show local production preview; do not publish as part of implementation approval.

## Review focus

- Subpath deployment must load dynamically imported scenes and all three fonts (Task 1/4).
- JavaScript/chunk failures must leave a working link and readable message (Task 2).
- Clicking pause or activating it with the keyboard must never follow the banner link (Task 2).
- Resizing across the breakpoint while paused must preserve useful playback/control state (Task 2).
- Removing #systems must not break navigation, numbering, shared styling, or dialogs (Task 3).

## Task 1: Establish the build and canonical source layout

**Files:** Create package.json, package-lock.json, tsconfig.json, vite.config.ts, src/main.tsx, src/config.ts, playwright.config.ts, tests/player.spec.ts. Relocate main.js → src/site.js, styles.css → src/styles.css, .nojekyll → public/.nojekyll, supplied component files → src/components/doubleclicc/, supplied fonts → public/fonts/, and original handoff documents → docs/integrations/doubleclicc-player/. Modify index.html, .gitignore, and tests/test_navigation.py.

**Interfaces:** `src/config.ts` exports `DIAGNOSTIC_HREF: string`. `src/main.tsx` imports site behavior/styles and mounts `DoublecliccPlayer` into `#doubleclicc-player`. Keep the existing player props. Vite accepts a configurable public base and outputs dist/.

- [x] At execution start, use the worktree skill and preserve the dirty working tree/source handoff in the implementation checkout without overwriting it. Record the source/font inventory.
- [x] Add a browser smoke test `built_page_loads_player_assets`: production page has one H1 and a player mount, no uncaught errors, and font URLs return 200 under `/doubleclicc/`. Run it to establish the missing-build failure.
- [x] Create the minimal npm/Vite/TypeScript configuration and scripts: dev, typecheck, build, preview, test:e2e. Pin the stated versions; select a supported Node/Vite pair and record it in package engines and CI. Install with npm and retain the lockfile.
- [x] Relocate source/assets/docs into the spec's layout. Use a relative module entry in HTML; adapt font URLs to `import.meta.env.BASE_URL` and the current document base so nested deployment works. Update local-asset test resolution for the module entry without weakening missing-file checks.
- [x] Run `npm run typecheck`, `npm run build`, `python3 -m unittest discover -s tests -v`, and the smoke test. All must pass; inspect dist/ for generated assets and fonts.
- [x] Commit only this task's files, preserving unrelated user edits.

## Task 2: Integrate the full-width, clickable hero

**Files:** Modify index.html, src/main.tsx, src/config.ts, src/styles.css, src/components/doubleclicc/DoublecliccPlayer.tsx, and tests/player.spec.ts.

**Interfaces:** Set `DIAGNOSTIC_HREF = 'https://google.com/'`; pass `diagnosticHref={DIAGNOSTIC_HREF}`. Retain the callback-first behavior if `onDiagnostic` is supplied. The banner link has an accessible name; pause/play remains a sibling control.

- [x] Add failing tests: `banner_and_cta_navigate_to_google` asserts both links' URL and verifies mouse/Enter navigation; intercept Google requests with a local success response so the test proves navigation without relying on Google's availability. `pause_does_not_navigate` asserts URL unchanged, frame progress stops and resumes, and button label changes.
- [x] Add tests for reduced-motion (static fallback and live link), lazy-scene request failure (fallback and live link), and disabled JavaScript (HTML fallback link). Add `resize_preserves_paused_state` for crossing 768px.
- [x] Replace the old hero pipeline with a full-width banner beneath the semantic introduction. Implement native link behavior for artwork and persistent CTA, visible keyboard focus, independent pause/play, and static fallback markup. Keep imported scene artwork intact.
- [x] Run `npm run test:e2e` and `npm run typecheck`. Inspect all five scenes at wide desktop, 360px, and 390px; check aspect ratios, focus, and overflow. Verify same-tab navigation manually in the local preview. Resolve problems before starting Task 3.
- [x] Commit the working banner integration.

## Task 3: Consolidate the page and remove obsolete behavior

**Files:** Modify index.html, src/site.js, src/styles.css, tests/test_navigation.py, and tests/player.spec.ts.

**Interfaces:** Remaining section order is hero, work, clients, gray-papers, method, diagnose. Header status derives its index/total from those sections. No navigation link targets removed IDs.

- [x] Add failing static assertions for exactly those six sections, section labels SYS.01–SYS.06, no Systems menu item, and no references to #leaks/#diagnostic/#systems. Retain duplicate-ID, fragment, and asset tests.
- [x] Remove sections 02/03 and the Systems menu entry. Renumber the six sections; calculate header status from the DOM order. Remove obsolete pipeline timers, selectors, and section-specific CSS, preserving shared rules.
- [x] Add browser regressions for all retained header destinations, Gray Papers open/close, diagnostic modal open/close, client carousel, and no horizontal overflow at 360px/390px. Assert scroll status reports the correct section out of 06.
- [x] Run the Python tests, browser tests, type-check, and build. Confirm Work follows the hero without empty gaps and animation-only messaging has a semantic equivalent.
- [x] Commit the consolidated page.

## Task 4: Make production deployment reproducible and finish cleanup

**Files:** Modify .github/workflows/site-checks.yml, .github/workflows/deploy-pages.yml, PUBLISHING.md, .gitignore, and README.md only with focused additions preserving user changes. Complete tests/player.spec.ts deployment coverage.

**Interfaces:** Both workflows use npm ci and the same supported Node runtime. Required check name stays `Navigation links`; deployment uploads dist/ after checks and uses the configured Pages base path.

- [x] Extend `built_page_loads_player_assets` to cover both `/` and `/doubleclicc/` builds and inspect local asset responses, dynamic scene loading, and fonts. Build/preview tests run against generated output, not only the development server.
- [x] Update workflows to install, type-check, run static/browser checks, and build before artifact upload. Resolve Pages base before the release build. Retain main-only publishing and existing environment permissions; adjust job timeouts for dependency installation/browser checks.
- [x] Document local setup, build/test commands, component location, Google destination setting, actual publishing flow, and the existing form's lack of submission. Remove only verified duplicate/empty handoff paths. Ignore generated output and reports.
- [x] Run `npm ci`, `npm run typecheck`, `python3 -m unittest discover -s tests -v`, `npm run build`, and `npm run test:e2e`. Repeat production build/browser checks with `npm run build -- --base=/doubleclicc/`. All must pass. Verify dist/ excludes source handoff/docs and includes fonts/licenses.
- [x] Self-review the diff and source/font inventory; run `git diff --check`; confirm no missing licenses, accidental deletion of user content, duplicate component trees, or generated artifacts in the proposed commit.
- [x] Commit scoped changes, open the local production preview for user review, and report checks plus any physical-phone validation still outstanding. Do not merge or publish.

## Approval and execution

Recommended execution: native, in this task, because the four tasks share the same small integration surface. A final independent review can follow implementation under the Superpowers execution workflow. Delegated implementation is also available if requested. Approval should cover this plan and its linked design, especially the static architecture, current section IDs, and banner-only Google proof.


## Implementation record — 2026-10-09

Implemented and verified locally. Clean npm installation, TypeScript checks,
production builds, 5 Python tests, and 15 browser tests pass at both root and
`/doubleclicc/`. All five scenes were captured and inspected at desktop and
phone widths. Actual banner navigation reached Google's page in the local
browser. Supplied scenes, timeline, transitions, fonts, and licenses are preserved.
GitHub workflows have been updated locally; remote Actions execution and
publication await review/merge. Physical-phone performance remains a manual
prepublication check.

Execution adjustments: the sandbox blocked worktree creation, so implementation
used the existing `codex/site-redesign` checkout. Initial build/mount tasks shared
one verified commit. The user's preexisting README edits were preserved and
left uncommitted; operational instructions live in PUBLISHING.md.
