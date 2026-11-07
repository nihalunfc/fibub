// Runs before the page draws, so it never flashes the wrong colours.
// Light or dark: the visitor's choice from the header switch, kept only in this browser.
// Red light (astronomy pages): kept for this tab only.
(function () {
  var html = document.documentElement;
  try { if (localStorage.getItem('fibub-theme') === 'dark') html.setAttribute('data-theme', 'dark'); } catch (e) {}
  try { if (html.getAttribute('data-shelf') === 'science' && sessionStorage.getItem('fibub-red-light')) html.classList.add('red-mode'); } catch (e) {}
})();
