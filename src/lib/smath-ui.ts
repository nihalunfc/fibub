// Browser helpers shared by the school maths (Learn) tools: SVG drawing, dragging points on an SVG with a
// finger or mouse, sliders paired with number boxes, and the "Check yourself" quiz block. Nothing is stored.
import { answerMatches } from './sci/smath';

const NS = 'http://www.w3.org/2000/svg';
export type Attrs = Record<string, string | number | undefined>;

/** Make an SVG element with attributes, optionally appended to `parent`. */
export function S<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Attrs = {}, parent?: Element, text?: string): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined) e.setAttribute(k, String(v));
  if (text !== undefined) e.textContent = text;
  parent?.append(e);
  return e;
}

/** Client (screen) point to SVG user coordinates. */
export function svgPoint(svg: SVGSVGElement, clientX: number, clientY: number): { x: number; y: number } {
  const m = svg.getScreenCTM();
  if (!m) return { x: 0, y: 0 };
  const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
  return { x: p.x, y: p.y };
}

/**
 * Let the user drag on an SVG. `pick(x, y)` is called on press with SVG coordinates and returns a handle id (or
 * null to ignore); `move(id, x, y)` is called while dragging. Works with mouse, pen and touch.
 */
export function dragOn(svg: SVGSVGElement, pick: (x: number, y: number) => string | null, move: (id: string, x: number, y: number) => void, end?: () => void) {
  let id: string | null = null;
  svg.style.touchAction = 'none';
  svg.addEventListener('pointerdown', (e) => {
    const p = svgPoint(svg, e.clientX, e.clientY);
    id = pick(p.x, p.y);
    if (id === null) return;
    e.preventDefault();
    svg.setPointerCapture(e.pointerId);
    move(id, p.x, p.y);
  });
  svg.addEventListener('pointermove', (e) => { if (id === null) return; const p = svgPoint(svg, e.clientX, e.clientY); move(id, p.x, p.y); });
  const stop = () => { if (id !== null) { id = null; end?.(); } };
  svg.addEventListener('pointerup', stop);
  svg.addEventListener('pointercancel', stop);
}

/** Pair a range slider with a number box; `on` runs after either changes. Returns a setter. */
export function pair(range: HTMLInputElement, box: HTMLInputElement, on: () => void) {
  range.addEventListener('input', () => { box.value = range.value; on(); });
  box.addEventListener('input', () => { const v = Number(box.value); if (box.value.trim() !== '' && Number.isFinite(v)) { range.value = String(v); on(); } });
  return (v: number) => { range.value = String(v); box.value = String(v); };
}

/** Read a paired value (the number box wins, so values beyond the slider work), clamped to [lo, hi]. */
export function val(box: HTMLInputElement, fallback: number, lo = -Infinity, hi = Infinity): number {
  const v = Number(box.value);
  return box.value.trim() === '' || !Number.isFinite(v) ? fallback : Math.min(hi, Math.max(lo, v));
}

export type Question = {
  q: string;           // the question, plain text
  want: number[];      // the numbers that answer it
  hint?: string;       // what to type, e.g. "two numbers, smaller first"
  work: string;        // the worked answer, shown after a check
  tol?: number;        // relative tolerance, default 0.01
  ordered?: boolean;   // the numbers must be in this order
};

/**
 * The "Check yourself" block: a list of fresh questions with an answer box each, a Check button, a worked answer,
 * and "New questions". `root` is an empty element; `make` returns a new set of questions each time.
 */
export function quiz(root: HTMLElement, make: () => Question[]) {
  root.classList.add('sm-quiz');
  const list = document.createElement('ol');
  const again = document.createElement('button');
  again.type = 'button'; again.className = 'btn secondary small sm-qnew'; again.textContent = 'New questions';
  const score = document.createElement('p'); score.className = 'ax-help sm-qscore'; score.setAttribute('aria-live', 'polite');
  root.append(list, score, again);
  let qs: Question[] = [], right = new Set<number>();
  const render = () => {
    qs = make(); right = new Set();
    score.textContent = '';
    list.replaceChildren(...qs.map((qq, i) => {
      const li = document.createElement('li'); li.className = 'sm-q';
      const p = document.createElement('p'); p.className = 'sm-qt'; p.textContent = qq.q;
      const row = document.createElement('div'); row.className = 'ax-row';
      const inp = document.createElement('input'); inp.type = 'text'; inp.inputMode = 'decimal'; inp.autocomplete = 'off'; inp.className = 'sm-qin';
      inp.setAttribute('aria-label', `Answer to question ${i + 1}`);
      if (qq.hint) inp.placeholder = qq.hint;
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'btn small sm-qcheck'; btn.textContent = 'Check';
      const show = document.createElement('button'); show.type = 'button'; show.className = 'btn secondary small sm-qshow'; show.textContent = 'Show answer';
      row.append(inp, btn, show);
      const res = document.createElement('p'); res.className = 'sm-qres'; res.setAttribute('aria-live', 'polite');
      const work = document.createElement('p'); work.className = 'sm-qwork'; work.hidden = true; work.textContent = qq.work;
      const check = () => {
        if (!inp.value.trim()) { res.textContent = 'Type an answer first.'; res.className = 'sm-qres'; return; }
        const ok = answerMatches(inp.value, qq.want, qq.tol ?? 0.01, !qq.ordered);
        res.textContent = ok ? 'Right!' : 'Not quite. Have another go, or see the worked answer.';
        res.className = 'sm-qres ' + (ok ? 'good' : 'bad');
        if (ok) right.add(i); else right.delete(i);
        work.hidden = !ok;
        score.textContent = `${right.size} of ${qs.length} right so far.`;
      };
      btn.addEventListener('click', check);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
      show.addEventListener('click', () => { work.hidden = false; });
      li.append(p, row, res, work);
      return li;
    }));
  };
  again.addEventListener('click', render);
  render();
}
