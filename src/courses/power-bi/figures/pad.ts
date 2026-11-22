// Client side of the DAX practice editor (DaxPad.astro). The engine and the Northbay data load the first time
// a learner touches an editor, so lesson pages stay light. Nothing typed is sent or stored.
import type { RunResult, Val, Col, ModelSpec } from '../../../lib/dax/engine';
import { mountPlayer } from './player';

let lib: Promise<{ run: typeof import('../../../lib/dax/engine').run; Model: typeof import('../../../lib/dax/engine').Model; fmtVal: (v: Val) => string; spec: ModelSpec }> | null = null;
const load = () => (lib ??= Promise.all([import('../../../lib/dax/engine'), import('../../../lib/dax/northbay')]).then(([e, n]) => ({ run: e.run, Model: e.Model, fmtVal: e.fmtVal, spec: n.northbayModel() })));

/** "Product[Category]" or "'Date'[Year]" to a column. */
function parseCol(s: string): Col | null {
  const m = /^'?([^'[]+)'?\[([^\]]+)\]$/.exec(s.trim());
  return m ? { table: m[1], name: m[2] } : null;
}
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as Record<string, string>)[c]);
const same = (a: Val, b: Val) => {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= 0.005 + 1e-6 * Math.abs(b);
  return (a ?? null) === (b ?? null) || String(a).toLowerCase() === String(b).toLowerCase();
};

