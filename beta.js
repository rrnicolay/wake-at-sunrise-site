  // The two links a closed-test tester needs, in order. Fill both in and the
  // step-by-step below replaces the "ask for the link" fallback:
  //   1. the Google Group testers join (groups.google.com/g/<group>)
  //   2. Play's "join on the web" opt-in URL, from the closed track's
  //      Testers tab — only exists once the release is published.
  var BETA_GROUP_URL = '';
  var BETA_OPT_IN_URL = '';

  (function () {
    // Email assembled at runtime to keep the address out of
    // scraper-friendly source.
    var addr = ['wakeatsunriseapp', 'gmail.com'].join('@');
    var mailto = 'mailto:' + addr + '?subject=' +
      encodeURIComponent('Wake at Sunrise beta');
    document.querySelectorAll('.js-mail').forEach(function (a) {
      a.href = mailto;
    });

    if (!BETA_GROUP_URL || !BETA_OPT_IN_URL) {
      return;   // keep the email fallback until the test is live
    }
    document.getElementById('beta-group').href = BETA_GROUP_URL;
    document.getElementById('beta-optin').href = BETA_OPT_IN_URL;
    document.getElementById('beta-steps').hidden = false;
    document.getElementById('beta-soon').hidden = true;
  })();
