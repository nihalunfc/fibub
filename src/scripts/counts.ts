// Public counters: page views for the whole site (home page), and each page's own views (under its
// title). Every page load sends one tiny note to /api/hit saying only which page it is (and which
// tool, on a tool page); the first time someone uses the tool on that page, one more note goes to
// /api/use. Uses are counted and published in the repo (data/views/) but not shown on the pages for
// now. Nothing about the visitor is sent or kept (see worker/index.ts), and the tools work the same
// if the counter is down: the numbers just stay hidden.

const tool = document.documentElement.dataset.tool || undefined;
const path = location.pathname;
const fmt = (n: number) => n.toLocaleString('en');

// Pages without their own counter line (everything but tool pages and the home page) get one under
// their title.
if (path !== '/' && !document.querySelector('[data-count="v"]')) {
  const h1 = document.querySelector('main h1');
  if (h1) {
    const p = document.createElement('p');
    p.className = 'page-views';
    p.dataset.counter = '';
    p.hidden = true;
    p.title = 'How many times this page has been opened, counted as a running total. Nothing about you is kept.';
    const b = document.createElement('b'), label = document.createElement('span');
    b.dataset.count = 'v';
    label.dataset.one = 'view'; label.dataset.many = 'views'; label.textContent = 'views';
    p.append(b, ' ', label);
    h1.after(p);
  }
}

function show(key: 'site' | 'v' | 'u', n: number | undefined) {
  if (typeof n !== 'number') return;
  document.querySelectorAll<HTMLElement>(`[data-count="${key}"]`).forEach((el) => {
    el.textContent = fmt(n);
    const label = el.nextElementSibling as HTMLElement | null;
    if (label?.dataset.one) label.textContent = n === 1 ? label.dataset.one : label.dataset.many!;
    el.closest<HTMLElement>('[data-counter]')?.removeAttribute('hidden');
  });
}

const post = (path: string, body: object) =>
  fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true, credentials: 'omit' });

// Pages opened in the background by the browser (prerendering) are counted only once someone looks.
const countView = () => post('/api/hit', { p: path, t: tool })
  .then((r) => (r.ok ? r.json() : null))
  .then((c: { site: number; v?: number } | null) => {
    if (!c) return;
    show('site', c.site); show('v', c.v);
  })
  .catch(() => { /* counter unreachable (offline, local preview): numbers stay hidden */ });
if ((document as any).prerendering) document.addEventListener('prerenderingchange', countView, { once: true });
else countView();

// A "use" is the first time someone works the tool on this page: picks or drops a file, types or
// changes a setting, or presses one of its buttons. It is counted once per page load.
const ui = document.querySelector<HTMLElement>('.tool-ui');
if (tool && ui) {
  const events = ['change', 'input', 'drop', 'click'] as const;
  const onUse = (e: Event) => {
    if (!e.isTrusted) return;
    if (e.type === 'click' && !(e.target as HTMLElement).closest('button, [role="button"], a[download], label, summary')) return;
    events.forEach((t) => ui.removeEventListener(t, onUse, true));
    post('/api/use', { t: tool })
      .then((r) => (r.ok ? r.json() : null))
      .then((c: { u: number } | null) => { if (c) show('u', c.u); })
      .catch(() => {});
  };
  events.forEach((t) => ui.addEventListener(t, onUse, true));
}
