// Learn pages: "Continue where you left off" and the progress bars on course cards, read only from this
// browser's own course progress (src/scripts/course.ts keeps it: this tab by default, on this device
// when the learner ticks "Remember my progress"). Nothing is sent anywhere. Also opens a tab named in
// the address (#ncert, #canada ...) on pages with radio-button tabs.
type Prog = { done?: Record<string, string>; last?: [string, string, string?] };

function read(id: string): Prog | null {
  const key = `fibub-course-${id}-v1`;
  for (const s of [() => localStorage, () => sessionStorage]) {
    try { const v = s().getItem(key); if (v) return JSON.parse(v); } catch { /* blocked */ }
  }
  return null;
}

const cards = [...document.querySelectorAll<HTMLElement>('.lc[data-course]')];
const seen = new Set<string>();
const items: { name: string; href: string; label: string; n: number; total: number; date: string }[] = [];
for (const card of cards) {
  const id = card.dataset.course!, total = Number(card.dataset.total || 0);
  const p = read(id); if (!p) continue;
  const n = Object.keys(p.done ?? {}).length;
  const bar = card.querySelector<HTMLElement>('.lc-p');
  if (bar && total && n) { bar.hidden = false; requestAnimationFrame(() => { (bar.firstElementChild as HTMLElement).style.width = `${Math.min(100, (100 * n) / total)}%`; }); }
  if (seen.has(id) || (!n && !p.last)) continue;
  seen.add(id);
  const href = (card as HTMLAnchorElement).getAttribute('href') || `/learn/courses/${id}/`;
  items.push({ name: card.dataset.name || id, href: p.last ? `${href}${p.last[0]}/` : href, label: p.last ? p.last[1] : 'Course home', n, total, date: p.last?.[2] ?? Object.values(p.done ?? {}).sort().pop() ?? '' });
}
const box = document.querySelector<HTMLElement>('[data-continue]');
if (box && items.length) {
  items.sort((a, b) => b.date.localeCompare(a.date));
  const ul = box.querySelector('ul')!;
  for (const it of items.slice(0, 3)) {
    const li = document.createElement('li'), a = document.createElement('a');
    a.href = it.href;
    const t = document.createElement('span'); t.textContent = `${it.name}: ${it.label} →`;
    const s = document.createElement('small'); s.textContent = it.total ? `${it.n} of ${it.total} lessons done` : '';
    a.append(t, s); li.append(a); ul.append(li);
  }
  box.hidden = false;
}

// Radio tabs: #<id> in the address picks the tab with value <id>.
const pick = () => {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  // A tab's own value (#india), or anything inside a tab's panel (#kerala opens the India tab).
  const panel = document.getElementById(id)?.closest<HTMLElement>('[data-panel]')?.dataset.panel;
  const r = document.querySelector<HTMLInputElement>(`.lh-tabs input[value="${CSS.escape(id)}"]`) ?? (panel ? document.querySelector<HTMLInputElement>(`.lh-tabs input[value="${CSS.escape(panel)}"]`) : null);
  if (r) { r.checked = true; (panel && panel !== id ? document.getElementById(id) : r.closest('.lh-tabs'))?.scrollIntoView({ block: 'nearest' }); }
};
pick();
addEventListener('hashchange', pick);
document.querySelectorAll<HTMLInputElement>('.lh-tabs input').forEach((r) => r.addEventListener('change', () => { if (r.checked && r.dataset.hash !== undefined) history.replaceState(null, '', `#${r.value}`); }));
