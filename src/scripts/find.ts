// Site-wide tool search. The list of every live tool is one small file (/tools.json), loaded the
// first time someone searches or has starred tools, and kept for the rest of the visit.
export type Entry = { id: string; n: string; s: string; k?: number; u: string; p: string; x?: string }; // x: the English summary, so English words still find tools

import { prefix, tr } from './i18n';
export type { Entry as IndexEntry };

let index: Promise<Entry[]> | null = null;
// Each language has its own index (/ml/tools.json) with summaries in that language and links that stay in it.
export function loadIndex(): Promise<Entry[]> {
  index ??= fetch(`${prefix}/tools.json`).then((r) => (r.ok ? r.json() : [])).catch(() => { index = null; return []; });
  return index;
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export const words = (q: string) => norm(q).split(/[\s,]+/).filter(Boolean);

/**
 * Tools that match every word, best first. "#3" finds tool number 3 only; a bare number finds that
 * tool first, then any tool with the number in its text. Name matches rank above summary matches.
 */
export function rank(list: Entry[], q: string): Entry[] {
  const ws = words(q);
  if (!ws.length) return [];
  const out: { e: Entry; score: number }[] = [];
  for (const e of list) {
    const name = norm(e.n), hay = `${name} ${norm(e.s)} ${norm(e.p)} ${e.x ? norm(e.x) : ''}`;
    let score = 0, ok = true;
    for (const w of ws) {
      if (/^#\d+$/.test(w)) { if (String(e.k) === w.slice(1)) score += 100; else { ok = false; break; } continue; }
      if (/^\d+$/.test(w) && String(e.k) === w) { score += 50; continue; }
      const at = name.indexOf(w);
      if (at === 0) score += 6;
      else if (at > 0) score += name[at - 1] === ' ' ? 4 : 2;
      else if (hay.includes(w)) score += 1;
      else { ok = false; break; }
    }
    if (ok) out.push({ e, score });
  }
  return out.sort((a, b) => b.score - a.score || (a.e.k ?? 1e9) - (b.e.k ?? 1e9)).map((x) => x.e);
}

const STAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/></svg>';

/** One tool row, the same markup as the server-rendered rows: name, where it sits, #number, star. */
export function row(e: Entry, opts: { star?: boolean; pinned?: boolean; place?: boolean } = {}) {
  const li = document.createElement('li');
  li.className = 'ti'; li.dataset.id = e.id; if (e.k) li.dataset.num = String(e.k);
  const a = document.createElement('a'); a.href = e.u;
  const nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = e.n;
  const sm = document.createElement('span'); sm.className = 'sm'; sm.textContent = opts.place ? e.p : e.s;
  a.append(nm, sm);
  const num = document.createElement('span'); num.className = 'num'; num.textContent = e.k ? `#${e.k}` : '';
  li.append(a, num);
  if (opts.star) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'pin'; b.innerHTML = STAR;
    b.setAttribute('aria-pressed', String(!!opts.pinned));
    b.setAttribute('aria-label', tr(opts.pinned ? 'removeMine' : 'addMine', { name: e.n }));
    b.title = tr(opts.pinned ? 'removeMineShort' : 'addMineShort');
    li.append(b);
  }
  return li;
}
