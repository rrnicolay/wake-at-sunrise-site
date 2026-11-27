// Language handling, loaded in <head> of every page.
// - Choosing a language in the menu is remembered, so it always wins.
// - The root home page (<meta name="autolang">) sends a first-time visitor
//   to the home page in their browser's language, if the site has it.
(function () {
  var HOME = { en: "index.html", pt: "pt.html", de: "de/index.html",
    es: "es/index.html", nl: "nl/index.html", sv: "sv/index.html",
    nb: "nb/index.html", da: "da/index.html", fi: "fi/index.html",
    ru: "ru/index.html" };
  var KEY = "wasLang";

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function remember(code) {
    try { localStorage.setItem(KEY, code); } catch (e) {}
  }
  function supported(tag) {
    var t = String(tag || "").toLowerCase();
    var p = t.split("-")[0];
    if (p === "no" || p === "nn") p = "nb";
    return HOME[p] ? p : null;
  }

  var auto = document.querySelector('meta[name="autolang"]');
  if (auto && !stored() && !/[?&]lang=/.test(location.search)) {
    var langs = navigator.languages || [navigator.language];
    for (var i = 0; i < langs.length; i++) {
      var code = supported(langs[i]);
      if (code) {
        if (code !== "en") location.replace(HOME[code]);
        break;
      }
    }
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest(".langmenu a[data-lang]");
    if (a) remember(a.getAttribute("data-lang"));
    // Close an open menu when clicking anywhere else.
    var open = document.querySelectorAll(".langmenu[open]");
    for (var i = 0; i < open.length; i++) {
      if (!open[i].contains(e.target)) open[i].removeAttribute("open");
    }
  });
})();
