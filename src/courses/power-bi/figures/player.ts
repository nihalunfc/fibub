// "Show me what happened": steps through a DAX trace (format: src/lib/dax/trace.ts, shared with the SQL
// course's table player) with Back / Next, drawing the small tables with kept rows highlighted and dropped
// rows faded. Handles the step kinds the DAX engine records: filter, propagate, aggregate, iterate.
import type { Trace, Step, VTable, Cell } from '../../../lib/dax/trace';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as Record<string, string>)[c]);
const cell = (v: Cell) => (v === null ? '<span class="pbi-blank">(blank)</span>' : esc(typeof v === 'number' ? (Math.abs(v) >= 1000 ? v.toLocaleString('en', { maximumFractionDigits: 2 }) : String(+v.toFixed(2))) : String(v)));

function table(t: VTable, opts: { keep?: boolean[]; hiCol?: string[]; extra?: { head: string; vals: Cell[] }; foot?: string } = {}) {
  const hi = new Set(opts.hiCol ?? []);
  const head = t.cols.map((c) => `<th class="${hi.has(c) ? 'hi' : ''}">${esc(c)}</th>`).join('') + (opts.extra ? `<th class="hi">${esc(opts.extra.head)}</th>` : '');
  const body = t.rows.map((r, i) => {
    const k = opts.keep ? (opts.keep[i] ? 'keep' : 'drop') : '';
    return `<tr class="${k}">${r.map((v, j) => `<td class="${hi.has(t.cols[j]) ? 'hi' : ''}">${cell(v)}</td>`).join('')}${opts.extra ? `<td class="hi">${cell(opts.extra.vals[i] ?? null)}</td>` : ''}</tr>`;
  }).join('');
  return `<div class="pbi-tv"><p class="pbi-tvname">${esc(t.name)}</p><div class="pbi-tablewrap"><table class="pbi-mini"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>${opts.foot ? `<p class="pbi-tvfoot">${opts.foot}</p>` : ''}</div>`;
}

function drawStep(s: Step): string {
  const k = s.kind;
  if (k === 'propagate') {
    const on = s.on as [string, string];
    return `<div class="pbi-two">${table(s.from as VTable, { keep: s.fromKeep as boolean[], hiCol: [on[0]] })}<div class="pbi-arrow" aria-hidden="true">→<span>${esc(on[0])} = ${esc(on[1])}</span></div>${table(s.to as VTable, { keep: s.toKeep as boolean[], hiCol: [on[1]], foot: 'A sample of rows: highlighted ones are kept, faded ones are filtered out.' })}</div>`;
  }
  if (k === 'filter') return table(s.input as VTable, { keep: s.keep as boolean[], foot: 'Highlighted rows are kept, faded rows are filtered out (a sample is shown).' });
  if (k === 'aggregate') {
    const m = (s.measures as { col: string; fn: string; arg?: string }[])[0];
    const out = s.output as VTable;
    return `<div class="pbi-two">${table(s.input as VTable, { hiCol: m.arg ? [m.arg] : [] })}<div class="pbi-arrow" aria-hidden="true">→<span>${esc(m.fn)}</span></div><div class="pbi-result"><p class="pbi-tvname">${esc(out.cols[0])}</p><b>${cell(out.rows[0][0])}</b></div></div>`;
  }
  if (k === 'iterate') {
    return `<div class="pbi-two">${table(s.input as VTable, { extra: { head: `= ${s.expr as string}`, vals: s.values as Cell[] }, foot: 'First rows shown. The new column is worked out for every row (row context).' })}<div class="pbi-arrow" aria-hidden="true">→<span>${esc((s.fn as string) ?? '')}</span></div><div class="pbi-result"><p class="pbi-tvname">Result</p><b>${cell(s.result as Cell)}</b></div></div>`;
  }
  if (k === 'source' || k === 'result') return table(s.table as VTable);
  return '';
}

export function mountPlayer(el: HTMLElement, trace: Trace) {
  let i = 0;
  const n = trace.steps.length;
  el.innerHTML = `<div class="pbi-play"><p class="pbi-playtitle">${esc(trace.title ?? 'What happened')}</p><div class="pbi-playnav"><button type="button" class="btn secondary" data-prev>← Back</button><span data-count></span><button type="button" class="btn" data-next>Next →</button></div><p class="pbi-stepnote" data-note aria-live="polite"></p><div data-stage></div></div>`;
  const note = el.querySelector<HTMLElement>('[data-note]')!, stage = el.querySelector<HTMLElement>('[data-stage]')!;
  const prev = el.querySelector<HTMLButtonElement>('[data-prev]')!, next = el.querySelector<HTMLButtonElement>('[data-next]')!;
  const show = () => {
    const s = trace.steps[i];
    note.textContent = s.note;
    stage.innerHTML = drawStep(s);
    el.querySelector('[data-count]')!.textContent = `Step ${i + 1} of ${n}`;
    prev.disabled = i === 0; next.disabled = i === n - 1;
  };
  prev.addEventListener('click', () => { if (i > 0) { i--; show(); } });
  next.addEventListener('click', () => { if (i < n - 1) { i++; show(); } });
  show();
}
