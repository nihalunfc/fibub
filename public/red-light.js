// Red light for night use: switch it on before the page draws, so it never flashes white.
try { if (sessionStorage.getItem('fibub-red-light')) document.documentElement.classList.add('red-mode'); } catch (e) {}
