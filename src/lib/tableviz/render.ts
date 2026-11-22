// Draws a Trace (./types.ts) as a step-by-step animation: chips for the steps, a plain note, the tables,
// and Back / Play / Next. Each step has a few "ticks" (one matched pair, one row tested, one group summed ...)
// so learners see the work happen. Styles: src/styles/tableviz.css. No library, no innerHTML with data.
import type { Cell, Step, Trace, VTable } from './types';

export type TraceOptions = { maxRows?: number; speed?: number };
type Drawn = { ticks: number; show: (t: number) => void };

const LABEL: Record<Step['kind'], string> = {
  source: 'Start', result: 'Result', filter: 'Filter', join: 'Join', propagate: 'Filter flows', group: 'Group',
  aggregate: 'Aggregate', iterate: 'Row by row', sort: 'Sort', limit: 'Limit', project: 'Columns', split: 'Split',
  window: 'Window', union: 'Combine', reshape: 'Reshape',
};
const NGROUP = 8;
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
  const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e;
};
export const fmt = (v: Cell) => (v == null ? 'NULL' : typeof v === 'number' ? (Number.isInteger(v) ? String(v) : String(Math.round(v * 1000) / 1000)) : v);
const reduce = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const g = (n: number) => `tv-g${((n % NGROUP) + NGROUP) % NGROUP}`;

