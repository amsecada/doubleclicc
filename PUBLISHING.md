# Developing and publishing Doubleclicc

The page is static HTML with a React/Remotion hero compiled by Vite. There is
no runtime backend. GitHub Pages serves the generated `dist/` directory.

## Local setup

Use Node 22.22.0 (`nvm use` reads `.nvmrc`) and Python 3.

```sh
npm ci
npx playwright install chromium
npm run dev
```

For the production preview:

```sh
npm run build
npm run preview
```

Use the local URL printed by the server. Opening index.html directly or serving
the repository with a plain HTTP server no longer compiles the player.

## Checks

```sh
npm run typecheck
python3 -m unittest discover -s tests -v
npm run build
npm run test:e2e
SITE_BASE=/doubleclicc/ npm run build
SITE_BASE=/doubleclicc/ npm run test:e2e
```

Browser checks run against the production output on port 4173, including real
player playback, banner/button navigation, menu-triggered pause/resume, reduced motion,
failed loading, JavaScript disabled, retained dialogs, and phone widths.
The navigation tests also check duplicate IDs, fragments, and source assets.
Gray Paper checks cover matching card/article titles, opening all three readers
on phone and desktop widths, keyboard dismissal, focus return, and scroll reset
when reopening. Production checks catch failed local assets and uncaught runtime
errors, and verify the client marquee stays accessible with reduced motion.
These checks run automatically in both pull-request validation and release
validation through the existing browser suite.
Google requests in automated tests are intercepted after navigation; the local
browser review separately verifies Google's actual page opens.

## Source and configuration

- `index.html`: semantic page and no-JavaScript fallback.
- `src/main.tsx`: React mount and failure recovery; `src/site.js`: page behavior.
- `src/mobile-menu.ts`: compact navigation, dismissal, and player suspension.
- `src/components/doubleclicc/`: player, timeline, branding, and five scenes.
- `src/styles.css`: page styles, fonts, and player host styling.
- `public/fonts/`: original supplied fonts and both OFL licenses.
- `docs/integrations/doubleclicc-player/`: original handoff instructions and
  historical checksums. The checksums describe the original handoff, not the
  modified integrated files.

The banner, its persistent button, and the static loading fallback open the
consultation modal. Visitors without JavaScript see a message explaining it is
needed to submit a request.
At viewport widths up to 960px, the menu overlays the page and temporarily
pauses the player. Closing it resumes playback. The hero has no manual playback
controls; the diagnostic CTA is centered below the animation. Escape, outside taps,
navigation, and resizing to desktop dismiss the menu; without JavaScript the
navigation stays visible. Header clearance is measured, and scrollbar space is
reserved so opening the menu cannot resize the animation.
The diagnostic buttons open the published Google Form inside a branded dialog.
Google handles validation, submission, and confirmation, and writes responses to
whatever Sheet the form owner has linked. No Apps Script or website credentials
are needed. The embed loads on first opening and retains entries while the dialog
is closed. A direct responder link is available beneath it.

## Release flow

1. Review the local production preview before publishing.
2. Open a pull request into `main`; wait for **Navigation links**. It installs
   locked dependencies and checks builds at `/` and `/doubleclicc/`.
3. Merge after approval. **Deploy Pages** obtains the configured Pages base path,
   builds and tests the exact merged commit, then uploads only `dist/`.
4. Wait for **Publish site** to succeed before checking the live site.

Merging into main publishes automatically. No gh_pages branch or additional
release PR is required. Manual deployment is supported only from main.
Generated files, dependencies, browser reports, and temporary work are ignored.
Source TSX and handoff documents are never uploaded as the Pages artifact.

## GitHub settings

- Settings → Pages → Build and deployment → Source: **GitHub Actions**.
- Keep `main` protected with pull requests and the required **Navigation links**
  check. Keep existing protection rules in place.
- Settings → Environments → github-pages: allow deployment from `main`.
- The workflow reads the Pages base path automatically, including custom domains.

No new credentials, database, rendering service, or server host are required.
Desktop/mobile checks are automated; verify smooth playback on a physical phone
before final publication when a device is available.
