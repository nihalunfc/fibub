// Public counters: page views for the whole site (footer), and views and uses for each tool (tool
// pages). Every page load sends one tiny note to /api/hit saying only which tool page it is, if any;
// the first time someone uses the tool on that page, one more note goes to /api/use. Nothing about
// the visitor is sent or kept (see worker/index.ts), and the tools work the same if the counter is
// down: the numbers just stay hidden.

const tool = document.documentElement.dataset.tool || undefined;
const fmt = (n: number) => n.toLocaleString('en');

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

let uses: number | undefined;
// Pages opened in the background by the browser (prerendering) are counted only once someone looks.
const countView = () => post('/api/hit', { t: tool })
  .then((r) => (r.ok ? r.json() : null))
  .then((c: { site: number; v?: number; u?: number } | null) => {
    if (!c) return;
    show('site', c.site); show('v', c.v);
    if (uses === undefined) uses = c.u; show('u', uses);
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
      .then((c: { u: number } | null) => { if (c) { uses = c.u; show('u', uses); } })
      .catch(() => {});
  };
  events.forEach((t) => ui.addEventListener(t, onUse, true));
}
