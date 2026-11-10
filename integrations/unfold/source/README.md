# Editable Unfold showcase film

Website-owned Remotion source. The app overhaul and Unfold runtime are independent.

`Film.tsx` authors six named overlapping scenes. Every scene has its own file and registered composition, so it can be opened directly in Studio. `components.tsx` contains separate native card surfaces, rings, asterisk rays, arrows, article strips, speed lines and typography. `Playback.tsx` also separates the play disc, triangle, orbit arcs and timeline bead. No campaign artwork PNG is used inside the film. The reference images guided a native reconstruction so the forms can move independently at full output resolution.

All animation uses Remotion frame time. The custom circle/diagonal reveals require no transitions dependency. Palette/easing helpers live in `motion.ts`; scene timing is inline in `Film.tsx`. The main composition is 720frames at30fps (24seconds),1920×1080. Noto Sans Black is bundled locally with the installed font's license in `public/`; rendering makes no remote font or image request.

Motion revision2: `Swipe.tsx` drives two depth/focus handoffs; its active card grows to1.43× while background cards fade, shrink and soften. `StoryCard` has an optional blur control, defaulting to0 so the other scenes retain their appearance. `Release.tsx` now reassembles the opening wordmark/arrow/card identity. The former standalone open ring and closing catchphrase are not rendered.

## Run

This folder uses the existing parent Unfold dependencies during local production. For an independent checkout, install this folder's pinned dependencies with `npm install` first. Then:

```sh
npm run studio
npm run check
npm run render -- --stills
npm run render
```

Studio opens at http://localhost:4176/UnfoldShowcase. If a renderer browser is unavailable, install the official Remotion browser through its normal tooling or set `REMOTION_BROWSER_EXECUTABLE` to an existing compatible executable. The script also recognizes the current machine's installed Playwright Headless Shell. No credentials are needed.

Render writes `../unfold-showcase.mp4` and `../poster.png`. Inspection stills/settings are saved outside the delivered folder in `../../checks/`. The script removes its own temporary bundle. Verify the MP4 with ffprobe and a full ffmpeg decode before declaring a new render ready. Run the integration checks again after changing timing or output paths.

For a new render, refresh `manifest.json` with the new file size and SHA-256 before `npm run verify`; its hash check intentionally rejects stale handoff metadata. The delivered manifest matches the supplied movie. Custom inspection frames can be rendered with `npm run render -- --stills --frames=357,402,450,618,700`.

Keep this source with the Doubleclicc website project (for example its tools/media/unfold folder); only runtime MP4/poster/copy/manifest/stills need to go into the website's public assets. Do not commit this source or its rendered MP4 to the Unfold remote.
