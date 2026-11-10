# Unfold website integration

The runtime assets were extracted from the local `src/unfold-website-handoff.zip`
archive, which is not tracked. The media, copy, original manifest and stills
live in `public/deployments/unfold/`.
The editable film source is retained here under `source/`, outside the public
site output. The manifest describes the original handoff layout; its `source`
paths resolve here rather than within the public media directory.

`public/deployments/unfold/carousel.svg` is a new compact graphic adapted from
the film's native StoryCard, Rings, Asterisk, Arrow and SpeedLines components.
It uses the same cream, orange, lime, lilac and ink colors. The card renders
these shapes inline in `index.html` so each story card can fan out on hover
or keyboard focus, with a rotating asterisk and moving arrow/trails. Reduced
motion keeps the art static. The standalone SVG remains the static reusable
version. This native vector adaptation needs no service or runtime font.

The second deployment card in `index.html` opens `#unfold-showcase`. The dialog
uses the supplied headline and description and the verified 24-second MP4.
The prototype is private, so there is no live-app link. Native controls start
playback on request, and closing the dialog pauses the video. The original
poster remains the idle and reduced-motion presentation.

Run `npm run build` and `npm run test:e2e`; repeat with `SITE_BASE=/doubleclicc/`
to verify the GitHub Pages asset paths. These tests include real video playback,
carousel navigation, responsive fit, keyboard activation and dismissal.
