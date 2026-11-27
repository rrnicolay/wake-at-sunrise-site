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

Ten languages, matching the app: English and Português keep their original
addresses; the others live in a folder per language with the English file
names.

| | English | Português | de, es, nl, sv, nb, da, fi, ru |
| --- | --- | --- | --- |
| Landing | `index.html` | `pt.html` | `<lang>/index.html` |
| Help ("Alarm didn't ring?") | `help.html` | `ajuda.html` | `<lang>/help.html` |
| Privacy policy | `privacy.html` | `privacidade.html` | `<lang>/privacy.html` |
| Data deletion | `delete-data.html` | `excluir-dados.html` | `<lang>/delete-data.html` |
| Press kit | `press.html` | `imprensa.html` | `<lang>/press.html` |
| Articles | `articles/*.html` | `articles/*.html` (pt slugs) | `<lang>/articles/*.html` |

Shared: `styles.css` (landing), `doc.css` (other pages), `beta.js`,
`lang.js`, `app-home-<lang>.webp`, `press/` (store graphics per language).

**Languages are wired by `python3 tools/i18n.py`** (run it after adding or
renaming a page; the page map is at the top of the script). On every page it
writes the full `hreflang` set (ten languages + `x-default` → English), the
language menu, and the `lang.js` tag, and it regenerates `sitemap.xml`. In a
new page put `<!--LANGS-->` where the menu goes.

`lang.js`: on the root `index.html` only, a first-time visitor is sent to the
home page in their browser's language (`navigator.languages`; `no`/`nn` →
Norsk), falling back to English. Choosing a language in the menu is stored
in `localStorage` and always wins over the browser, so the redirect never
fights a manual choice. Search engines see each URL in its own language via
`hreflang`; the redirect is client-side and only on the root.

Adding a language: see `docs/adding-a-language.md` in the app repo.

## Before sharing the link

- [ ] Read `privacy.html` and `privacidade.html` top to bottom and confirm
      every claim is accurate — `privacy.html` doubles as the privacy policy
      URL for the Play listing, and `delete-data.html` as its data-deletion
      URL.
- [ ] Fill in the URLs at the top of `beta.js` as they come into
      existence. The page shows the furthest stage it has a link for, in
      both languages at once:

      | Set | The page shows |
      | --- | --- |
      | nothing | "ask for the beta link" email button |
      | `BETA_GROUP_URL` | waitlist: one button, join the tester group |
      | `+ BETA_OPT_IN_URL` | closed beta: join the group, then accept the test |
      | `PLAY_URL` | public: one button, download from Google Play |

      The group URL exists as soon as the Google Group does, so the
      waitlist can start collecting testers while Google reviews the
      release.

## Notes

- Copy lives once per language: when you change a claim on one page,
  change it in all ten.
- The beta/contact buttons build a `mailto:` link in JavaScript to keep the
  raw address out of the page source (basic scraper deterrence, not
  bulletproof).
- No third-party requests: no external fonts, analytics or CDNs. The only
  assets are same-origin CSS, one small script and the screenshots.