export function mountPad(fig: HTMLElement) {
  const ex = JSON.parse(fig.dataset.ex || '{}') as { id: string; solution: string; append: string; ordered: boolean; slicers: { col: string; values: Val[] }[] };
  const ed = fig.querySelector<HTMLTextAreaElement>('[data-ed]')!, out = fig.querySelector<HTMLElement>('[data-out]')!;
  const bySel = fig.querySelector<HTMLSelectElement>('[data-by]')!, traceBtn = fig.querySelector<HTMLButtonElement>('[data-trace]')!;
  const player = fig.querySelector<HTMLElement>('[data-player]')!;
  const starter = ed.value;
  let last: RunResult | null = null, sel = -1;

  fig.addEventListener('pointerenter', () => void load(), { once: true });
  ed.addEventListener('focus', () => void load(), { once: true });
  ed.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); go(); }
    else if (e.key === 'Tab' && !e.shiftKey && !e.altKey) {
      // Tab indents (Esc first, then Tab, leaves the box, as in most code editors).
      if (ed.dataset.esc === '1') { ed.dataset.esc = ''; return; }
      e.preventDefault(); const s = ed.selectionStart; ed.setRangeText('    ', s, ed.selectionEnd, 'end');
    } else if (e.key === 'Escape') ed.dataset.esc = '1';
  });
  const opts = (traceRow?: number) => {
    const by = parseCol(bySel.value);
    return { by: by ? [by] : [], traceRow, slicers: ex.slicers.map((s) => ({ col: parseCol(s.col)!, values: s.values })) };
  };
  async function exec(code: string, traceRow?: number) {
    const L = await load();
    return L.run(new L.Model(L.spec), code, opts(traceRow));
  }
  async function go() {
    out.innerHTML = '<p class="pbi-wait">Running…</p>';
    player.hidden = true; sel = -1;
    const t0 = performance.now();
    last = await exec(ed.value);
    render(last, performance.now() - t0);
  }
  async function render(r: RunResult, ms: number) {
    const { fmtVal } = await load();
    traceBtn.hidden = true;
    if (r.error) { out.innerHTML = `<p class="pbi-err"><strong>Error:</strong> ${esc(r.error)}</p>`; return; }
    const notes: string[] = [];
    if (r.columns.length) notes.push(`Added calculated column${r.columns.length > 1 ? 's' : ''} ${r.columns.map(esc).join(', ')}.`);
    let html = '';
    if (r.query) {
      const n = r.query.rows.length;
      html = `<div class="pbi-tablewrap"><table class="pbi-res"><thead><tr>${r.query.cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${r.query.rows.slice(0, 100).map((row) => `<tr>${row.map((v) => `<td class="${typeof v === 'number' ? 'n' : ''}">${esc(fmtVal(v))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      notes.push(`${n.toLocaleString('en')} row${n === 1 ? '' : 's'}${n > 100 ? ' (first 100 shown)' : ''}.`);
      traceBtn.hidden = false;
    } else if (r.visual) {
      const v = r.visual, head = [...v.by.map((c) => `${c.table}[${c.name}]`), ...r.measures];
      const body = v.rows.slice(0, 60).map((row, i) => `<tr data-row="${i}" tabindex="0">${row.label.map((x) => `<th scope="row">${esc(fmtVal(x))}</th>`).join('')}${row.values.map((x) => `<td class="n">${esc(fmtVal(x))}</td>`).join('')}</tr>`).join('');
      const total = v.by.length ? `<tr class="pbi-total" data-row="-1" tabindex="0"><th scope="row" colspan="${v.by.length}">Total</th>${v.total.map((x) => `<td class="n">${esc(fmtVal(x))}</td>`).join('')}</tr>` : `<tr class="pbi-total" data-row="-1" tabindex="0">${v.total.map((x) => `<td class="n big">${esc(fmtVal(x))}</td>`).join('')}</tr>`;
      html = `<div class="pbi-tablewrap"><table class="pbi-res"><thead><tr>${head.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${body}${total}</tbody></table></div>`;
      if (v.rows.length > 60) notes.push(`${v.rows.length} rows (first 60 shown).`);
      traceBtn.hidden = false;
      notes.push(v.by.length ? 'Click a row, then "Show me what happened" to see how it was worked out.' : '');
    } else if (!r.columns.length) notes.push('Nothing to show yet: define a measure (Name = ...) or a query (EVALUATE ...).');
    notes.push(`<span class="pbi-ms">${Math.max(1, Math.round(ms))} ms</span>`);
    out.innerHTML = html + `<p class="pbi-note">${notes.filter(Boolean).join(' ')}</p>`;
    for (const tr of out.querySelectorAll<HTMLElement>('tr[data-row]')) {
      const pick = () => { out.querySelectorAll('tr.sel').forEach((x) => x.classList.remove('sel')); tr.classList.add('sel'); sel = +tr.dataset.row!; };
      tr.addEventListener('click', pick);
      tr.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    }
  }
  fig.querySelector('[data-run]')!.addEventListener('click', go);
  bySel.addEventListener('change', () => { if (last) go(); });
  traceBtn.addEventListener('click', async () => {
    const row = last?.visual ? (sel === -1 && last.visual.by.length && last.visual.rows.length ? 0 : sel) : 0;
    const r = await exec(ed.value, row);
    if (!r.trace || !r.trace.steps.length) { player.hidden = false; player.innerHTML = '<p class="pbi-note">This result has no steps to show: it doesn\'t read any table (try a measure with SUM, SUMX, COUNTROWS or CALCULATE).</p>'; return; }
    player.hidden = false;
    mountPlayer(player, r.trace);
    player.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
  fig.querySelector('[data-check]')?.addEventListener('click', async () => {
    const mine = await exec(ed.value + (ex.append ? '\n' + ex.append : ''));
    const want = await exec(ex.solution + (ex.append ? '\n' + ex.append : ''));
    last = await exec(ed.value);
    await render(last, 0);
    const box = document.createElement('p');
    const verdict = (ok: boolean, msg: string) => { box.className = ok ? 'pbi-ok' : 'pbi-no'; box.innerHTML = msg; out.prepend(box); };
    if (mine.error) return verdict(false, 'Not yet: fix the error first.');
    if (want.query) {
      if (!mine.query) return verdict(false, 'Not yet: this task wants a query that starts with EVALUATE.');
      const key = (rows: Val[][]) => rows.map((r) => r.map((v) => (typeof v === 'number' ? v.toFixed(2) : String(v ?? ''))).join('|'));
      const a = key(mine.query.rows), b = key(want.query.rows);
      if (!ex.ordered) { a.sort(); b.sort(); }
      if (a.length !== b.length) return verdict(false, `Not yet: your query gives ${a.length} rows; the answer has ${b.length}.`);
      const bad = a.findIndex((x, i) => x !== b[i]);
      return bad < 0 ? verdict(true, '<strong>Correct.</strong> Your query gives the same table as the answer.') : verdict(false, `Not yet: row ${bad + 1} differs. ${ex.ordered ? 'Check the sort order too.' : ''}`);
    }
    if (!mine.visual || !want.visual) return verdict(false, 'Not yet: define a measure (Name = ...).');
    const pickLast = (r: RunResult) => r.measures.length - 1;
    const a = mine.visual, b = want.visual, ia = pickLast(mine), ib = pickLast(want);
    if (!same(a.total[ia], b.total[ib])) return verdict(false, `Not yet: your last measure gives ${esc(String(a.total[ia] ?? '(blank)'))} for the total; the answer gives ${esc(String(b.total[ib] ?? '(blank)'))}.`);
    const mapA = new Map(a.rows.map((r) => [JSON.stringify(r.label), r.values[ia]]));
    for (const r of b.rows) if (!same(mapA.get(JSON.stringify(r.label)) ?? null, r.values[ib])) return verdict(false, `Not yet: the total matches, but the row ${esc(r.label.join(', '))} doesn't. Try the other "Split by" columns to find where it differs.`);
    verdict(true, `<strong>Correct.</strong> Your measure matches the answer${b.by.length ? ' on every row and the total' : ''}.${b.by.length ? '' : ' Try "Split by" a column to see it per row.'}`);
  });
  fig.querySelector('[data-hint]')?.addEventListener('click', () => { const h = fig.querySelector<HTMLElement>('[data-hint-text]')!; h.hidden = !h.hidden; });
  fig.querySelector('[data-answer]')?.addEventListener('click', () => { const s = fig.querySelector<HTMLElement>('[data-sol]')!; s.hidden = !s.hidden; });
  fig.querySelector('[data-reset]')!.addEventListener('click', () => { ed.value = starter; out.innerHTML = '<p class="pbi-wait">Press Run to see the result.</p>'; player.hidden = true; last = null; });
}
