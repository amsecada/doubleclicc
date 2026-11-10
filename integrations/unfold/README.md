# Unfold — Doubleclicc website handoff

This folder belongs to the Doubleclicc website. It is local and excluded from the Unfold remote. The approved reference artwork and core-product redesign remain separately versioned in Unfold under docs/design/references/graphic-kinetic/ and FEAT-020.

## Website deliverables

- unfold-showcase.mp4: 24-second silent, native 1920×1080, 30 fps H.264 / BT.709 film.
- poster.webp and poster.png: native 1920×1080 poster from the layered film, also the static reduced-motion fallback.
- stills/: six optimized WebP frames for optional carousel use.
- copy.json: headline, description, private-prototype label, CTA and alternative description.
- manifest.json: relative paths, video/poster dimensions, duration, file hash, still order and ownership.
- index.html: responsive video preview with copy, native playback controls and no autoplay.
- preview.html: portable review carousel; opens from disk without dependencies.
- source/: editable Remotion film, six standalone scene compositions, independent graphic components, bundled font/license and render/verification commands.
- VIDEO-BRIEF.md: authored sequence and production notes.
- VERIFICATION.md: revision-2 checks and remaining review limits.

Revision 2 strengthens swipe with a large, sharp center card and smaller faded cards behind it, then returns to the opening Unfold identity at the close. The opening, transformation, visual-voices and playback scenes are retained. Technical checks pass; user review of this revision is pending.

## Editable motion

The film reconstructs the accepted artwork as native shapes, rather than panning across flat images. Card surfaces, circles, open/concentric rings, asterisk rays, source strips, arrows, play disc/triangle, orbit and progress marker are independent named layers. Circle/diagonal reveals join six registered scene compositions. Edit with `source/Film.tsx`, `source/components.tsx` and `source/scenes/`; see `source/README.md` for preview/render commands. A new render must pass `npm run verify` before replacing the delivered MP4.

## Website agent instructions

Copy runtime assets (`unfold-showcase.mp4`, `poster.webp`, optional `poster.png`, `stills/`, `copy.json` and `manifest.json`) to the website project's `public/deployments/unfold/` or established equivalent. Keep `source/` in a website-owned authoring/tools folder, outside public assets. Use the site's existing layout; `index.html` is a self-contained reference preview, not a replacement website. Prefix manifest paths with the chosen public location and preserve 16:9 without cropping. Keep copy outside the artwork. Default to the poster and user-controlled playback; if choosing inline autoplay, require muted/playsinline, visible play/pause and a static reduced-motion fallback. No Unfold server, provider key, model call, Canva runtime or account is required. The app remains a private prototype; do not add a live-app link.

The film is a promotional illustration of the workflow, not a recording of the current interface. The core-product redesign remains queued as FEAT-020. Physical-device and cross-browser acceptance remain website-project checks. Nothing is deployed by this handoff.

Do not copy this handoff into the Unfold reference directory or commit it to the Unfold repository. Publish only through the website project's own authorized workflow.
