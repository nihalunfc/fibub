// The one "Check yourself" engine for Learn tools (replaces school-quiz, school-quiz-b, learnquiz-d, chemquiz,
// sm-quiz and elec-quiz-ui for new tools; old tools move over later). Fresh random questions, checked in the
// browser, worked answer shown. Nothing is stored or sent. Styles: src/styles/learnquiz-d.css (lq- classes).
//
//   import { mountQuiz, pick, one, r } from '../../lib/learn/quiz';
//   mountQuiz(box, () => [
//     { q: `A lens has f = ${f} cm. Power?`, ans: 100 / f, unit: 'D', work: `P = 100 / f = ${r(100 / f)} D` },
//     { q: 'Which lens corrects myopia?', choices: ['Convex', 'Concave'], ans: 1, work: 'A concave (diverging) lens.' },
//     { q: 'Electron configuration of Na?', text: ['2,8,1', '2 8 1'], work: 'Na has 11 electrons: 2, 8, 1.' },
//   ]);
import { parse as parseExpr, compile } from '../sci/expr';

export type QItem = {
  /** The question, plain text. */
  q: string;
  /** Number answer; for a choice question, the index of the right choice. */
  ans?: number;
  /** Unit shown after the box (number questions). */
  unit?: string;
  /** Relative tolerance for number answers (default 2 %). */
  tol?: number;
  /** Absolute tolerance, used instead when given (answers near zero). */
  abs?: number;
  /** Choices for a pick-one question (ans = index of the right one). */
  choices?: string[];
  /** Accepted text answers (spaces, case and − vs - ignored), for answers that are not numbers. */
  text?: string[];
  /** Short hint under the box, e.g. "a fraction like 3/4". */
  hint?: string;
  /** The worked answer, shown after a right answer or on request. */
  work: string;
};

/** A random number between lo and hi on a step (e.g. 5 gives multiples of 5). */
export const pick = (lo: number, hi: number, step = 1) => lo + step * Math.floor(Math.random() * (Math.floor((hi - lo) / step) + 1));
/** One item of a list at random. */
export const one = <T>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)];
/** Round for a worked answer: n significant figures, big numbers with thousands separators. */
export const r = (x: number, n = 3) => (Math.abs(x) >= 10 ** n ? Math.round(x).toLocaleString('en') : String(+x.toPrecision(n)).replace('-', '−'));

/** Read a typed number: 1,234 · 1.5e-7 · 1.5 × 10^-7 · 3/4 · sqrt(2) · pi/3. NaN when it cannot be read. */
export function readNumber(s: string): number {
  const t = s.trim().replace(/(\d),(?=\d{3}\b)/g, '$1').replace(/[−–]/g, '-').replace(/\s*[×x]\s*10\^?\s*(-?\d+)/i, 'e$1');
  if (t === '') return NaN;
  const n = Number(t);
  if (Number.isFinite(n)) return n;
  try { return compile(parseExpr(t.replace(/,/g, '.')), [])([]); } catch { return NaN; }
}
const norm = (s: string) => s.replace(/[−–]/g, '-').replace(/\s+/g, '').toLowerCase();

/** Is a typed answer right? Exported so the maths can be unit-tested without a browser. */
export function isRight(it: QItem, typed: string | number): boolean {
  if (it.choices) return Number(typed) === it.ans;
  if (it.text) return it.text.some((w) => norm(w) === norm(String(typed)));
  const v = typeof typed === 'number' ? typed : readNumber(typed), a = it.ans ?? NaN;
  return Number.isFinite(v) && Math.abs(v - a) <= (it.abs ?? (it.tol ?? 0.02) * Math.abs(a)) + 1e-12;
}

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, txt = '') => {
  const e = document.createElement(tag); e.className = cls; if (txt) e.textContent = txt; return e;
};

/** Fill `box` with questions from `make()` and a "New questions" button. */
export function mountQuiz(box: HTMLElement, make: () => QItem[]) {
  const list = el('ol', 'lq-list'), score = el('p', 'ax-help lq-score');
  const again = el('button', 'btn secondary small lq-new', 'New questions'); again.type = 'button';
  box.append(list, score, again);
  let right = new Set<number>();
  const tally = (n: number) => { score.textContent = `${right.size} of ${n} right so far. Questions change each time; nothing is saved.`; };
  const build = () => {
    const items = make(); right = new Set(); list.replaceChildren(); tally(items.length);
    items.forEach((it, i) => {
      const li = el('li', 'lq-item'), fb = el('p', 'lq-fb'), work = el('p', 'lq-work', it.work), row = el('div', 'lq-row');
      if (it.ans !== undefined) li.dataset.ans = String(it.ans); else if (it.text) li.dataset.ans = it.text[0];
      fb.setAttribute('aria-live', 'polite'); work.hidden = true;
      const show = el('button', 'lq-show', 'Show working'); show.type = 'button';
      show.addEventListener('click', () => { work.hidden = false; show.hidden = true; });
      const mark = (ok: boolean, msg: string) => {
        fb.textContent = msg; fb.className = 'lq-fb ' + (ok ? 'lq-ok' : 'lq-no');
        if (ok) { right.add(i); work.hidden = false; show.hidden = true; tally(items.length); }
      };
      if (it.choices) {
        it.choices.forEach((c, k) => {
          const b = el('button', 'lq-choice', c); b.type = 'button';
          b.addEventListener('click', () => { const ok = isRight(it, k); mark(ok, ok ? 'Right.' : 'Not quite. Try another, or show the working.'); });
          row.append(b);
        });
      } else {
        const inp = el('input', 'lq-in'); inp.autocomplete = 'off'; inp.setAttribute('aria-label', `Answer to question ${i + 1}`);
        if (!it.text) inp.inputMode = 'decimal';
        const go = el('button', 'btn small lq-check', 'Check'); go.type = 'button';
        const test = () => {
          if (it.text) return mark(isRight(it, inp.value), isRight(it, inp.value) ? 'Right.' : 'Not quite. Try again, or show the working.');
          const v = readNumber(inp.value), a = it.ans ?? NaN;
          if (!Number.isFinite(v)) return mark(false, 'Type a number (for example 3.4, 1.5e-7 or 3/4).');
          const ok = isRight(it, v);
          mark(ok, ok ? 'Right.' : Math.abs(v - a) <= 0.1 * Math.abs(a) ? 'Close, but check your rounding.' : 'Not quite. Try again, or show the working.');
        };
        go.addEventListener('click', test);
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') test(); });
        row.append(inp, el('span', 'lq-unit', it.unit ?? ''), go);
      }
      li.append(el('p', 'lq-q', it.q), row);
      if (it.hint) li.append(el('p', 'ax-help lq-hint', it.hint));
      li.append(fb, show, work);
      list.append(li);
    });
  };
  again.addEventListener('click', build);
  build();
}
