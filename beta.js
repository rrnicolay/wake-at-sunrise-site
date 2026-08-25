// The two links a closed-test tester needs, in order. Both landing pages
// read this file, so filling them in here updates English and Portuguese
// at once.
//
//   1. BETA_GROUP_URL  — the Google Group testers join
//                        (groups.google.com/g/<group>). Exists as soon as
//                        the group does, independently of Google Play.
//   2. BETA_OPT_IN_URL — Play's "join on the web" URL, from the closed
//                        track's Testers tab. Only exists once the release
//                        has been published to that track.
//
// Three states, because the group almost always comes first and recruiting
// people into it is the slow part — no reason to make that wait on Google's
// review:
//   neither  -> the "ask for the link" email button
//   group    -> both steps, with step 2 marked as not open yet
//   both     -> the full flow
var BETA_GROUP_URL = '';
var BETA_OPT_IN_URL = '';

(function () {
  // Email assembled at runtime to keep the address out of scraper-friendly
  // source.
  var addr = ['wakeatsunriseapp', 'gmail.com'].join('@');
  var mailto = 'mailto:' + addr + '?subject=' +
    encodeURIComponent('Wake at Sunrise beta');
  document.querySelectorAll('.js-mail').forEach(function (a) {
    a.href = mailto;
  });

  if (!BETA_GROUP_URL) {
    return;   // nothing to join yet; keep the email fallback
  }

  var group = document.getElementById('beta-group');
  var optin = document.getElementById('beta-optin');
  group.href = BETA_GROUP_URL;

  if (BETA_OPT_IN_URL) {
    optin.href = BETA_OPT_IN_URL;
  } else {
    // The wording is per-language, so each page supplies it rather than
    // this script carrying translations.
    optin.textContent = optin.dataset.pending || optin.textContent;
    optin.removeAttribute('href');
    optin.setAttribute('aria-disabled', 'true');
    optin.classList.add('btn-pending');
  }

  document.getElementById('beta-steps').hidden = false;
  document.getElementById('beta-soon').hidden = true;
})();