/** One table as a small card: name, row count, header and up to max rows. Returns the row elements by index. */
function table(t: VTable, max: number, opts: { cols?: string[]; extra?: string; hideRows?: boolean } = {}) {
  const box = el('div', 'tv-t');
  const cap = el('div', 'tv-cap'); cap.append(el('strong', '', t.name), el('span', 'tv-n', `${t.rows.length} row${t.rows.length === 1 ? '' : 's'}`));
  box.append(cap);
  const wrap = el('div', 'tv-scroll'); const tb = el('table'); const head = tb.createTHead().insertRow();
  const cols = [...t.cols, ...(opts.extra ? [opts.extra] : [])];
  const ths = cols.map((c) => { const th = el('th', '', c); head.append(th); return th; });
  if (opts.extra) ths[ths.length - 1].classList.add('tv-new');
  const body = tb.createTBody(); const rows: HTMLTableRowElement[] = [];
  t.rows.slice(0, max).forEach((r) => {
    const tr = body.insertRow();
    r.forEach((v) => { const td = tr.insertCell(); td.textContent = fmt(v); if (v == null) td.className = 'tv-null'; else if (typeof v === 'number') td.className = 'tv-num'; });
    if (opts.extra) { const td = tr.insertCell(); td.className = 'tv-new'; }
    if (opts.hideRows) tr.classList.add('tv-hid');
    rows.push(tr);
  });
  wrap.append(tb); box.append(wrap);
  if (t.rows.length > max) box.append(el('div', 'tv-more', `… ${t.rows.length - max} more row${t.rows.length - max === 1 ? '' : 's'} not drawn`));
  return { box, rows, ths, body };
}
const arrow = (txt?: string) => (txt ? el('div', 'tv-arrow', txt) : el('div', 'tv-arrow tv-plain', '→'));
const row = (...kids: HTMLElement[]) => { const d = el('div', 'tv-row'); d.append(...kids); return d; };
const colIndex = (t: VTable, name: string) => {
  let i = t.cols.indexOf(name); if (i >= 0) return i;
  const bare = name.replace(/^.*\./, '').replace(/^["`[]|["`\]]$/g, '').toLowerCase();
  i = t.cols.findIndex((c) => c.toLowerCase() === bare || c.toLowerCase().endsWith('.' + bare)); return i;
};
const tag = (tr: HTMLElement | undefined, ...cls: string[]) => tr?.classList.add(...cls);
const clear = (trs: HTMLElement[], ...cls: string[]) => trs.forEach((tr) => tr.classList.remove(...cls));
const groupCls = Array.from({ length: NGROUP }, (_, i) => `tv-g${i}`);

/** Slide rows from where they were to where they are now (FLIP), so a sort or a grouping is seen moving. */
function flip(rows: HTMLElement[], before: Map<HTMLElement, number>) {
  if (reduce()) return;
  for (const r of rows) {
    const was = before.get(r); if (was == null) continue;
    const dy = was - r.getBoundingClientRect().top; if (!dy) continue;
    r.style.transition = 'none'; r.style.transform = `translateY(${dy}px)`;
    requestAnimationFrame(() => requestAnimationFrame(() => { r.style.transition = ''; r.style.transform = ''; }));
  }
}
function reorder(body: HTMLTableSectionElement, rows: HTMLTableRowElement[], order: number[]) {
  const before = new Map(rows.map((r) => [r as HTMLElement, r.getBoundingClientRect().top]));
  for (const i of order) if (rows[i]) body.append(rows[i]);
  flip(rows, before);
}

function draw(stage: HTMLElement, s: Step, max: number, sub: HTMLElement): Drawn {
  const say = (t: string) => { sub.textContent = t; };
  switch (s.kind) {
    case 'source': case 'result': {
      const T = table(s.table, max); if (s.kind === 'result') T.box.classList.add('tv-out');
      stage.append(T.box); return { ticks: 0, show: () => {} };
    }
    case 'filter': {
      const A = table(s.input, max), kept: VTable = { name: 'kept', cols: s.input.cols, rows: s.input.rows.filter((_, i) => s.keep[i]) };
      const B = table(kept, max); B.box.classList.add('tv-out', 'tv-later');
      stage.append(row(A.box, arrow(), B.box));
      const n = A.rows.length;
      return { ticks: n + 1, show: (t) => {
        clear(A.rows, 'tv-keep', 'tv-drop', 'tv-cur');
        for (let i = 0; i < Math.min(t, n); i++) tag(A.rows[i], s.keep[i] ? 'tv-keep' : 'tv-drop');
        if (t >= 1 && t <= n) { tag(A.rows[t - 1], 'tv-cur'); say(`Row ${t}: ${s.keep[t - 1] ? 'passes, kept' : 'fails, dropped'}${s.why?.[t - 1] ? ` (${s.why[t - 1]})` : ''}.`); }
        else if (t > n) say(`${kept.rows.length} of ${s.input.rows.length} rows kept.`); else say('');
        B.box.classList.toggle('tv-later', t <= n);
      } };
    }
    case 'join': {
      const L = table(s.left, max), R = table(s.right, max);
      const O = table(s.output, max, { hideRows: true }); O.box.classList.add('tv-out');
      const key = (t: VTable, cols: string[], rows: HTMLTableRowElement[], ths: HTMLElement[]) => cols.forEach((c) => {
        const j = colIndex(t, c); if (j < 0) return; ths[j]?.classList.add('tv-key'); rows.forEach((r) => r.cells[j]?.classList.add('tv-key'));
      });
      key(s.left, s.on.map((p) => p[0]), L.rows, L.ths); key(s.right, s.on.map((p) => p[1]), R.rows, R.ths);
      const pair = el('div', 'tv-pair'); pair.append(L.box, el('div', 'tv-plus', s.how === 'cross' ? '×' : '⋈'), R.box);
      stage.append(row(pair, arrow(), O.box));
      const n = Math.min(s.pairs.length, max);
      const leftHit = new Set(s.pairs.map((p) => p[0]).filter((x) => x != null)), rightHit = new Set(s.pairs.map((p) => p[1]).filter((x) => x != null));
      return { ticks: n + 1, show: (t) => {
        clear([...L.rows, ...R.rows], ...groupCls, 'tv-cur', 'tv-drop', 'tv-miss');
        O.rows.forEach((r, k) => { r.classList.toggle('tv-hid', k >= t); r.classList.remove(...groupCls, 'tv-cur'); });
        for (let k = 0; k < Math.min(t, n); k++) {
          const [a, b] = s.pairs[k]; const c = b != null ? g(b) : 'tv-g7';
          if (a != null) tag(L.rows[a], c); if (b != null) tag(R.rows[b], c); tag(O.rows[k], c);
        }
        if (t >= 1 && t <= n) {
          const [a, b] = s.pairs[t - 1];
          if (a != null) tag(L.rows[a], 'tv-cur'); if (b != null) tag(R.rows[b], 'tv-cur'); tag(O.rows[t - 1], 'tv-cur');
          say(a != null && b != null ? `Left row ${a + 1} matches right row ${b + 1}: one joined row.` : a != null ? `Left row ${a + 1} has no match, so the right side is filled with NULL.` : `Right row ${(b ?? 0) + 1} has no match, so the left side is filled with NULL.`);
        } else if (t > n) {
          if (s.how === 'inner' || s.how === 'right') L.rows.forEach((r, i) => { if (!leftHit.has(i)) r.classList.add('tv-miss'); });
          if (s.how === 'inner' || s.how === 'left') R.rows.forEach((r, i) => { if (!rightHit.has(i)) r.classList.add('tv-miss'); });
          const lost = s.how === 'inner' ? ` Rows with no partner (faded) are left out.` : '';
          say(`${s.pairs.length} joined row${s.pairs.length === 1 ? '' : 's'}.${lost}`);
        } else say('');
      } };
    }
    case 'propagate': {
      const A = table(s.from, max), B = table(s.to, max);
      const ja = colIndex(s.from, s.on[0]), jb = colIndex(s.to, s.on[1]);
      stage.append(row(A.box, arrow(`→ ${s.on[0]} = ${s.on[1]} →`), B.box));
      return { ticks: 3, show: (t) => {
        clear([...A.rows, ...B.rows], 'tv-keep', 'tv-drop'); [...A.rows, ...B.rows].forEach((r) => [...r.cells].forEach((c) => c.classList.remove('tv-key')));
        if (t >= 1) A.rows.forEach((r, i) => tag(r, s.fromKeep[i] ? 'tv-keep' : 'tv-drop'));
        if (t >= 2) { A.rows.forEach((r) => r.cells[ja]?.classList.add('tv-key')); B.rows.forEach((r) => r.cells[jb]?.classList.add('tv-key')); }
        if (t >= 3) B.rows.forEach((r, i) => tag(r, s.toKeep[i] ? 'tv-keep' : 'tv-drop'));
        say(['', `The filter keeps ${s.fromKeep.filter(Boolean).length} row(s) of ${s.from.name}.`, `It follows the relationship ${s.on[0]} → ${s.on[1]}.`, `So only ${s.toKeep.filter(Boolean).length} row(s) of ${s.to.name} still count.`][t]);
      } };
    }
    case 'group': {
      const A = table(s.input, max); s.by.forEach((c) => { const j = colIndex(s.input, c); if (j >= 0) A.ths[j]?.classList.add('tv-key'); });
      stage.append(A.box);
      const order = A.rows.map((_, i) => i).sort((a, b) => s.groupOf[a] - s.groupOf[b] || a - b);
      const ng = new Set(s.groupOf).size;
      return { ticks: 2, show: (t) => {
        clear(A.rows, ...groupCls);
        if (t >= 1) A.rows.forEach((r, i) => tag(r, g(s.groupOf[i])));
        reorder(A.body, A.rows, t >= 2 ? order : A.rows.map((_, i) => i));
        say(t === 0 ? '' : t === 1 ? `Each colour is one value of ${s.by.join(', ')}: ${ng} group${ng === 1 ? '' : 's'}.` : 'Rows with the same value are gathered together.');
      } };
    }
    case 'aggregate': {
      const order = s.input.rows.map((_, i) => i).sort((a, b) => s.groupOf[a] - s.groupOf[b] || a - b);
      const sorted: VTable = { ...s.input, rows: order.map((i) => s.input.rows[i]) };
      const A = table(sorted, max), O = table(s.output, max, { hideRows: true }); O.box.classList.add('tv-out');
      A.rows.forEach((r, k) => tag(r, g(s.groupOf[order[k]])));
      stage.append(row(A.box, arrow(), O.box));
      const n = Math.min(s.output.rows.length, max);
      const sums = (grp: number) => s.measures.map((m) => {
        const j = m.arg ? colIndex(s.input, m.arg) : -1; const vals = order.filter((i) => s.groupOf[i] === grp).map((i) => (j >= 0 ? s.input.rows[i][j] : null));
        const f = m.fn.toLowerCase(); const shown = vals.slice(0, 6).map(fmt).join(f === 'sum' || f === 'total' ? ' + ' : ', ') + (vals.length > 6 ? ' …' : '');
        if (f === 'count' && (!m.arg || m.arg === '*')) return `${m.col} counts ${vals.length} row${vals.length === 1 ? '' : 's'}`;
        return j >= 0 ? `${m.col} = ${m.fn.toUpperCase()}(${shown})` : `${m.col} worked out from ${vals.length} rows`;
      }).join('; ');
      return { ticks: n + 1, show: (t) => {
        clear(A.rows, 'tv-cur', 'tv-dim'); O.rows.forEach((r, k) => { r.classList.toggle('tv-hid', k >= t); r.classList.remove('tv-cur', ...groupCls); if (k < t) r.classList.add(g(k)); });
        if (t >= 1 && t <= n) {
          A.rows.forEach((r, k) => tag(r, s.groupOf[order[k]] === t - 1 ? 'tv-cur' : 'tv-dim')); tag(O.rows[t - 1], 'tv-cur');
          say(`Group ${t} becomes one row: ${sums(t - 1)}.`);
        } else say(t ? `${s.input.rows.length} rows became ${s.output.rows.length}: one per group.` : '');
      } };
    }
    case 'iterate': {
      const A = table(s.input, max, { extra: s.expr }); stage.append(A.box);
      const tot = el('div', 'tv-total'); stage.append(tot);
      const n = A.rows.length; const sum = (k: number) => s.values.slice(0, k).reduce<number>((a, v) => a + (typeof v === 'number' ? v : 0), 0);
      return { ticks: n + 1, show: (t) => {
        A.rows.forEach((r, i) => { const c = r.cells[r.cells.length - 1]; c.textContent = i < t ? fmt(s.values[i]) : ''; r.classList.toggle('tv-cur', i === t - 1); });
        tot.textContent = t > n ? `${(s.fn ?? 'Total').toUpperCase()} = ${fmt(s.result)}` : t ? `Running total so far: ${fmt(sum(t))}` : '';
        say(t >= 1 && t <= n ? `Row ${t}: ${s.expr} = ${fmt(s.values[t - 1])}.` : t > n ? 'Every row was worked out on its own, then the results were added up.' : '');
      } };
    }
    case 'sort': {
      const A = table(s.input, max); s.by.forEach((c) => { const j = colIndex(s.input, c.replace(/\s+(asc|desc)$/i, '')); if (j >= 0) A.ths[j]?.classList.add('tv-key'); });
      stage.append(A.box);
      const shown = s.order.filter((i) => i < A.rows.length);
      return { ticks: 1, show: (t) => {
        reorder(A.body, A.rows, t >= 1 ? shown : A.rows.map((_, i) => i));
        say(t ? `Sorted by ${s.by.join(', ')}.` : '');
      } };
    }
    case 'limit': {
      const A = table(s.input, max); stage.append(A.box); const off = s.offset ?? 0;
      return { ticks: 1, show: (t) => {
        A.rows.forEach((r, i) => { const inn = i >= off && i < off + s.n; r.classList.toggle('tv-keep', t >= 1 && inn); r.classList.toggle('tv-drop', t >= 1 && !inn); });
        say(t ? `Only ${s.n} row${s.n === 1 ? '' : 's'}${off ? ` after skipping ${off}` : ''} are kept.` : '');
      } };
    }
    case 'project': {
      const A = table(s.input, max), O = table(s.output, max); O.box.classList.add('tv-out', 'tv-later');
      stage.append(row(A.box, arrow(), O.box));
      const used = new Set(s.from.filter((x): x is string => !!x).map((c) => colIndex(s.input, c)));
      const calc = s.output.cols.filter((_, j) => s.from[j] == null);
      return { ticks: 2, show: (t) => {
        A.ths.forEach((th, j) => { th.classList.toggle('tv-key', t >= 1 && used.has(j)); th.classList.toggle('tv-fade', t >= 1 && !used.has(j)); });
        A.rows.forEach((r) => [...r.cells].forEach((c, j) => c.classList.toggle('tv-fade', t >= 1 && !used.has(j))));
        O.ths.forEach((th, j) => th.classList.toggle('tv-new', s.from[j] == null));
        O.box.classList.toggle('tv-later', t < 2);
        say(t === 1 ? `Columns used are marked; the rest are not shown.` : t === 2 ? (calc.length ? `New column${calc.length > 1 ? 's' : ''}: ${calc.map((c) => (s.exprs?.[c] ? `${c} = ${s.exprs[c]}` : c)).join('; ')}.` : 'The chosen columns, in the order asked for.') : '');
      } };
    }
    case 'split': {
      const A = table(s.input, max); const part = new Map<number, number>(); s.parts.forEach((p, k) => p.rows.forEach((i) => part.set(i, k)));
      const outs = s.parts.map((p, k) => { const T = table({ name: p.label, cols: s.input.cols, rows: p.rows.map((i) => s.input.rows[i]) }, max); T.box.classList.add('tv-out', 'tv-later'); T.rows.forEach((r) => tag(r, g(k))); return T; });
      const col = el('div', 'tv-stack'); col.append(...outs.map((o) => o.box)); stage.append(row(A.box, arrow(), col));
      return { ticks: s.parts.length + 1, show: (t) => {
        clear(A.rows, ...groupCls); if (t >= 1) A.rows.forEach((r, i) => { const k = part.get(i); if (k != null) tag(r, g(k)); });
        outs.forEach((o, k) => o.box.classList.toggle('tv-later', t < k + 2));
        say(t === 1 ? `Each colour is one part: ${s.parts.map((p) => p.label).join(', ')}.` : t >= 2 ? `${s.parts[t - 2].label}: ${s.parts[t - 2].rows.length} row(s).` : '');
      } };
    }
    case 'window': {
      const A = table(s.input, max, { extra: s.col }); stage.append(A.box);
      const n = Math.min(s.order.length, max * 2);
      return { ticks: n + 1, show: (t) => {
        A.rows.forEach((r) => { r.classList.remove('tv-cur', 'tv-frame', 'tv-dim', ...groupCls); });
        const done = new Set(s.order.slice(0, Math.min(t, n)));
        A.rows.forEach((r, i) => { r.cells[r.cells.length - 1].textContent = done.has(i) ? fmt(s.values[i]) : ''; tag(r, g(s.partitionOf[i])); });
        if (t >= 1 && t <= n) {
          const [a, b] = s.frames[t - 1]; const me = s.order[t - 1];
          A.rows.forEach((r, i) => { if (s.partitionOf[i] !== s.partitionOf[me]) r.classList.add('tv-dim'); });
          for (let k = a; k <= b; k++) tag(A.rows[s.order[k]], 'tv-frame');
          tag(A.rows[me], 'tv-cur');
          say(`Row ${me + 1}: looks at ${b - a + 1} row${b === a ? '' : 's'} in its window (outlined) and gets ${fmt(s.values[me])}. Rows are not merged.`);
        } else say(t ? `Every row keeps its place and gets its own ${s.col}.` : '');
      } };
    }
    case 'union': {
      const ins = s.inputs.map((t, k) => { const T = table(t, max); T.rows.forEach((r) => tag(r, g(k))); return T; });
      const O = table(s.output, max, { hideRows: true }); O.box.classList.add('tv-out');
      O.rows.forEach((r, k) => tag(r, g(s.from[k]?.[0] ?? 0)));
      const col = el('div', 'tv-stack'); col.append(...ins.map((i) => i.box)); stage.append(row(col, arrow(), O.box));
      return { ticks: s.inputs.length, show: (t) => {
        O.rows.forEach((r, k) => r.classList.toggle('tv-hid', (s.from[k]?.[0] ?? 0) >= t));
        say(t ? `Rows of ${s.inputs[t - 1].name} go in${s.op && /union$/i.test(s.op) && !/all/i.test(s.op) ? '; exact copies are kept once' : ''}.` : '');
      } };
    }
    case 'reshape': {
      const A = table(s.input, max), O = table(s.output, max); O.box.classList.add('tv-out');
      stage.append(row(A.box, arrow(s.mode === 'melt' ? '→ wide to long →' : '→ long to wide →'), O.box));
      const keyRows = [...new Set(s.map.map((m) => (s.mode === 'melt' ? m[0] : m[2])))].slice(0, max);
      return { ticks: keyRows.length + 1, show: (t) => {
        [...A.rows, ...O.rows].forEach((r) => [...r.cells].forEach((c) => c.classList.remove('tv-key', 'tv-cur')));
        O.rows.forEach((r, k) => r.classList.toggle('tv-dim', t <= keyRows.length && !s.map.some((m) => m[2] === k && keyRows.slice(0, t).includes(s.mode === 'melt' ? m[0] : m[2]))));
        if (t >= 1 && t <= keyRows.length) {
          const k = keyRows[t - 1];
          for (const [ir, ic, or, oc] of s.map) if ((s.mode === 'melt' ? ir : or) === k) { A.rows[ir]?.cells[ic]?.classList.add('tv-cur'); O.rows[or]?.cells[oc]?.classList.add('tv-cur'); }
          say(s.mode === 'melt' ? `Row ${k + 1}: each value column becomes its own row.` : `Output row ${k + 1}: values spread out into columns.`);
        } else say(t ? `${s.input.rows.length} × ${s.input.cols.length} became ${s.output.rows.length} × ${s.output.cols.length}.` : '');
      } };
    }
  }
}

/** Draw a trace inside el. Returns a handle to stop it. */
export function mountTrace(host: HTMLElement, trace: Trace, opts: TraceOptions = {}) {
  const max = opts.maxRows ?? 12, speed = opts.speed ?? 900;
  host.replaceChildren(); host.classList.add('tv');
  if (trace.title) host.append(el('div', 'tv-title', trace.title));
  if (trace.warn) host.append(el('p', 'tv-warn', trace.warn));
  const chips = el('ol', 'tv-chips');
  const note = el('p', 'tv-note'); const sub = el('p', 'tv-sub'); sub.setAttribute('aria-live', 'polite');
  const stage = el('div', 'tv-stage');
  const ctl = el('div', 'tv-ctl');
  const back = el('button', 'btn secondary', '◀ Back'), play = el('button', 'btn', '▶ Play'), next = el('button', 'btn secondary', 'Next ▶');
  [back, play, next].forEach((b) => (b.type = 'button'));
  const where = el('span', 'tv-where'); ctl.append(back, play, next, where);
  host.append(chips, note, stage, sub, ctl);
  const steps = trace.steps;
  steps.forEach((s, i) => { const li = el('li'); const b = el('button', 'tv-chip', `${i + 1}. ${s.label ?? LABEL[s.kind]}`); b.type = 'button'; b.addEventListener('click', () => { stop(); go(i, true); }); li.append(b); chips.append(li); });

  let cur = -1, tick = 0, drawn: Drawn = { ticks: 0, show: () => {} }, timer = 0, playing = false;
  function go(i: number, end = false) {
    cur = Math.max(0, Math.min(steps.length - 1, i));
    stage.replaceChildren(); sub.textContent = '';
    drawn = draw(stage, steps[cur], max, sub);
    note.textContent = steps[cur].note;
    [...chips.querySelectorAll('.tv-chip')].forEach((c, k) => { c.classList.toggle('on', k === cur); c.classList.toggle('seen', k < cur); if (k === cur) c.setAttribute('aria-current', 'step'); else c.removeAttribute('aria-current'); });
    tick = end || reduce() ? drawn.ticks : 0; drawn.show(tick); status();
  }
  const status = () => { where.textContent = `Step ${cur + 1} of ${steps.length}`; back.disabled = cur <= 0 && tick === 0; next.disabled = cur >= steps.length - 1 && tick >= drawn.ticks; };
  function advance() {
    if (tick < drawn.ticks) { tick++; drawn.show(tick); status(); return true; }
    if (cur < steps.length - 1) { go(cur + 1); return true; }
    return false;
  }
  function loop() { if (!playing) return; if (!advance()) { stop(); return; } timer = window.setTimeout(loop, tick === 0 ? speed * 1.3 : speed); }
  function stop() { playing = false; clearTimeout(timer); play.textContent = '▶ Play'; }
  play.addEventListener('click', () => {
    if (playing) return stop();
    if (cur >= steps.length - 1 && tick >= drawn.ticks) go(0);
    playing = true; play.textContent = '❚❚ Pause'; loop();
  });
  next.addEventListener('click', () => { stop(); if (tick < drawn.ticks) { tick = drawn.ticks; drawn.show(tick); status(); } else if (cur < steps.length - 1) { go(cur + 1); playing = true; play.textContent = '❚❚ Pause'; const run = () => { if (!playing) return; if (tick < drawn.ticks) { tick++; drawn.show(tick); status(); timer = window.setTimeout(run, speed * 0.7); } else stop(); }; timer = window.setTimeout(run, speed * 0.7); } });
  back.addEventListener('click', () => { stop(); if (tick > 0 && tick < drawn.ticks) { tick = 0; drawn.show(0); status(); } else if (cur > 0) go(cur - 1, true); else { tick = 0; drawn.show(0); status(); } });
  if (steps.length) go(0, true);
  return { stop, go };
}
