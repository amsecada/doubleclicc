# Doubleclicc player integration design

Status: proposed for user approval; no implementation authorized yet.

## Intent and evidence

Integrate the supplied animation into the hero, prove that clicking its banner navigates to `https://google.com/`, then remove current sections 02 and 03 and bring the remaining content up. Leave a maintainable project structure and a working deployment pipeline.

Read: START-HERE.txt, INTEGRATION.txt, manifest.json, player wrapper, timeline and font setup, current HTML/JavaScript, navigation tests, publishing instructions, and both GitHub Actions workflows. The current site is static HTML/CSS/JavaScript with no package manifest, build pipeline, or backend. Deployment copies four root files. The existing diagnostic modal simulates success without transmitting data.

The actual current sections differ from the original README: SYS.02 is `#leaks` (Find the constraint, including `#diagnostic`); SYS.03 is `#systems` (Patch). These are the sections this design removes. Work, Clients, Gray Papers, Protocol, and the final diagnostic section remain.

Existing user changes include modified README.md and untracked src/. Preserve these during implementation; relocate supplied files deliberately rather than discarding untracked content.

## Architecture decision

Recommended: retain the static page and add Vite, TypeScript, React, and a small React mount for the Remotion player. Static hosting serves the built HTML, JavaScript, CSS, and fonts. The animation runs in the visitor's browser. No backend directory or server is needed for playback or an external link.

Alternatives considered: converting the whole page to React/Next.js creates an unnecessary migration; exporting a video loses the supplied responsive compositions and component behavior. Neither is recommended.

Real diagnostic submission, storage, email, booking, or server-side rendering is outside this proof. Do not represent the existing modal as a working backend. Keep its current behavior outside the banner unchanged and document the limitation. A future submission service must be designed around an actual destination and data requirements.

## Source layout

```text
index.html                         semantic page and player mount
src/
  main.tsx                         mount player and load existing site behavior/styles
  site.js                          existing site interactions, relocated from main.js
  styles.css                       existing site styles, relocated and pruned
  config.ts                        shared banner destination
  components/doubleclicc/
    DoublecliccPlayer.tsx
    Intro.tsx
    brand.tsx
    SlashWipe.tsx
    scenes/*.tsx
public/
  .nojekyll
  fonts/                           three supplied fonts and both licenses
docs/
  integrations/doubleclicc-player/  original handoff docs and provenance manifest
  superpowers/specs/
  superpowers/plans/
tests/
  test_navigation.py
  player.spec.ts
package.json
package-lock.json
tsconfig.json
vite.config.ts
playwright.config.ts
```

Generated dist/, node_modules/, browser reports, and caches are ignored. Remove the emptied `src/cmp/` handoff hierarchy after verifying every supplied source/font/document is accounted for. Preserve the original manifest as historical provenance, not a checksum of the modified component. No parallel copies of the component remain.

## Hero and interaction

Keep the real H1 and short supporting copy in HTML. Replace the old pipeline visual with the player in a full-width row beneath the compact introduction; avoid shrinking the desktop composition into the current narrow hero column. Preserve all five scenes, colors, typography, slash transitions, silent looping, 750 frames at 30fps, desktop 1920×1080 and portrait 1080×1440 compositions. Switch at 768px of container width.

The banner artwork and persistent diagnostic CTA both navigate in the same tab to `https://google.com/`. A single exported configuration value owns this destination so it can be replaced later. The artwork receives a real, named link outside its aria-hidden decorative content. Keep pause/play outside this link, with no nested interactive controls or click bubbling that navigates accidentally. Preserve callback precedence for callers that use the existing onDiagnostic API.

Keep visible focus styles, keyboard activation, loading/error fallbacks, and a static reduced-motion view. The persistent link remains available in every state. Keep a plain HTML fallback link if the player JavaScript cannot load; replace that fallback only after the React mount succeeds. Provide concise semantic text conveying the animation's core message so removal of the two sections does not make the proposition animation-only.

Use the host's public base path for fonts instead of assuming Remotion's staticFile resolves correctly in Vite. The built site must work at both `/` and `/doubleclicc/`.

## Page consolidation and cleanup

First establish and verify the banner integration. Then delete sections `#leaks` and `#systems`, including their obsolete styles and behavior; do not leave invisible duplicate sections or empty layout space. Remove the Systems navigation link. Renumber the remaining sections 01–06 and derive header status from the remaining section order. Preserve the other menu links, project links, client carousel, Gray Papers dialogs, protocol, and diagnostic modal.

Remove old pipeline timing and pointer handlers/styles that no longer have consumers. Remove only demonstrably unused CSS; shared rules stay. Update operational documentation without overwriting the user's README edits.

## Build, release, acceptance

Pin all four Remotion packages to 4.0.534, use the supplied verified React/ReactDOM 19.2.3 and TypeScript 5.9.3 baseline, and commit a reproducible npm lockfile. Select and lock a compatible Vite release and Node version during setup. Do not install Remotion Studio, CLI, or rendering infrastructure.

Both pull-request checks and release builds install from the lockfile, type-check, test, and build. Retain the existing required check name `Navigation links`. GitHub Pages uploads dist/ rather than copying source files. Use Pages' configured base path for the release build; retain main-only deployment and environment protections.

Acceptance: desktop and 360px/390px mobile playback; all five scenes; breakpoint resize; links navigate to Google with mouse and keyboard; pause/resume never navigates; reduced-motion and failure states retain a working link; fonts return successfully at both deployment bases; no horizontal overflow; all remaining navigation/dialogs work; numbering is 01–06; generated output contains no handoff source/docs; production build and tests pass.

Show the integrated production preview locally before publishing. Approval of this plan authorizes implementation and local verification, not a merge or publication. Record any real-phone verification still needing a physical device.

## References

- Supplied START-HERE.txt and INTEGRATION.txt are the primary integration contract, with the user's Google destination overriding their existing-form suggestion.
- [Remotion Player](https://www.remotion.dev/docs/player): browser embedding in React.
- [Vite static deployment](https://vite.dev/guide/static-deploy.html): built output and GitHub Pages base paths.
