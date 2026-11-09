// "Check yourself" block for the Learn tools: a few fresh questions with random numbers, checked in the browser,
// with the worked answer shown. Nothing is stored or sent. Styles live in src/styles/learnquiz-d.css.
export type QItem = {
  /** The question, plain text. */
  q: string;
  /** Number answer, or for a choice question the index of the right choice. */
  ans: number;
  /** Unit shown after the box (number questions). */
  unit?: string;
  /** Relative tolerance for number answers (default 2 %). */
  tol?: number;
  /** Absolute tolerance, used instead when given (for answers that can be near zero). */
  abs?: number;
  /** Choices for a pick-one question. */
  choices?: string[];
  /** The worked answer, shown after a right answer or on request. */
  work: string;
};

/** A random number between lo and hi on a step (e.g. 5 → multiples of 5). */
export const pick = (lo: number, hi: number, step = 1) => lo + step * Math.floor(Math.random() * (Math.floor((hi - lo) / step) + 1));
/** One item of a list at random. */
export const one = <T>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];
/** Round for showing in a worked answer. */
export const r = (x: number, n = 3) => (Math.abs(x) >= 10 ** n ? Math.round(x).toLocaleString('en') : String(+x.toPrecision(n)));

const parse = (s: string) => {
  const t = s.trim().replace(/,/g, '').replace(/[−–]/g, '-').replace(/\s*[×x]\s*10\^?\s*(-?\d+)/i, 'e$1');
  return t === '' ? NaN : Number(t);
};

export function mountQuiz(box: HTMLElement, make: () => QItem[]) {
  const list = document.createElement('ol'); list.className = 'lq-list';
  const again = document.createElement('button'); again.type = 'button'; again.className = 'btn secondary small lq-new'; again.textContent = 'New questions';
  const score = document.createElement('p'); score.className = 'ax-help lq-score';
  box.append(list, score, again);
  let right = new Set<number>();
  const tally = (n: number) => { score.textContent = `${right.size} of ${n} right so far. Questions change each time; nothing is saved.`; };
  const build = () => {
    const items = make(); right = new Set(); list.replaceChildren(); tally(items.length);
    items.forEach((it, i) => {
      const li = document.createElement('li'); li.className = 'lq-item'; li.dataset.ans = String(it.ans);
      const p = document.createElement('p'); p.className = 'lq-q'; p.textContent = it.q;
      const fb = document.createElement('p'); fb.className = 'lq-fb'; fb.setAttribute('aria-live', 'polite');
      const work = document.createElement('p'); work.className = 'lq-work'; work.textContent = it.work; work.hidden = true;
      const show = document.createElement('button'); show.type = 'button'; show.className = 'lq-show'; show.textContent = 'Show working';
      show.addEventListener('click', () => { work.hidden = false; show.hidden = true; });
      const mark = (ok: boolean, msg: string) => {
        fb.textContent = msg; fb.className = 'lq-fb ' + (ok ? 'lq-ok' : 'lq-no');
        if (ok) { right.add(i); work.hidden = false; show.hidden = true; tally(items.length); }
      };
      const row = document.createElement('div'); row.className = 'lq-row';
      if (it.choices) {
        it.choices.forEach((c, k) => {
          const b = document.createElement('button'); b.type = 'button'; b.className = 'lq-choice'; b.textContent = c;
          b.addEventListener('click', () => mark(k === it.ans, k === it.ans ? 'Right.' : 'Not quite. Try another, or show the working.'));
          row.append(b);
        });
      } else {
        const inp = document.createElement('input'); inp.className = 'lq-in'; inp.inputMode = 'decimal'; inp.autocomplete = 'off'; inp.setAttribute('aria-label', `Answer to question ${i + 1}`);
        const u = document.createElement('span'); u.className = 'lq-unit'; u.textContent = it.unit ?? '';
        const go = document.createElement('button'); go.type = 'button'; go.className = 'btn small lq-check'; go.textContent = 'Check';
        const test = () => {
          const v = parse(inp.value);
          if (!Number.isFinite(v)) return mark(false, 'Type a number (for example 3.4 or 1.5e-7).');
          const tol = it.tol ?? 0.02, ok = Math.abs(v - it.ans) <= (it.abs ?? tol * Math.abs(it.ans)) + 1e-12;
          mark(ok, ok ? 'Right.' : (Math.abs(v - it.ans) <= 0.1 * Math.abs(it.ans) ? 'Close, but check your rounding.' : 'Not quite. Try again, or show the working.'));
        };
        go.addEventListener('click', test);
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') test(); });
        row.append(inp, u, go);
      }
      li.append(p, row, fb, show, work);
      list.append(li);
    });
  };
  again.addEventListener('click', build);
  build();
}

/** Size a canvas to its CSS width at a fixed CSS height, sharp on high-density screens. */
export function fitCanvas(cv: HTMLCanvasElement, h: number) {
  const W = Math.max(200, cv.clientWidth || 340), dpr = Math.min(3, window.devicePixelRatio || 1);
  if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(h * dpr); cv.style.height = h + 'px'; }
  const ctx = cv.getContext('2d')!; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, W, H: h };
}

/** Wire a pair of Class buttons (data-level) and call back with the chosen level. */
export function wireLevel(root: HTMLElement, cb: (lvl: string) => void) {
  const btns = [...root.querySelectorAll<HTMLButtonElement>('[data-level]')];
  const set = (l: string) => { btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.level === l))); root.querySelectorAll<HTMLElement>('[data-only]').forEach((e) => { e.hidden = e.dataset.only !== l; }); cb(l); };
  btns.forEach((b) => b.addEventListener('click', () => set(b.dataset.level!)));
  set(btns.find((b) => b.getAttribute('aria-pressed') === 'true')?.dataset.level ?? btns[0].dataset.level!);
}

/** An animation loop that runs only while the page is visible; respects reduced motion (starts paused). */
export function loop(step: (dt: number) => void, btn?: HTMLButtonElement) {
  let playing = !matchMedia('(prefers-reduced-motion: reduce)').matches, last = 0, raf = 0;
  const tick = (now: number) => { const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now; step(dt); raf = playing ? requestAnimationFrame(tick) : 0; };
  const label = () => { if (btn) btn.textContent = playing ? 'Pause' : 'Play'; };
  btn?.addEventListener('click', () => { playing = !playing; last = 0; label(); if (playing && !raf) raf = requestAnimationFrame(tick); });
  label(); step(0); if (playing) raf = requestAnimationFrame(tick);
  return { redraw: () => step(0), get playing() { return playing; } };
}
