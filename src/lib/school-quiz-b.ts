// "Check yourself" block for the Learn tools: a few fresh questions with random numbers, the answer
// checked in the browser and the worked answer shown. Nothing is stored or sent.
export type QuizQuestion = { text: string; ans: number; unit: string; work: string; tol?: number };

const parse = (s: string) => {
  const t = s.trim().replace(/[−–]/g, '-').replace(/\s/g, '').replace(/^(-?\d+),(\d+)$/, '$1.$2');
  return /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t) ? Number(t) : NaN;
};

/** Fill `box` with the questions from make(); "New questions" calls make() again. */
export function mountQuiz(box: HTMLElement, make: () => QuizQuestion[]) {
  const list = document.createElement('ol'), again = document.createElement('button');
  list.className = 'sq-list';
  again.type = 'button'; again.className = 'btn secondary small sq-new'; again.textContent = 'New questions';
  const render = () => {
    list.replaceChildren(...make().map((q, i) => {
      const li = document.createElement('li'), p = document.createElement('p'), row = document.createElement('div');
      const inp = document.createElement('input'), unit = document.createElement('span'), chk = document.createElement('button'), show = document.createElement('button');
      const res = document.createElement('p'), work = document.createElement('p');
      li.className = 'sq-q'; li.dataset.ans = String(q.ans);
      p.textContent = q.text; p.className = 'sq-text';
      row.className = 'sq-row';
      inp.type = 'text'; inp.inputMode = 'decimal'; inp.className = 'sq-in'; inp.setAttribute('aria-label', `Answer to question ${i + 1}`);
      unit.textContent = q.unit; unit.className = 'sq-unit';
      chk.type = 'button'; chk.className = 'btn small sq-check'; chk.textContent = 'Check';
      show.type = 'button'; show.className = 'btn secondary small sq-show'; show.textContent = 'Show answer';
      res.className = 'sq-res'; res.hidden = true;
      work.className = 'sq-work'; work.hidden = true; work.textContent = q.work;
      const tol = q.tol ?? Math.max(0.01, Math.abs(q.ans) * 0.01);
      chk.addEventListener('click', () => {
        const v = parse(inp.value);
        res.hidden = false;
        if (!Number.isFinite(v)) { res.textContent = 'Type a number first.'; res.dataset.ok = ''; return; }
        const ok = Math.abs(v - q.ans) <= tol;
        res.textContent = ok ? 'Right!' : 'Not quite. Try again, or show the answer.';
        res.dataset.ok = ok ? '1' : '0';
        if (ok) work.hidden = false;
      });
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') chk.click(); });
      show.addEventListener('click', () => { work.hidden = false; });
      row.append(inp, unit, chk, show);
      li.append(p, row, res, work);
      return li;
    }));
  };
  again.addEventListener('click', render);
  box.append(list, again);
  render();
  return render;
}
