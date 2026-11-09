// "Check yourself" for the school maths (Learn) tools: a few fresh questions with random numbers, checked
// in the browser, each with a worked answer. Nothing is stored or sent. Answers may be typed as numbers,
// fractions or simple expressions (3/4, -2.5, sqrt(2), pi/3), read by the safe formula reader in expr.ts.
import { parse, compile } from './sci/expr';

export type Question =
  | { text: string; answer: number; tol?: number; worked: string; choices?: undefined }
  | { text: string; choices: string[]; correct: number; worked: string; answer?: undefined };

/** Read a typed answer: a number, fraction or small expression. NaN when it cannot be read. */
export function readAnswer(s: string): number {
  const t = s.trim().replace(/,/g, '.');
  if (!t) return NaN;
  try { return compile(parse(t), [])([]); } catch { return NaN; }
}
export const isRight = (q: Question, typed: string | number) => {
  if (q.choices) return Number(typed) === q.correct;
  const v = typeof typed === 'number' ? typed : readAnswer(typed);
  const tol = q.tol ?? Math.max(1e-6, Math.abs(q.answer) * 1e-3);
  return Number.isFinite(v) && Math.abs(v - q.answer) <= tol;
};

/** Fill `box` (an element with a .smq-list and a .smq-new button) with questions from `make()`. */
export function quiz(box: HTMLElement, make: () => Question[]) {
  const list = box.querySelector<HTMLElement>('.smq-list')!;
  const fill = () => {
    list.replaceChildren(...make().map((q, i) => {
      const li = document.createElement('li'); li.className = 'smq-q';
      const p = document.createElement('p'); p.className = 'smq-text'; p.textContent = q.text; li.append(p);
      const row = document.createElement('div'); row.className = 'smq-row';
      let get: () => string | number;
      if (q.choices) {
        const sel = document.createElement('div'); sel.className = 'smq-choices'; sel.setAttribute('role', 'radiogroup');
        let picked = -1;
        q.choices.forEach((c, j) => {
          const b = document.createElement('button'); b.type = 'button'; b.textContent = c; b.setAttribute('aria-pressed', 'false');
          b.addEventListener('click', () => { picked = j; sel.querySelectorAll('button').forEach((x, k) => x.setAttribute('aria-pressed', String(k === j))); });
          sel.append(b);
        });
        row.append(sel); get = () => picked;
      } else {
        const inp = document.createElement('input'); inp.type = 'text'; inp.inputMode = 'decimal'; inp.className = 'smq-in';
        inp.setAttribute('aria-label', `Answer to question ${i + 1}`);
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check.click(); });
        row.append(inp); get = () => inp.value;
      }
      const check = document.createElement('button'); check.type = 'button'; check.className = 'btn small secondary smq-check'; check.textContent = 'Check';
      row.append(check); li.append(row);
      const out = document.createElement('p'); out.className = 'smq-out'; out.hidden = true; li.append(out);
      const det = document.createElement('details'); det.className = 'smq-work';
      const sum = document.createElement('summary'); sum.textContent = 'Show the working';
      const w = document.createElement('p'); w.textContent = q.worked; det.append(sum, w); li.append(det);
      check.addEventListener('click', () => {
        const v = get();
        if (q.choices ? v === -1 : !Number.isFinite(readAnswer(String(v)))) { out.textContent = q.choices ? 'Pick an answer first.' : 'Type a number, a fraction like 3/4, or something like sqrt(2).'; out.className = 'smq-out'; out.hidden = false; return; }
        const ok = isRight(q, v);
        out.textContent = ok ? 'Right!' : 'Not quite. Try again, or open the working.';
        out.className = `smq-out ${ok ? 'smq-ok' : 'smq-no'}`; out.hidden = false;
        if (ok) det.open = true;
      });
      return li;
    }));
  };
  box.querySelector('.smq-new')!.addEventListener('click', fill);
  fill();
}

/** Whole numbers from lo to hi (inclusive), optionally never zero. */
export const rint = (lo: number, hi: number, nonzero = false): number => {
  const n = lo + Math.floor(Math.random() * (hi - lo + 1));
  return nonzero && n === 0 ? rint(lo, hi, true) : n;
};
export const pick = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
