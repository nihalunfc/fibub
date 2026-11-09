// "Check yourself" block for the electricity and magnetism Learn tools: fresh questions with random numbers,
// answers checked in the browser, worked answer shown. Nothing is stored or sent anywhere.
import { isRight, r3, type Question } from './sci/elec-quiz.ts';

export function quiz(box: HTMLElement, make: () => Question[]) {
  const draw = () => {
    const qs = make();
    const list = document.createElement('ol');
    list.className = 'eq-list';
    qs.forEach((q, i) => {
      const li = document.createElement('li');
      li.className = 'eq-q';
      const p = document.createElement('p'); p.textContent = q.text;
      const row = document.createElement('div'); row.className = 'ax-row';
      const inp = document.createElement('input');
      inp.type = 'text'; inp.inputMode = 'decimal'; inp.className = 'eq-in'; inp.dataset.i = String(i);
      inp.setAttribute('aria-label', `Answer to question ${i + 1}${q.unit ? ` in ${q.unit}` : ''}`);
      inp.style.maxWidth = '9em';
      const unit = document.createElement('span'); unit.textContent = q.unit;
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'btn secondary small eq-go'; btn.textContent = 'Check';
      const res = document.createElement('p'); res.className = 'eq-res'; res.setAttribute('aria-live', 'polite');
      const det = document.createElement('details'); det.className = 'eq-work';
      const sum = document.createElement('summary'); sum.textContent = 'Show the working';
      const steps = document.createElement('div');
      for (const s of q.steps) { const d = document.createElement('p'); d.textContent = s; steps.append(d); }
      det.append(sum, steps);
      const check = () => {
        const ok = isRight(inp.value, q);
        res.className = 'eq-res ' + (ok === null ? '' : ok ? 'eq-ok' : 'eq-no');
        res.textContent = ok === null ? 'Type a number first.' : ok ? `Right: ${r3(q.answer)}${q.unit ? ' ' + q.unit : ''}.` : `Not quite. Try again, or open the working.`;
        if (ok) det.open = true;
      };
      btn.addEventListener('click', check);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
      row.append(inp, unit, btn);
      li.append(p, row, res, det);
      list.append(li);
    });
    const again = document.createElement('button');
    again.type = 'button'; again.className = 'btn secondary small eq-new'; again.textContent = 'New questions';
    again.addEventListener('click', draw);
    box.replaceChildren(list, again);
  };
  draw();
}
