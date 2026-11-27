#!/usr/bin/env python3
"""Wire every page of the site into its ten language versions.

For each page in each language this script (idempotently):
  - replaces the <link rel="alternate" hreflang> block with the full set
    (all ten languages + x-default), right after the canonical link;
  - replaces the language switcher with a <details> menu of all ten
    languages (home pages: the <nav class="lang"> contents; other pages: the
    <!--LANGS--> placeholder or the old "· Português"/"· English" link,
    or a previous menu);
  - loads lang.js in <head> (remembers a manual choice; the root home page
    sends a first-time visitor to their browser's language);
  - regenerates sitemap.xml with the alternates.

Run from the site root after adding or changing pages:  python3 tools/i18n.py
"""
import os
import re
from datetime import date

BASE = "https://rrnicolay.github.io/wake-at-sunrise-site/"
LANGS = [  # (code, hreflang, native name)
    ("en", "en", "English"),
    ("pt", "pt-BR", "Português"),
    ("de", "de", "Deutsch"),
    ("es", "es", "Español"),
    ("nl", "nl", "Nederlands"),
    ("sv", "sv", "Svenska"),
    ("nb", "nb", "Norsk"),
    ("da", "da", "Dansk"),
    ("fi", "fi", "Suomi"),
    ("ru", "ru", "Русский"),
]
# Logical page -> path per language. New languages live in <code>/ with
# the English slugs; en and pt keep their original addresses.
PAGES = {
    "home": {"en": "index.html", "pt": "pt.html"},
    "help": {"en": "help.html", "pt": "ajuda.html"},
    "privacy": {"en": "privacy.html", "pt": "privacidade.html"},
    "delete": {"en": "delete-data.html", "pt": "excluir-dados.html"},
    "press": {"en": "press.html", "pt": "imprensa.html"},
    "a-sun": {"en": "articles/waking-with-the-sun.html",
              "pt": "articles/acordar-com-o-sol.html"},
    "a-year": {"en": "articles/sunrise-through-the-year.html",
               "pt": "articles/nascer-do-sol-ao-longo-do-ano.html"},
    "a-travel": {"en": "articles/waking-at-sunrise-while-travelling.html",
                 "pt": "articles/acordar-com-o-sol-em-viagem.html"},
    "a-compute": {"en": "articles/how-the-app-computes-sunrise.html",
                  "pt": "articles/como-o-app-calcula-o-nascer-do-sol.html"},
}
EN_SLUG = {"home": "index.html", "help": "help.html", "privacy": "privacy.html",
           "delete": "delete-data.html", "press": "press.html"}
for page, paths in PAGES.items():
    for code, _, _ in LANGS[2:]:
        paths[code] = f"{code}/" + (EN_SLUG.get(page) or paths["en"])


def url(path):
    return BASE if path == "index.html" else BASE + path


def rel(from_path, to_path):
    r = os.path.relpath(to_path, os.path.dirname(from_path) or ".")
    return r


def alternates(page):
    lines = [f'<link rel="alternate" hreflang="{h}" href="{url(PAGES[page][c])}">'
             for c, h, _ in LANGS]
    lines.append(f'<link rel="alternate" hreflang="x-default" href="{url(PAGES[page]["en"])}">')
    return "\n".join(lines)


def menu(page, code):
    me = PAGES[page][code]
    name = dict((c, n) for c, _, n in LANGS)[code]
    items = []
    for c, h, n in LANGS:
        cur = ' aria-current="page"' if c == code else ""
        items.append(f'<li><a href="{rel(me, PAGES[page][c])}" hreflang="{h}" '
                     f'lang="{h}" data-lang="{c}"{cur}>{n}</a></li>')
    return (f'<details class="langmenu"><summary>{name}</summary><ul>'
            + "".join(items) + "</ul></details>")


# Heading of the home page's languages card.
TEN = {"en": "Ten languages", "pt": "Dez idiomas", "de": "Zehn Sprachen",
       "es": "Diez idiomas", "nl": "Tien talen", "sv": "Tio språk",
       "nb": "Ti språk", "da": "Ti sprog", "fi": "Kymmenen kieltä",
       "ru": "Десять языков"}
MENU_RE = re.compile(r'<details class="langmenu">.*?</details>', re.S)


def process(page, code):
    path = PAGES[page][code]
    if not os.path.exists(path):
        print("missing", path)
        return False
    s = open(path, encoding="utf-8").read()
    # hreflang block, right after canonical.
    s = re.sub(r'\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">', "", s)
    alt = alternates(page)
    if '<link rel="canonical"' in s:
        s = re.sub(r'(<link rel="canonical" href="[^"]*">)', lambda mm: mm.group(1) + "\n" + alt, s, count=1)
    else:
        s = s.replace("</head>", alt + "\n</head>", 1)
    # Language menu.
    m = menu(page, code)
    if MENU_RE.search(s):
        s = MENU_RE.sub(lambda _: m, s, count=1)
    elif "<!--LANGS-->" in s:
        sep = "" if page == "home" else " · "
        s = re.sub(r"\s*<!--LANGS-->", lambda _: sep + m, s, count=1)
    elif page == "home":
        s = re.sub(r'(<nav class="lang"[^>]*>).*?(</nav>)', lambda mm: mm.group(1) + m + mm.group(2), s, count=1, flags=re.S)
    else:
        s, n = re.subn(r'\s*·\s*<a href="[^"]*" lang="(pt-BR|en)">[^<]*</a>', lambda _: " · " + m, s, count=1)
        if not n:
            print("no switcher slot in", path)
    # <details> can't sit inside a <p>, so the "updated" line is a <div>.
    s = re.sub(r'<p class="updated">((?:(?!</p>).)*?class="langmenu".*?)</p>',
               r'<div class="updated">\1</div>', s, count=1, flags=re.S)
    if page == "home":
        s = re.sub(r'(<span class="ico" aria-hidden="true">🌐</span>\s*<h3>)[^<]*(</h3>)',
                   lambda mm: mm.group(1) + TEN[code] + mm.group(2), s, count=1)
    # lang.js in <head>; the root home page also opts into the redirect.
    s = re.sub(r'\s*<meta name="autolang"[^>]*>', "", s)
    s = re.sub(r'\s*<script src="[^"]*lang\.js"></script>', "", s)
    tag = f'<script src="{rel(path, "lang.js")}"></script>'
    if path == "index.html":
        tag = '<meta name="autolang" content="1">\n' + tag
    s = s.replace("</head>", tag + "\n</head>", 1)
    open(path, "w", encoding="utf-8").write(s)
    return True


def sitemap():
    today = date.today().isoformat()
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
           'xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for page in PAGES:
        for c, _, _ in LANGS:
            out.append(f"  <url><loc>{url(PAGES[page][c])}</loc><lastmod>{today}</lastmod>")
            for c2, h2, _ in LANGS:
                out.append(f'    <xhtml:link rel="alternate" hreflang="{h2}" href="{url(PAGES[page][c2])}"/>')
            out.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{url(PAGES[page]["en"])}"/>')
            out.append("  </url>")
    out.append("</urlset>")
    open("sitemap.xml", "w", encoding="utf-8").write("\n".join(out) + "\n")


if __name__ == "__main__":
    ok = all(process(p, c) for p in PAGES for c, _, _ in LANGS)
    sitemap()
    print("done" if ok else "done with missing pages")
