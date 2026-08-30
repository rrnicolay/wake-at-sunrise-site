// Which call to action the landing pages show. Both languages read this one
// file, so filling a URL in here updates English and Portuguese together.
//
// Fill them in as the app moves forward — the page picks the furthest stage
// it has a link for, and shows only that:
//
//   nothing set        "ask for the link" email button
//   GROUP              waitlist: one button, join the tester group
//   GROUP + OPT_IN     closed beta: join the group, then accept the test
//   PLAY               public: one button, download from Google Play
//
// The stages are separate blocks in the HTML rather than one block that
// mutates, so each language writes its own wording and no stage can leave a
// button behind that does not apply yet.
//
//   BETA_GROUP_URL   groups.google.com/g/<group> — exists as soon as the
//                    group does, with no involvement from Google Play.
//   BETA_OPT_IN_URL  the closed track's "join on the web" URL, from its
//                    Testers tab. Only appears once a release there has
//                    cleared review.
//   PLAY_URL         play.google.com/store/apps/details?id=... — set this
//                    at public launch and the beta disappears from the page.
var BETA_GROUP_URL = 'https://groups.google.com/g/wake-at-sunrise-beta';
var BETA_OPT_IN_URL = 'https://play.google.com/apps/testing/io.github.rrnicolay.wakeatsunrise';
var PLAY_URL = '';

(function () {
  // Email assembled at runtime to keep the address out of scraper-friendly
  // source.
  var addr = ['wakeatsunriseapp', 'gmail.com'].join('@');
  var mailto = 'mailto:' + addr + '?subject=' +
    encodeURIComponent('Wake at Sunrise beta');
  document.querySelectorAll('.js-mail').forEach(function (a) {
    a.href = mailto;
  });

  // Relabels (and optionally retargets) the hero button for the current
  // stage. Wording comes from the page's data attributes, so translations
  // stay in the HTML; a missing attribute leaves the default text alone.
  function heroLabel(key, href) {
    var hero = document.getElementById('cta-beta');
    if (!hero) {
      return;
    }
    if (hero.dataset[key]) {
      hero.textContent = hero.dataset[key];
    }
    if (href) {
      hero.href = href;
    }
  }

  function show(id) {
    document.querySelectorAll('.beta-mode').forEach(function (el) {
      el.hidden = el.id !== id;
    });
  }

  if (PLAY_URL) {
    document.getElementById('public-play').href = PLAY_URL;
    show('mode-public');
    // The hero button leads to the store too, not to a beta that is over.
    heroLabel('labelPublic', PLAY_URL);
    return;
  }

  if (BETA_GROUP_URL && BETA_OPT_IN_URL) {
    document.getElementById('beta-group').href = BETA_GROUP_URL;
    document.getElementById('beta-optin').href = BETA_OPT_IN_URL;
    show('mode-beta');
    return;
  }

  if (BETA_GROUP_URL) {
    document.getElementById('waitlist-group').href = BETA_GROUP_URL;
    // Until the track opens there is no beta to join yet, only a queue —
    // the hero button should not promise more than the section delivers.
    heroLabel('labelWaitlist');
    show('mode-waitlist');
    return;
  }

  show('mode-soon');
})();
