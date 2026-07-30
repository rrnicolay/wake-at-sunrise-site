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

## Before sharing the link

- [ ] Read `privacy.html` top to bottom and confirm every claim is accurate — this page doubles as the privacy policy URL for the Play Store listing.
- [ ] When the Play closed-testing opt-in link exists, point the hero "Join the beta" button at it (search `index.html` for `TODO`).
- [ ] Optionally replace the CSS phone mockup with real screenshots.

## Notes

- The beta/contact buttons build a `mailto:` link in JavaScript to keep the raw address out of the page source (basic scraper deterrence, not bulletproof).
- Everything is inline — no external fonts, scripts, or images — so the page has no third-party requests and loads instantly.
