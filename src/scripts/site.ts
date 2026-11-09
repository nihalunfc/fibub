// Runs on every page: the tool list (☰ Tools) and "My tools", the list of tools a person has
// bookmarked. My tools is kept only in this browser (localStorage) and can be cleared from the list.
import { loadIndex, rank, row, type Entry } from './find';
const KEY = 'fibub-mytools-v1';

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

// Stars next to tools (home and subject pages): add or remove the tool from My tools.
document.addEventListener('click', (e) => {
  const p = (e.target as HTMLElement).closest<HTMLElement>('.pin'); if (!p) return;
  const id = p.closest<HTMLElement>('[data-id]')?.dataset.id; if (id) togglePin(id);
});
const syncStars = () => {
  const ids = myTools();
  document.querySelectorAll<HTMLButtonElement>('.ti[data-id] > .pin').forEach((p) => {
    const li = p.parentElement!, on = ids.includes(li.dataset.id!), name = li.querySelector('.nm')?.textContent ?? 'this tool';
    p.setAttribute('aria-pressed', String(on));
    p.setAttribute('aria-label', on ? `Remove ${name} from My tools` : `Add ${name} to My tools`);
    p.title = on ? 'Remove from My tools' : 'Add to My tools';
  });
};
syncStars();
document.addEventListener('fibub:mytools', syncStars);

/** The starred tools, in the order they were added, as index entries. */
export async function myEntries(): Promise<Entry[]> {
  const ids = myTools(); if (!ids.length) return [];
  const all = await loadIndex();
  return ids.map((id) => all.find((e) => e.id === id)).filter((e): e is Entry => !!e);
}

// The menu panel (Menu tab in the bottom bar, or the search button in the header): search every tool,
// My tools, then Learn, Tools (shelves, Science opens to its subjects), News and About, all folded.
const btn = document.querySelector<HTMLButtonElement>('.tab-menu');
const panel = document.querySelector<HTMLElement>('#all-tools');

if (btn && panel) {
  const search = panel.querySelector<HTMLInputElement>('.at-search')!;
  const results = panel.querySelector<HTMLElement>('.at-results')!;
  const browse = panel.querySelector<HTMLElement>('.at-browse')!;
  const mine = panel.querySelector<HTMLElement>('.at-mine')!;
  const mineList = panel.querySelector<HTMLElement>('.at-mine-list')!;
  const empty = panel.querySelector<HTMLElement>('.at-empty')!;
  const focusBtn = panel.querySelector<HTMLButtonElement>('.at-focus')!;
  const total = Number(panel.dataset.total);
  let hits: Entry[] = [];

  const open = (show: boolean) => {
    panel.hidden = !show;
    document.querySelectorAll('.tab-menu, .find-btn').forEach((b) => b.setAttribute('aria-expanded', String(show)));
    document.querySelector('.tabbar')?.classList.toggle('menu-open', show);
    if (show) { loadIndex(); renderMine(); }
  };
  btn.addEventListener('click', () => open(panel.hidden));
  document.querySelector('.find-btn')?.addEventListener('click', () => { open(panel.hidden); if (!panel.hidden) search.focus(); });
  panel.querySelector('.at-close')!.addEventListener('click', () => { open(false); btn.focus(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) { open(false); btn.focus(); }
    // Ctrl+K or / opens the list with the search box ready.
    const typing = (e.target as HTMLElement)?.closest?.('input, textarea, select, [contenteditable]');
    if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) {
      e.preventDefault(); open(true); search.focus();
    }
  });

  const searching = () => search.value.trim() !== '';
  async function find() {
    const q = search.value;
    hits = searching() ? rank(await loadIndex(), q) : [];
    if (q !== search.value) return; // a newer keystroke is on its way
    results.replaceChildren(...hits.slice(0, 40).map((e) => row(e, { place: true })));
    results.hidden = !searching();
    empty.hidden = !searching() || hits.length > 0;
    browse.hidden = searching() || (focusOn() && myTools().length > 0);
    renderMine();
  }
  search.addEventListener('input', find);
  search.addEventListener('keydown', (e) => { if (e.key === 'Enter' && hits[0]) location.href = hits[0].u; });

  async function renderMine() {
    const list = await myEntries();
    mineList.replaceChildren(...list.map((e) => row(e, { place: true })));
    mine.hidden = !list.length || searching();
    const f = focusOn() && !searching();
    browse.hidden = searching() || f;
    focusBtn.textContent = f ? `Show all ${total} tools` : 'Show only my tools';
  }
  focusBtn.addEventListener('click', () => setFocus(!focusOn()));
  document.addEventListener('fibub:focus', renderMine);
  panel.querySelector('.at-clear')!.addEventListener('click', () => { setMyTools([]); setFocus(false); });
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

// The section bar above the bottom bar: bring the current section into view when the sections don't
// all fit, and on computers start them from the left then.
const subIn = document.querySelector<HTMLElement>('.tb-sub-in');
if (subIn) {
  const fit = () => {
    subIn.classList.remove('wide');
    const over = subIn.scrollWidth > subIn.clientWidth + 1;
    subIn.classList.toggle('wide', over);
    const on = subIn.querySelector<HTMLElement>('a.on');
    if (over && on) subIn.scrollLeft = Math.max(0, on.offsetLeft - (subIn.clientWidth - on.offsetWidth) / 2);
  };
  fit();
  addEventListener('resize', fit);
}

// On touch screens the bars step aside while typing, so the on-screen keyboard has room.
if (matchMedia('(hover: none) and (pointer: coarse)').matches) {
  const typing = (el: EventTarget | null) => el instanceof HTMLElement && (el.matches('textarea, select, [contenteditable], input:not([type=checkbox], [type=radio], [type=button], [type=submit], [type=range], [type=color], [type=file])'));
  document.addEventListener('focusin', (e) => document.documentElement.classList.toggle('typing', typing(e.target)));
  document.addEventListener('focusout', () => setTimeout(() => document.documentElement.classList.toggle('typing', typing(document.activeElement)), 0));
}
