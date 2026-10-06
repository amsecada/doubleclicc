# Publishing Doubleclicc

Merging a pull request into `main` automatically publishes the site through
GitHub Actions. No second release pull request or `gh_pages` merge is needed.
The site is plain HTML, CSS, and JavaScript; no build or package installation
is required. `.nojekyll` disables Jekyll processing.

## Local checks

```sh
python3 -m unittest discover -s tests -v
node --check main.js
```

The tests check header destinations, duplicate IDs, fragment links, and local
script/stylesheet files. They do not test browser interactions or external URLs.

## Release flow

1. Open a pull request into `main` and wait for **Navigation links** to pass.
2. Merge it. **Deploy Pages** automatically tests the merged commit, packages
   `index.html`, `styles.css`, `main.js`, and `.nojekyll`, then publishes it.
3. Wait for **Publish site** to succeed in Actions before checking the live site.

Update the workflow's explicit file list if the site gains additional assets.
A failed validation blocks deployment. Manual deployment runs are also supported,
but only when run against `main`. The legacy `gh_pages` branch is no longer used
by this workflow and does not need to be synchronized.

## GitHub settings

- Settings → Pages: use **GitHub Actions** as the source.
- Keep `main` protected with pull requests and the required **Navigation links**
  check. This change does not remove or bypass branch protection.
- Settings → Environments → github-pages: deployment branch rules must allow
  `main`. If selected branches are configured, replace `gh_pages` with `main`.
  Keep any other environment protection settings unchanged.

## Content review

- The Work section includes Syllabusy, Smokesignal, and Sherwood with launch links.
- The About section still contains founder/portrait placeholders.
- The diagnostic form currently displays success without transmitting data.
