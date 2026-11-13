// Install fibub as an app (every page). Registers the service worker (src/sw.js), which keeps the pages
// you open working offline, and wires up every [data-install] button or link:
//   - Chrome, Edge, Samsung Internet (Android and computers): the button opens the browser's own
//     "Install app" box (the beforeinstallprompt event);
//   - iPhone and iPad (Safari has no install box): the button shows the Share > Add to Home Screen steps;
//   - other browsers: the link goes to /app/, which explains each browser.
// Nothing is sent anywhere; the browser itself does the installing. In the installed app the buttons hide.

type BIP = Event & { prompt(): Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

const html = document.documentElement;
const standalone = matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;
if (standalone) html.classList.add('is-app');

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
}

const ua = navigator.userAgent;
const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
let deferred: BIP | null = null;

function steps() {
  let dlg = document.querySelector<HTMLDialogElement>('.inst-dlg');
  if (!dlg) {
    dlg = document.createElement('dialog');
    dlg.className = 'inst-dlg';
    dlg.setAttribute('aria-labelledby', 'inst-h');
    dlg.innerHTML = `<h2 id="inst-h">Add fibub to your Home Screen</h2>
      <ol>
        <li>Tap the <b>Share</b> button <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Share icon"><path d="M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /></svg> in Safari's bar.</li>
        <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
        <li>Tap <b>Add</b>. fibub opens from its own icon, full screen.</li>
      </ol>
      <p class="inst-note">In Chrome or another browser on iPhone, use its Share button the same way; if you don't see the option, open fibub.com in Safari.</p>
      <div class="inst-row"><a href="/app/">More about the app</a><button type="button" class="btn inst-ok">OK</button></div>`;
    document.body.append(dlg);
    dlg.querySelector('.inst-ok')!.addEventListener('click', () => dlg!.close());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg!.close(); });
  }
  dlg.showModal();
}

function sync() {
  const ready = !standalone && (!!deferred || ios);
  document.querySelectorAll<HTMLElement>('[data-install]').forEach((el) => { el.dataset.ready = String(ready); });
  // Parts of a page that only make sense when the browser can install right now (the /app/ page's button).
  document.querySelectorAll<HTMLElement>('[data-install-only]').forEach((el) => { el.hidden = !ready; });
}

addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // no pop-up of the browser's own; the visitor chooses when, from our button
  deferred = e as BIP;
  sync();
});
addEventListener('appinstalled', () => {
  deferred = null;
  document.querySelectorAll<HTMLElement>('[data-install]').forEach((el) => { el.dataset.ready = 'false'; el.dataset.done = 'true'; });
  document.querySelectorAll<HTMLElement>('[data-install-only]').forEach((el) => { el.hidden = true; });
  document.querySelectorAll<HTMLElement>('[data-install-done]').forEach((el) => { el.hidden = false; });
});

document.addEventListener('click', async (e) => {
  const el = (e.target as Element).closest<HTMLElement>('[data-install]');
  if (!el || standalone) return;
  if (deferred) {
    e.preventDefault();
    const d = deferred;
    deferred = null;
    await d.prompt();
    await d.userChoice.catch(() => null);
    sync();
  } else if (ios) {
    e.preventDefault();
    steps();
  } // otherwise a link simply opens /app/
});

sync();

// The installed app has no browser bar, and iPhones have no back gesture to leave a page opened from a
// link, so the header gets a Back button there (not on the home page).
if (standalone && location.pathname !== '/') {
  const back = document.querySelector<HTMLButtonElement>('.back-btn');
  if (back) {
    back.hidden = false;
    back.addEventListener('click', () => { if (history.length > 1) history.back(); else location.href = '/'; });
  }
}
