# Unfold deployment showcase implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task by task.

**Goal:** Add Unfold as deployment 02, with a matching graphic and a copy/video popup.

**Architecture:** Retain the static HTML/Vite site, existing card styling and native dialog pattern. Use CSS scroll snapping for the deployment carousel, a compact SVG adapted from the supplied native graphics, and the supplied MP4/poster for user-controlled playback.

**Tech stack:** HTML, CSS, browser JavaScript, Vite, existing Playwright tests.

**Spec:** User request and `src/unfold-website-handoff.zip` (`unfold/README.md`, `copy.json`, `manifest.json`).

## Constraints and decisions

- Order: Syllabusy, Unfold, Smokesignal, Sherwood. Existing external app links remain intact.
- Unfold is a private prototype; its card opens a dialog, with no live-app link.
- Use supplied headline and description; keep copy separate from the artwork.
- Preserve the video at 16:9, without cropping or autoplay. Pause when closing.
- Use relative asset paths for GitHub Pages at `/doubleclicc/`.
- Keep editable film source outside public assets; retain the original ZIP.
- Work in the current feature checkout and preserve the existing README edit.
- Authoring approach: native graphic shapes match the delivered source more reliably than generating a new raster interpretation; no new dependencies required.

## Review focus

- Carousel navigation reaches all four cards at phone and desktop sizes.
- Dialog close controls and video fit narrow/short viewports.
- Escape, close button and backdrop restore focus and stop playback.
- Reduced motion does not start video or animate carousel navigation.
- A failed video has a reachable direct-video link; no page overflow.

## Task 1: Carousel and Unfold popup

**Files:** `index.html`, `src/site.js`, `src/styles.css`, `public/deployments/unfold/`, `integrations/unfold/`, `tests/deployments.spec.ts`.

- [x] Add behavior tests for carousel order/navigation, keyboard opening, real video playback, pause on closing, and viewport fit.
- [x] Run the tests against the current production build and confirm failure because Unfold is missing.
- [x] Extract runtime media to `public/deployments/unfold/` and keep editable source and handoff documentation under `integrations/unfold/`.
- [x] Add the card in position two with a native geometric graphic. Convert the grid to a scrollable row with previous/next buttons and native touch scrolling.
- [x] Add a named native dialog containing handoff copy and the delivered video; wire open, close, backdrop, focus return, playback pause and scroll locking.
- [x] Run type checking, static checks, production build and the browser suite at `/` and `/doubleclicc/`.
- [x] Inspect desktop and phone screenshots, review the final diff, and report the local result.

## Verification record

- Type checking, five static navigation checks and production builds pass.
- Full root browser suite: 40 passed, including tablet carousel coverage.
- Full `/doubleclicc/` browser suite, including tablet coverage and all three pause-on-dismissal paths: 40 passed.
- Desktop and phone screenshots inspected; independent read-only code review found no blocking issues.
- MP4 SHA-256 matches the original handoff manifest. Source media was not re-encoded.
- Hover/focus motion fans out the story cards, rotates the asterisk and moves the arrow/trails. Browser checks confirm return to idle and static artwork with reduced motion.
- Carousel navigation tests wait for actual scroll progress instead of racing the asynchronous disabled-button update at the end of the row.
- The preexisting README edit and original handoff ZIP are excluded from the showcase commit.
