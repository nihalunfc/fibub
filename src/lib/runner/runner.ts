// Type-and-run code box shared by the SQL, data modelling, Power BI and pandas courses: an editor, Run
// (Ctrl/⌘+Enter), Check against a model answer, Hint, Show answer, Reset, and optionally "Show how it runs"
// (a step-by-step table animation from src/lib/tableviz/). The language lives in the `run` function you
// pass, so SQL (sql.js), DAX or Python (Pyodide) all use the same box. Styles: src/styles/runner.css.
import type { Cell, Trace } from '../tableviz/types';
import { mountTrace, fmt } from '../tableviz/render';

export type RunTable = { name?: string; cols: string[]; rows: Cell[][] };
export type RunOutput = { ok: boolean; tables?: RunTable[]; text?: string; error?: string; note?: string };
export type CheckResult = { pass: boolean; msg: string };
export type RunnerConfig = {
  lang: string;
  code: string;
  task?: string;
  answer?: string;
  hint?: string;
  /** How results are compared with the answer's: as a set of rows (any order), in order, or not at all. */
  checkMode?: 'set' | 'ordered' | 'none';
  run: (code: string) => Promise<RunOutput>;
  check?: (mine: RunOutput, answer: RunOutput, code: string) => CheckResult;
  explain?: (code: string) => Promise<Trace | null>;
  extras?: { label: string; onClick: (code: string, box: { setCode: (c: string) => void; run: () => void }) => void }[];
  maxRows?: number;
  onPass?: () => void;
  label?: string;
};

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const btn = (text: string, cls = 'btn secondary') => { const b = el('button', cls, text); b.type = 'button'; return b; };

const norm = (v: Cell) => (typeof v === 'number' ? String(Math.round(v * 100) / 100) : v == null ? '∅' : String(v));
/** Compare two result tables. Column names don't matter (aliases are free); values are rounded to 2 decimals. */
export function compareTables(mine: RunTable | undefined, want: RunTable | undefined, ordered: boolean): CheckResult {
  if (!want) return { pass: true, msg: '' };
  if (!mine) return { pass: false, msg: 'Your code did not give a table. Make sure it ends with a query that returns rows.' };
  if (mine.cols.length !== want.cols.length) return { pass: false, msg: `Your result has ${mine.cols.length} column${mine.cols.length === 1 ? '' : 's'}; the answer has ${want.cols.length} (${want.cols.join(', ')}).` };
  if (mine.rows.length !== want.rows.length) return { pass: false, msg: `Your result has ${mine.rows.length} row${mine.rows.length === 1 ? '' : 's'}; the answer has ${want.rows.length}.${mine.rows.length > want.rows.length ? ' Is a filter or a GROUP BY missing, or is a join making copies?' : ' Is a filter too strict, or a join dropping rows?'}` };
  const a = mine.rows.map((r) => r.map(norm).join('\u0001')), b = want.rows.map((r) => r.map(norm).join('\u0001'));
  if (ordered) { const k = a.findIndex((x, i) => x !== b[i]); if (k < 0) return { pass: true, msg: '' }; const same = [...a].sort().join('\u0002') === [...b].sort().join('\u0002'); return { pass: false, msg: same ? 'The right rows, but in a different order. Check ORDER BY (and ASC or DESC).' : `Row ${k + 1} is different from the answer's.` }; }
  const sa = [...a].sort(), sb = [...b].sort(); const k = sa.findIndex((x, i) => x !== sb[i]);
  if (k < 0) return { pass: true, msg: '' };
  const colsSorted = (rows: string[]) => rows.map((r) => r.split('\u0001').sort().join('\u0001')).sort().join('\u0002');
  if (colsSorted(a) === colsSorted(b)) return { pass: false, msg: 'The right values, but the columns are in a different order. Put them in the order the task asks for.' };
  return { pass: false, msg: 'Same number of rows, but some values differ from the answer\'s. Check your conditions and sums.' };
}

export function drawTable(t: RunTable, max = 200) {
  const box = el('div', 'rn-table');
  if (t.name) box.append(el('div', 'rn-tname', t.name));
  const wrap = el('div', 'rn-scroll'); const tb = el('table'); const hr = tb.createTHead().insertRow();
  t.cols.forEach((c) => hr.append(el('th', '', c)));
  const body = tb.createTBody();
  for (const r of t.rows.slice(0, max)) { const tr = body.insertRow(); r.forEach((v) => { const td = tr.insertCell(); td.textContent = fmt(v); if (v == null) td.className = 'rn-null'; else if (typeof v === 'number') td.className = 'rn-num'; }); }
  wrap.append(tb); box.append(wrap);
  box.append(el('div', 'rn-count', t.rows.length > max ? `Showing the first ${max} of ${t.rows.length.toLocaleString('en')} rows` : `${t.rows.length.toLocaleString('en')} row${t.rows.length === 1 ? '' : 's'}`));
  return box;
}

