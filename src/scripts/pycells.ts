// Python cells in course lessons (markup from src/lib/pycells.mjs): edit, Run (or Ctrl/⌘+Enter), Check,
// Hint, Show answer, Reset. Python runs in a web worker with Pyodide served from this site (/py/); the
// first Run downloads it once (about 20 MB, then kept for offline use). Nothing typed leaves the device.
type Item = { kind: 'text'; text: string } | { kind: 'table'; cols: string[]; nIndex: number; rows: (string | number | null)[][]; shape: [number, number]; cut: boolean; series: boolean };
type Result = { items: Item[]; error: { type: string; msg: string; line: number | null } | null; ok: boolean | null; msg: string | null };

let worker: Worker | null = null, seq = 0, status = '';
const waiting = new Map<number, (r: Result) => void>();
const listeners = new Set<(s: string) => void>();

function start() {
  if (worker) return worker;
  worker = new Worker(new URL('../lib/py/worker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (e) => {
    const d = e.data;
    if (d.status) { status = d.status; listeners.forEach((f) => f(status)); return; }
    waiting.get(d.id)?.(d.result); waiting.delete(d.id);
  };
  worker.onerror = () => { status = 'Python could not start in this browser.'; listeners.forEach((f) => f(status)); };
  return worker;
}
const run = (code: string, o: { setup?: string; check?: string; files?: string[] }) => new Promise<Result>((res) => {
  const id = ++seq; waiting.set(id, res); start().postMessage({ id, code, ...o });
});
/** Stop a runaway cell: end the worker and start a fresh one next time. */
function stop() {
  worker?.terminate(); worker = null; status = '';
  for (const [, res] of waiting) res({ items: [], error: { type: 'Stopped', msg: 'The code was stopped. Python will restart on the next Run.', line: null }, ok: null, msg: null });
  waiting.clear();
}

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
  const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e;
};
const fmtCell = (v: string | number | null) => (v === null ? 'NaN' : typeof v === 'number' ? (Number.isInteger(v) ? v.toLocaleString('en').replace(/,/g, '') : String(v)) : v);

export function tableEl(t: Extract<Item, { kind: 'table' }>) {
  const wrap = el('div', 'py-tablewrap'), tb = el('table', 'py-table'), head = el('tr');
  t.cols.forEach((c, i) => head.append(el('th', i < t.nIndex ? 'py-ix' : '', c)));
  const thead = el('thead'); thead.append(head); tb.append(thead);
  const body = el('tbody');
  for (const r of t.rows) {
    const tr = el('tr');
    r.forEach((v, i) => { const td = el(i < t.nIndex ? 'th' : 'td', i < t.nIndex ? 'py-ix' : typeof v === 'number' || /^-?\d[\d.]*(e[-+]?\d+)?$/.test(v ?? '') ? 'py-num' : v === null ? 'py-na' : '', fmtCell(v)); tr.append(td); });
    body.append(tr);
  }
  tb.append(body); wrap.append(tb);
  const note = el('p', 'py-shape', `${t.series ? 'Series' : 'DataFrame'}: ${t.shape[0].toLocaleString('en')} row${t.shape[0] === 1 ? '' : 's'}${t.series ? '' : ` × ${t.shape[1]} column${t.shape[1] === 1 ? '' : 's'}`}${t.cut ? ` (first ${t.rows.length} shown)` : ''}`);
  const box = el('div'); box.append(wrap, note); return box;
}

function show(out: HTMLElement, r: Result, code: string) {
  out.replaceChildren();
  for (const it of r.items) out.append(it.kind === 'text' ? el('pre', 'py-text', it.text) : tableEl(it));
  if (r.error) {
    const line = r.error.line ? code.split('\n')[r.error.line - 1]?.trim() : '';
    const box = el('div', 'py-err');
    box.append(el('b', '', `${r.error.type}${r.error.line ? ` on line ${r.error.line}` : ''}`), el('span', '', `: ${r.error.msg}`));
    if (line) box.append(el('code', '', line));
    out.append(box);
  }
  if (r.ok !== null) out.append(el('p', r.ok ? 'py-ok' : 'py-no', r.ok ? 'Correct! Well done.' : r.msg ?? 'Not quite yet.'));
  if (!out.children.length) out.append(el('p', 'py-quiet', 'Ran with no output. Put a variable name on the last line, or use print(), to see a result.'));
}

const tpl = (cell: HTMLElement, name: string) => cell.querySelector<HTMLTemplateElement>(`template[data-${name}]`)?.content.textContent ?? '';

function grow(ta: HTMLTextAreaElement) { ta.style.height = 'auto'; ta.style.height = `${ta.scrollHeight + 2}px`; }

function setup(cell: HTMLElement) {
  const ta = cell.querySelector<HTMLTextAreaElement>('.py-code')!, out = cell.querySelector<HTMLElement>('.py-out')!;
  const files = (cell.dataset.files ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const btnRun = cell.querySelector<HTMLButtonElement>('button[data-run]')!;
  let busy = false;
  grow(ta);
  ta.addEventListener('input', () => grow(ta));
  ta.addEventListener('focus', () => { start().postMessage({ warm: true }); }, { once: true });
  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); go(false); return; }
    if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); ta.setRangeText('    ', ta.selectionStart, ta.selectionEnd, 'end'); grow(ta); }
  });
  const say = (s: string) => { if (busy && s !== 'ready') { out.replaceChildren(el('p', 'py-quiet', `${s} The first run downloads Python once (about 20 MB); later runs are instant.`)); } };
  listeners.add(say);
  async function go(check: boolean) {
    if (busy) { stop(); return; }
    busy = true; btnRun.textContent = 'Stop'; cell.classList.add('is-busy');
    if (status !== 'ready') say(status || 'Starting Python…'); else out.replaceChildren(el('p', 'py-quiet', 'Running…'));
    const r = await run(ta.value, { setup: tpl(cell, 'setup'), check: check ? tpl(cell, 'check') : '', files });
    busy = false; btnRun.textContent = 'Run'; cell.classList.remove('is-busy');
    show(out, r, ta.value);
    cell.dispatchEvent(new CustomEvent('py:ran', { detail: { result: r, code: ta.value }, bubbles: true }));
  }
  btnRun.addEventListener('click', () => go(false));
  cell.querySelector('button[data-check]')?.addEventListener('click', () => go(true));
  cell.querySelector('button[data-hint]')?.addEventListener('click', () => { out.replaceChildren(el('p', 'py-hint', `Hint: ${tpl(cell, 'hint').trim()}`)); });
  cell.querySelector('button[data-sol]')?.addEventListener('click', () => { ta.value = tpl(cell, 'sol'); grow(ta); go(!!tpl(cell, 'check')); });
  cell.querySelector('button[data-reset]')?.addEventListener('click', () => { ta.value = tpl(cell, 'start'); grow(ta); out.replaceChildren(); });
}

document.querySelectorAll<HTMLElement>('.py').forEach(setup);
