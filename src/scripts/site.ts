// Runs on every page: the tool list (☰ Tools) and "My tools", the list of tools a person has
// bookmarked. My tools is kept only in this browser (localStorage) and can be cleared from the list.
const KEY = 'fibub-mytools-v1';

/** One search word against a tool: "#3" finds tool number 3 only; "3" finds it too, or any tool whose text has a 3 in it. */
export const matches = (el: HTMLElement, w: string) => (/^#\d+$/.test(w) ? el.dataset.num === w.slice(1) : (/^\d+$/.test(w) && el.dataset.num === w) || el.dataset.search!.includes(w));

export function myTools(): string[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []; }
  catch { return []; }
}
export function setMyTools(ids: string[]) {
  try { ids.length ? localStorage.setItem(KEY, JSON.stringify(ids)) : localStorage.removeItem(KEY); } catch { /* storage blocked: nothing kept */ }
  document.dispatchEvent(new CustomEvent('fibub:mytools', { detail: ids }));
}

export const togglePin = (id: string) => { const ids = myTools(); setMyTools(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]); };

// "Only my tools": hide every other tool on the home page and in the tool list, until the person
// asks to see them all again. A single on/off flag, kept only in this browser.
const FOCUS = 'fibub-focus-v1';
export const focusOn = () => { try { return localStorage.getItem(FOCUS) === '1' && myTools().length > 0; } catch { return false; } };
export function setFocus(on: boolean) {
  try { on ? localStorage.setItem(FOCUS, '1') : localStorage.removeItem(FOCUS); } catch { /* blocked */ }
  document.dispatchEvent(new CustomEvent('fibub:focus', { detail: on }));
}

const btn = document.querySelector<HTMLButtonElement>('.menu-btn');
const panel = document.querySelector<HTMLElement>('#all-tools');

if (btn && panel) {
  const search = panel.querySelector<HTMLInputElement>('.at-search')!;
  const items = [...panel.querySelectorAll<HTMLAnchorElement>('.at-shelf .at-item')];
  const mine = panel.querySelector<HTMLElement>('.at-mine')!;
  const mineList = panel.querySelector<HTMLElement>('.at-mine-list')!;
  const empty = panel.querySelector<HTMLElement>('.at-empty')!;

  const open = (show: boolean) => {
    panel.hidden = !show;
    btn.setAttribute('aria-expanded', String(show));
    if (show) renderMine();
  };
  btn.addEventListener('click', () => open(panel.hidden));
  panel.querySelector('.at-close')!.addEventListener('click', () => { open(false); btn.focus(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) { open(false); btn.focus(); }
    // Ctrl+K or / opens the list with the search box ready.
    const typing = (e.target as HTMLElement)?.closest?.('input, textarea, select, [contenteditable]');
    if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) {
      e.preventDefault(); open(true); search.focus();
    }
  });

  search.addEventListener('input', () => {
    const words = search.value.toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const a of items) { const ok = words.every((w) => matches(a, w)); a.hidden = !ok; if (ok) shown++; }
    panel.querySelectorAll<HTMLElement>('.at-group').forEach((g) => (g.hidden = !g.querySelector('.at-item:not([hidden])')));
    panel.querySelectorAll<HTMLElement>('.at-shelf').forEach((s) => (s.hidden = !s.querySelector('.at-item:not([hidden])')));
    mine.hidden = words.length > 0 || !mineList.children.length;
    panel.classList.toggle('focus', focusOn() && !words.length);
    empty.hidden = shown > 0;
  });
  search.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { const first = items.find((a) => !a.hidden); if (first) location.href = first.href; }
  });

  function renderMine() {
    const ids = myTools();
    mineList.replaceChildren(...ids.map((id) => items.find((a) => a.dataset.id === id)).filter(Boolean).map((a) => {
      const c = a!.cloneNode(true) as HTMLAnchorElement;
      c.hidden = false;
      const shelf = a!.closest<HTMLElement>('.at-shelf')!;
      c.style.setProperty('--c', getComputedStyle(shelf).getPropertyValue('--c'));
      return c;
    }));
    mine.hidden = !mineList.children.length || search.value.trim() !== '';
    const f = focusOn() && !search.value.trim();
    panel.classList.toggle('focus', f);
    focusBtn.textContent = f ? `Show all ${items.length} tools` : 'Show only my tools';
  }
  const focusBtn = panel.querySelector<HTMLButtonElement>('.at-focus')!;
  focusBtn.addEventListener('click', () => setFocus(!focusOn()));
  document.addEventListener('fibub:focus', renderMine);
  panel.querySelector('.at-clear')!.addEventListener('click', () => { setMyTools([]); setFocus(false); renderMine(); });
  document.addEventListener('fibub:mytools', renderMine);
}