export function mountRunner(host: HTMLElement, cfg: RunnerConfig) {
  host.replaceChildren(); host.classList.add('rn');
  const max = cfg.maxRows ?? 200;
  if (cfg.task) { const t = el('div', 'rn-task'); t.append(el('strong', '', cfg.label ?? 'Your turn: '), document.createTextNode(cfg.task)); host.append(t); }
  const ed = el('textarea', 'rn-code'); ed.spellcheck = false; ed.value = cfg.code; ed.setAttribute('aria-label', `${cfg.lang} code`); ed.autocapitalize = 'off'; ed.setAttribute('autocorrect', 'off');
  const size = () => { ed.rows = Math.min(18, Math.max(3, ed.value.split('\n').length + 1)); };
  size();
  const bar = el('div', 'rn-bar');
  const run = btn('▶ Run', 'btn'); run.title = 'Ctrl+Enter';
  const how = cfg.explain ? btn('Show how it runs') : null;
  const check = cfg.answer && cfg.checkMode !== 'none' ? btn('Check') : null;
  const hint = cfg.hint ? btn('Hint') : null;
  const show = cfg.answer ? btn('Show answer') : null;
  const reset = btn('Reset code');
  bar.append(run, ...[how, check, hint, show].filter((x): x is HTMLButtonElement => !!x), reset);
  const extraBtns = (cfg.extras ?? []).map((x) => { const b = btn(x.label, 'rn-link'); b.addEventListener('click', () => x.onClick(ed.value, { setCode, run: go })); return b; });
  if (extraBtns.length) { const ex = el('div', 'rn-extras'); ex.append(...extraBtns); bar.append(ex); }
  const msg = el('div', 'rn-msg'); msg.setAttribute('aria-live', 'polite'); msg.hidden = true;
  const out = el('div', 'rn-out');
  const viz = el('div', 'rn-viz'); viz.hidden = true;
  host.append(ed, bar, msg, out, viz);

  const say = (text: string, kind: 'good' | 'bad' | 'info' | 'hint') => { msg.hidden = !text; msg.className = `rn-msg rn-${kind}`; msg.textContent = text; };
  function setCode(c: string) { ed.value = c; size(); }
  let busy = false;
  async function go() {
    if (busy) return; busy = true; run.disabled = true; run.textContent = 'Running…'; say('', 'info');
    try {
      const r = await cfg.run(ed.value);
      out.replaceChildren();
      if (!r.ok) { say(r.error ?? 'Something went wrong.', 'bad'); return r; }
      if (r.note) say(r.note, 'info');
      for (const t of r.tables ?? []) out.append(drawTable(t, max));
      if (r.text) out.append(el('pre', 'rn-text', r.text));
      if (!viz.hidden && cfg.explain) await explain();
      return r;
    } finally { busy = false; run.disabled = false; run.textContent = '▶ Run'; }
  }
  async function explain() {
    viz.hidden = false; viz.replaceChildren(el('p', 'rn-wait', 'Working out the steps…'));
    const tr = await cfg.explain!(ed.value);
    if (!tr || !tr.steps.length) { viz.replaceChildren(el('p', 'rn-wait', tr?.warn ?? 'This code can\'t be drawn step by step.')); return; }
    const box = el('div'); viz.replaceChildren(box); mountTrace(box, tr);
  }
  run.addEventListener('click', go);
  ed.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); go(); return; }
    if (e.key === 'Tab' && !e.shiftKey && !e.altKey) { e.preventDefault(); const s = ed.selectionStart, en = ed.selectionEnd; ed.setRangeText('  ', s, en, 'end'); size(); }
    if (e.key === 'Escape') ed.blur();
  });
  ed.addEventListener('input', size);
  how?.addEventListener('click', async () => { if (!viz.hidden) { viz.hidden = true; how.textContent = 'Show how it runs'; return; } how.textContent = 'Hide steps'; await explain(); });
  hint?.addEventListener('click', () => say(`Hint: ${cfg.hint}`, 'hint'));
  show?.addEventListener('click', () => { setCode(cfg.answer!); say('This is one correct answer. Press Run to see its result; other ways can be right too.', 'info'); });
  reset.addEventListener('click', () => { setCode(cfg.code); out.replaceChildren(); say('', 'info'); });
  check?.addEventListener('click', async () => {
    const mine = await go(); if (!mine || !mine.ok) return;
    const want = await cfg.run(cfg.answer!);
    const res = cfg.check ? cfg.check(mine, want, ed.value) : compareTables(mine.tables?.[mine.tables.length - 1], want.tables?.[want.tables.length - 1], cfg.checkMode === 'ordered');
    if (res.pass) { say(`✓ Correct! ${res.msg}`.trim(), 'good'); host.classList.add('rn-solved'); cfg.onPass?.(); } else say(`Not yet. ${res.msg}`, 'bad');
  });
  return { setCode, getCode: () => ed.value, run: go };
}
