// Runs before the page draws, so it never flashes the wrong colours.
// Light or dark: the visitor's choice from the header switch, kept only in this browser.
// Red light (astronomy pages): kept for this tab only.
(function () {
  var html = document.documentElement;
  try { if (localStorage.getItem('fibub-theme') === 'dark') html.setAttribute('data-theme', 'dark'); } catch (e) {}
  // The phone's status bar (and the installed app's title bar) takes the page colour.
  var tc = document.querySelector('meta[name="theme-color"]');
  if (tc && html.getAttribute('data-theme') === 'dark') tc.setAttribute('content', '#000000');
  try { if (html.getAttribute('data-shelf') === 'science' && sessionStorage.getItem('fibub-red-light')) html.classList.add('red-mode'); } catch (e) {}
})();