// Bookmark button on tool pages. A website cannot open the browser's bookmark box by itself, so the
// button asks first: on computers it shows the shortcut (Ctrl+D or ⌘D), which opens the browser's own
// bookmark box; on phones it opens the share sheet, which has "Add bookmark" and "Add to Home Screen".
// Pinning to My tools on fibub is a separate, optional tick box.
const bm = document.querySelector<HTMLElement>('.bm');
if (bm) {
  const id = bm.dataset.id!;
  const b = bm.querySelector<HTMLButtonElement>('.bm-btn')!;
  const tip = bm.querySelector<HTMLElement>('.bm-tip')!;
  const dlg = bm.querySelector<HTMLDialogElement>('.bm-dlg')!;
  const pin = dlg.querySelector<HTMLInputElement>('.bm-pin')!;
  const share = dlg.querySelector<HTMLButtonElement>('.bm-share')!;
  const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const touch = matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (mac) dlg.querySelector('.bm-k')!.textContent = '⌘';
  if (touch) {
    dlg.querySelector<HTMLElement>('.bm-desk')!.hidden = true;
    const ph = dlg.querySelector<HTMLElement>('.bm-phone')!;
    ph.hidden = false;
    if (navigator.share) share.hidden = false;
    else ph.textContent = 'Open your browser menu (⋮ or the share icon) and choose "Add bookmark" or "Add to Home Screen".';
  }
  const pinned = () => myTools().includes(id);
  const show = () => b.dataset.pinned = String(pinned());
  show();
  document.addEventListener('fibub:mytools', show);
  const close = () => {
    const ids = myTools().filter((x) => x !== id);
    setMyTools(pin.checked ? [id, ...ids] : ids);
    dlg.close();
    tip.textContent = pin.checked ? 'Pinned to My tools (in the Tools list).' : 'Keep it one tap away for everyday use.';
  };
  b.addEventListener('click', () => { pin.checked = pinned(); dlg.showModal(); });
  dlg.querySelector('.bm-done')!.addEventListener('click', close);
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  // Ctrl+D / ⌘D goes straight to the browser; close our prompt so its bookmark box is in front.
  dlg.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') setTimeout(close, 0); });
  share.addEventListener('click', async () => {
    try { await navigator.share({ title: document.title, url: location.href }); } catch { /* closed the share sheet */ }
    close();
  });
}

// Light or dark (every page): kept only in this browser. Red light (astronomy pages): kept for this tab.
{
  const html = document.documentElement, fire = () => document.dispatchEvent(new CustomEvent('fibub:theme'));
  const sync = () => {
    const dark = html.dataset.theme === 'dark', red = html.classList.contains('red-mode');
    document.querySelectorAll('.theme-btn').forEach((b) => { b.setAttribute('aria-pressed', String(dark)); b.setAttribute('aria-label', dark ? 'Light mode' : 'Dark mode'); });
    document.querySelectorAll('.red-btn').forEach((b) => { b.setAttribute('aria-pressed', String(red)); b.setAttribute('aria-label', red ? 'Turn off red light' : 'Red light for night use'); });
  };
  document.querySelectorAll('.theme-btn').forEach((b) => b.addEventListener('click', () => {
    const dark = html.dataset.theme !== 'dark';
    if (dark) html.dataset.theme = 'dark'; else delete html.dataset.theme;
    try { dark ? localStorage.setItem('fibub-theme', 'dark') : localStorage.removeItem('fibub-theme'); } catch {}
    sync(); fire();
  }));
  document.querySelectorAll('.red-btn').forEach((b) => b.addEventListener('click', () => {
    const on = !html.classList.contains('red-mode');
    html.classList.toggle('red-mode', on);
    try { on ? sessionStorage.setItem('fibub-red-light', '1') : sessionStorage.removeItem('fibub-red-light'); } catch {}
    sync(); fire();
  }));
  sync();
}

// Two-level header menu (Science): pointing at or focusing a subject shows its sections and tools.
for (const panel of document.querySelectorAll<HTMLElement>('.dd-mega')) {
  const subs = [...panel.querySelectorAll<HTMLButtonElement>('.dd-subj')], panes = [...panel.querySelectorAll<HTMLElement>('.dd-pane')];
  const show = (i: number) => { subs.forEach((b, j) => b.setAttribute('aria-expanded', String(i === j))); panes.forEach((p, j) => p.classList.toggle('on', i === j)); };
  subs.forEach((b, i) => { b.addEventListener('mouseenter', () => show(i)); b.addEventListener('focus', () => show(i)); b.addEventListener('click', () => { show(i); panes[i].querySelector<HTMLElement>('a')?.focus(); }); });
  show(0);
}
