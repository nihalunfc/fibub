// Runs on every page: the tool list (☰ Tools) and "My tools", the list of tools a person has
// bookmarked. My tools is kept only in this browser (localStorage) and can be cleared from the list.
const KEY = 'fibub-mytools-v1';

export function myTools(): string[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []; }
  catch { return []; }
}
function setMyTools(ids: string[]) {
  try { ids.length ? localStorage.setItem(KEY, JSON.stringify(ids)) : localStorage.removeItem(KEY); } catch { /* storage blocked: nothing kept */ }
  document.dispatchEvent(new CustomEvent('fibub:mytools', { detail: ids }));
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
    for (const a of items) { const ok = words.every((w) => a.dataset.search!.includes(w)); a.hidden = !ok; if (ok) shown++; }
    panel.querySelectorAll<HTMLElement>('.at-group').forEach((g) => (g.hidden = !g.querySelector('.at-item:not([hidden])')));
    panel.querySelectorAll<HTMLElement>('.at-shelf').forEach((s) => (s.hidden = !s.querySelector('.at-item:not([hidden])')));
    mine.hidden = words.length > 0 || !mineList.children.length;
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
  }
  panel.querySelector('.at-clear')!.addEventListener('click', () => { setMyTools([]); renderMine(); });
  document.addEventListener('fibub:mytools', renderMine);
}

// Bookmark button on tool pages. A website cannot add a browser bookmark by itself, so the button
// saves the tool to My tools and then offers the closest thing the device has: the share sheet on
// phones (it has "Add bookmark" and "Add to Home Screen"), or the keyboard shortcut on computers.
const bm = document.querySelector<HTMLElement>('.bm');
if (bm) {
  const id = bm.dataset.id!;
  const b = bm.querySelector<HTMLButtonElement>('.bm-btn')!;
  const label = b.querySelector('span')!;
  const tip = bm.querySelector<HTMLElement>('.bm-tip')!;
  const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const touch = matchMedia('(hover: none) and (pointer: coarse)').matches;
  const show = () => {
    const on = myTools().includes(id);
    b.setAttribute('aria-pressed', String(on));
    label.textContent = on ? 'In My tools' : 'Bookmark this tool';
  };
  show();
  document.addEventListener('fibub:mytools', show);
  b.addEventListener('click', async () => {
    const ids = myTools();
    if (ids.includes(id)) {
      setMyTools(ids.filter((x) => x !== id));
      tip.textContent = 'Removed from My tools.';
      return;
    }
    setMyTools([id, ...ids]);
    if (touch && navigator.share) {
      tip.textContent = 'Added to My tools (in the ☰ Tools list). Choose "Add bookmark" or "Add to Home Screen" to open it in one tap.';
      try { await navigator.share({ title: document.title, url: location.href }); } catch { /* closed the share sheet */ }
    } else if (touch) {
      tip.textContent = 'Added to My tools (in the ☰ Tools list). To open it in one tap, use your browser menu: "Add bookmark" or "Add to Home Screen".';
    } else {
      tip.innerHTML = '';
      tip.append('Added to My tools. To keep it in your browser too, press ');
      const k = document.createElement('kbd'); k.textContent = mac ? '⌘ D' : 'Ctrl D';
      tip.append(k, '.');
    }
  });
}
