// 1.2 A study plan that fits the time you have: slide the months left and see learning, revision and mock phases.
import { canvas, text, row, slider, choice, readout } from '../../kit.js';

/** Split the months into phases: learn new chapters, revise with questions, then full mock tests. */
export function plan(months) {
  const mock = Math.max(1, Math.round(months * 0.15));
  const revise = Math.max(1, Math.round(months * 0.25));
  const learn = Math.max(0, months - mock - revise);
  return { learn, revise, mock };
}
export default function (host, { data } = {}) {
  const chapters = +(data?.chapters ?? 80);
  let months = 20, hours = 4;
  const cv = canvas(host, { aspect: 0.32, max: 200, min: 150, label: 'A bar split into learning, revision and mock-test months' });
  const ctl = row(host);
  slider(ctl, { label: 'Months until the exam', min: 3, max: 24, step: 1, value: months, fmt: (v) => `${v}`, oninput: (v) => { months = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Study hours a day (besides school)', min: 1, max: 10, step: 1, value: hours, fmt: (v) => `${v} h`, oninput: (v) => { hours = v; show(); } });
  const out = readout(host);
  const show = () => {
    const p = plan(months), days = p.learn * 30;
    const perCh = days ? (days * hours) / chapters : 0;
    out.innerHTML = p.learn
      ? `Learn ${chapters} chapters in ${p.learn} months: about <b>${Math.round(perCh)} hours per chapter</b> (lesson, notes and at least 60 questions). Then ${p.revise} months of revision with mixed questions, and ${p.mock} of full mock tests.`
      : `With ${months} months, skip new learning: ${p.revise} months of revision by chapter weightage, then ${p.mock} of mocks.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const p = plan(months), L = 12, R = w - 12, y = h * 0.42, bh = h * 0.32;
    let x = L;
    [['Learn', p.learn, col.s[0]], ['Revise', p.revise, col.s[1]], ['Mocks', p.mock, col.s[2]]].forEach(([name, m, c]) => {
      if (!m) return;
      const bw = ((R - L) * m) / months;
      ctx.fillStyle = c; ctx.fillRect(x, y - bh / 2, bw - 2, bh);
      text(ctx, `${name}: ${m} mo`, x + bw / 2, y + bh / 2 + 14, { color: col.ink, size: 11, align: 'center' });
      x += bw;
    });
    text(ctx, `${months} months to the exam`, L, 14, { color: col.ink, size: 13, weight: 600 });
  };
  cv.redraw(); show();
}
