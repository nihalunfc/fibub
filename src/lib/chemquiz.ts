// "Check yourself" block for the school chemistry tools: a few fresh questions with random numbers, the answer
// checked in the browser and the worked answer shown. Nothing is stored or sent.
// Markup expected: <div class="cq"><ol class="cq-list"></ol><button class="cq-new">New questions</button></div>

export type Question = {
  q: string;
  /** Right answer as shown in the worked answer, e.g. "23". */
  answer: string;
  /** Does the typed text count as right? */
  ok: (typed: string) => boolean;
  worked: string;
  /** Hint under the box, e.g. "a whole number" or "like 2,8,1". */
  hint?: string;
};

/** Typed number within a relative (or absolute, near zero) tolerance. */
export const near = (want: number, rel = 0.01) => (typed: string) => {
  const x = Number(typed.replace(/[−–]/g, '-').replace(/\s+/g, '').replace(/,(?=\d{3}\b)/g, '').replace(/×10\^?/i, 'e').replace(/x10\^?/i, 'e'));
  return Number.isFinite(x) && Math.abs(x - want) <= Math.max(rel * Math.abs(want), 1e-9);
};
/** Typed text equal after removing spaces and case (and treating − as -). */
export const same = (...wants: string[]) => (typed: string) => {
  const t = (s: string) => s.replace(/[−–]/g, '-').replace(/\s+/g, '').toLowerCase();
  return wants.some((w) => t(w) === t(typed));
};

export function mountQuiz(box: HTMLElement, make: () => Question[]) {
  const list = box.querySelector<HTMLOListElement>('.cq-list')!;
  const render = () => {
    list.replaceChildren();
    make().forEach((qq, i) => {
      const li = document.createElement('li'); li.className = 'cq-item';
      const p = document.createElement('p'); p.className = 'cq-q'; p.textContent = qq.q;
      const row = document.createElement('div'); row.className = 'cq-row';
      const inp = document.createElement('input'); inp.className = 'cq-in'; inp.setAttribute('aria-label', `Answer to question ${i + 1}`); inp.autocomplete = 'off';
      if (qq.hint) inp.placeholder = qq.hint;
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'btn secondary small cq-check'; btn.textContent = 'Check';
      const show = document.createElement('button'); show.type = 'button'; show.className = 'btn secondary small cq-show'; show.textContent = 'Show answer';
      row.append(inp, btn, show);
      const res = document.createElement('p'); res.className = 'cq-res'; res.hidden = true;
      const work = document.createElement('p'); work.className = 'cq-work'; work.hidden = true; work.textContent = `${qq.worked} Answer: ${qq.answer}.`;
      const check = () => {
        const good = inp.value.trim() !== '' && qq.ok(inp.value.trim());
        res.hidden = false; res.className = `cq-res ${good ? 'good' : 'bad'}`;
        res.textContent = inp.value.trim() === '' ? 'Type an answer first.' : good ? 'Right!' : 'Not quite. Try again, or show the answer.';
        if (good) work.hidden = false;
      };
      btn.addEventListener('click', check);
      inp.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') check(); });
      show.addEventListener('click', () => { work.hidden = false; });
      li.append(p, row, res, work); list.append(li);
    });
  };
  box.querySelector('.cq-new')?.addEventListener('click', render);
  render();
}

/** Random whole number from lo to hi (inclusive). */
export const rint = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
export const pickOne = <T>(xs: readonly T[]): T => xs[Math.floor(Math.random() * xs.length)];
