# Unfold film — revision 2 verification

Local website handoff, 2026-11-10. Technical verification passes; user aesthetic review of revision 2 is pending. This is a promotional illustration, not an app screen recording or live-provider acceptance evidence.

## Passed

- `npm run check` in `source/`: TypeScript passes using the existing parent dependencies.
- `npm run render`: native 1920×1080, 30fps, 720 frames / 24 seconds; silent H.264, yuv420p, BT.709, TV range. Separate native SVG components and six registered scene compositions; no flattened campaign image or remote font/image fetch inside the film.
- `npm run verify`: ffprobe metadata, no audio, file size/SHA-256, relative media/source/font paths and complete ffmpeg decode pass. Run with scoped process permission on this machine because the restricted runner cannot launch ffprobe.
- Inspected rendered frames 75, 155, 310, 357, 377, 402, 426, 450, 540, 597, 618, 648 and 700, plus encoded-motion frames around both revised scenes. Swipe has successive large, sharp centered cards with smaller faded/softened cards behind them. Closing cards reassemble the opening wordmark/arrow identity; no standalone C-like ring or closing catchphrase.
- Compared accepted scenes against the actual previous encoded movie: mean absolute channel difference at frames 75 / 155 / 310 was 0; frame 540 was 0.15494 on a 0–255 scale, within codec tolerance. Their scene source was unchanged.
- Actual Chromium website playback of revision 2: loaded the revision-2 MP4, reported 1920×1080 and 24 seconds, readyState 4, played through to 24 seconds / ended=true with no media error.
- Poster PNG/WebP and six stills derive from the native film. Stills use frames 75, 155, 310, 402, 540 and 700, all 1920×1080.
- Prior preview checks: 390px document width with 362×204 video, no horizontal overflow; reduced-motion preference change paused active playback; no autoplay. Revision 2 changes the media URL and download-link wording without changing layout/playback logic. Temporary browser emulation was cleared.

The first production render's full-range/BT.601 format was caught and corrected to the delivered BT.709/yuv420p settings. Existing parent Remotion tooling emits a nonfatal Zod peer-version warning; this film uses no Zod schema. Typecheck, Studio and rendering succeed without changing app dependencies.

## Package checks

The delivery ZIP contains only this `unfold/` folder, including the editable source and font license. Final archive CRC, relative paths and embedded MP4 hash are checked during packaging. Inspection boards, revision-1 backups, dependencies and temporary bundles remain outside the delivery ZIP. The handoff path is ignored by the Unfold reference checkout; no movie or source is pushed to Unfold.

## Outstanding

- User review and aesthetic acceptance of revision 2.
- Fresh standalone dependency installation on another machine; local authoring used the existing pinned parent dependencies.
- Physical devices, Safari/Firefox and final integration into the Doubleclicc website.
- Core-product FEAT-020 redesign remains queued. App tests/build and live AI generation were not rerun for this website-only motion revision; no application code, provider behavior or paid calls changed.

Nothing is deployed or published by this package.
