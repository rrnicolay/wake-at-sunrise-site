# Wake at Sunrise — landing page

Static landing page for the [Wake at Sunrise](https://github.com/rrnicolay/wake_at_sunrise) Android app. Plain HTML/CSS, no build step, hosted on GitHub Pages.

## Publish

From this directory:

```sh
gh repo create wake-at-sunrise-site --public --source=. --push
gh api -X POST repos/rrnicolay/wake-at-sunrise-site/pages \
  -f "source[branch]=main" -f "source[path]=/"
```

(Or create the repo on github.com, push, then Settings → Pages → Deploy from a branch → `main` / root.)

The site goes live at **https://rrnicolay.github.io/wake-at-sunrise-site/** a minute or two later. Pushes to `main` redeploy automatically.

## Layout

| | English | Português |
| --- | --- | --- |
| Landing | `index.html` | `pt.html` |
| Privacy policy | `privacy.html` | `privacidade.html` |
| Data deletion | `delete-data.html` | `excluir-dados.html` |

Shared: `styles.css` (landing), `doc.css` (legal pages), `beta.js`,
`app-home.webp` / `app-home-pt.webp`. Language pairs link to each other and
declare `hreflang`, so each URL is canonical in its own language — the Play
listing can point the en-US entry at `index.html` and the pt-BR entry at
`pt.html`. There is no auto-redirect: guessing a visitor's language and
being wrong is worse than a visible switcher.

## Before sharing the link

- [ ] Read `privacy.html` and `privacidade.html` top to bottom and confirm
      every claim is accurate — `privacy.html` doubles as the privacy policy
      URL for the Play listing, and `delete-data.html` as its data-deletion
      URL.
- [ ] When the closed test exists, fill in `BETA_GROUP_URL` and
      `BETA_OPT_IN_URL` at the top of `beta.js`. Both pages read that one
      file, so the step-by-step appears in English and Portuguese at once;
      until then both fall back to the "ask for the link" email button.

## Notes

- Copy lives twice, once per language: when you change a claim on one
  landing page, change its twin.
- The beta/contact buttons build a `mailto:` link in JavaScript to keep the
  raw address out of the page source (basic scraper deterrence, not
  bulletproof).
- No third-party requests: no external fonts, analytics or CDNs. The only
  assets are same-origin CSS, one small script and the screenshots.
