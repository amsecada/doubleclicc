# Publishing Doubleclicc

The publication branch is `gh_pages` (underscore), as requested. The site is
plain HTML, CSS, and JavaScript at the repository root. `.nojekyll` disables
Jekyll processing. No build or package installation is needed.

## Local checks

```sh
python3 -m unittest discover -s tests -v
```

The suite checks every anchor in the site header, including the home logo,
for a nonempty fragment with exactly one destination inside `main` (or `main`
itself). It also checks duplicate IDs, all other fragment links, and local
script/stylesheet files. Newly added header links are included automatically.
These are static checks, not browser interaction tests or external URL checks.
The diagnostic button opens a dialog and is not an anchor link.

## Required GitHub configuration

These settings are not activated by committing this file or the workflow.

1. Commit the site files, tests, workflow, and `.nojekyll` to the development
   branch. Run the checks before initially creating `gh_pages` from that tested
   commit. Do not create it from the old README-only commit.
2. In Settings → Pages, choose **GitHub Actions** as the source.
3. In Settings → Branches, protect **gh_pages**. Require a pull request before
   merging; require **Navigation links** to pass; require the branch to be
   up to date; disallow bypassing the requirements (including administrators),
   force pushes, and deletion. The check becomes selectable after its first run.
   If the repository's plan does not support protection, this enforcement needs
   an eligible plan; the workflow alone cannot enforce it.
4. Keep the tests and workflow on `gh_pages`. For future releases, open a pull
   request from the development branch into `gh_pages` and merge only after
   the required check succeeds. `deploy-pages.yml` tests the release commit,
   packages only `index.html`, `styles.css`, `main.js`, and `.nojekyll`, and
   deploys only after validation succeeds. Update that explicit file list if
   the site gains additional assets.
5. In Settings → Environments → github-pages, allow deployments only from
   `gh_pages`. A manual workflow run on any other branch is also skipped by
   the workflow's branch guard.

Checks triggered by a direct push run after the push and cannot prevent that
push. Required PR checks and branch protection
are therefore essential: they prevent untested changes entering `gh_pages`.
The deployment workflow independently blocks publication when the release
tests fail. This setup uses normal pull-request merges to trigger releases.
No personal access token or extra deployment secret is needed.

## Current setup status

The repository is now `amsecada/doubleclicc` and is public. On inspection,
the active `ProtectMain` ruleset targets only the default branch and blocks
deletion and force-pushes. It does not require PRs or status checks and has an
administrator bypass. Extend protection to `gh_pages`, require PRs and the
`Navigation links` check with up-to-date branches, and remove the bypass.
The integration can read this ruleset but cannot edit repository settings.

## Content review

- Home, Systems, Work, and About currently resolve to existing page targets.
- The About section still contains founder/portrait placeholders.
- The diagnostic form currently displays success without transmitting data.
- The Syllabusy pilot login is explicitly disabled pending a real URL.

References:
- [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
