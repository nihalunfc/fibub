// 1.4 Build a study plan: weeks left and number of subjects. Each row is a week, coloured by what it is for:
// learning (lessons + practice), revision, and full mocks. The last part is always mocks.
import { canvas, text, row, slider, readout } from '../../kit.js';

export function plan(weeks, subjects, hours) {
  const mock = Math.max(1, Math.round(weeks * 0.2)), rev = Math.max(1, Math.round(weeks * 0.2));
  const learn = Math.max(1, weeks - mock - rev);
  const perSubject = (learn * hours * 7) / subjects;
  return { learn, rev, mock, perSubject };
}
export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 320, min: 220, label: 'Weeks of the plan split into learning, revision and mock tests' });
  let weeks = 12, subjects = 5, hours = 3;
  const ctl = row(host);
  slider(ctl, { label: 'Weeks until the exam', min: 4, max: 24, step: 1, value: weeks, fmt: (v) => String(v), oninput: (v) => { weeks = v; go(); } });
  slider(ctl, { label: 'Tests you are taking', min: 1, max: 5, step: 1, value: subjects, fmt: (v) => String(v), oninput: (v) => { subjects = v; go(); } });
  slider(ctl, { label: 'Hours a day', min: 1, max: 8, step: 0.5, value: hours, fmt: (v) => `${v} h`, oninput: (v) => { hours = v; go(); } });
  const out = readout(host);
  const go = () => { cv.redraw(); const p = plan(weeks, subjects, hours); out.innerHTML = `${p.learn} weeks learning (about <b>${Math.round(p.perSubject)} hours per test</b>), ${p.rev} weeks revising weak topics, ${p.mock} weeks of full mocks (one a day per test, then review).`; };
  cv.draw = (ctx, w, h, col) => {
    const p = plan(weeks, subjects, hours), x0 = 12, x1 = w - 12, cw = (x1 - x0) / weeks, y = 40, bh = h - 100;
    for (let i = 0; i < weeks; i++) {
      const c = i < p.learn ? col.s[0] : i < p.learn + p.rev ? col.s[3] : col.s[2];
      ctx.fillStyle = c; ctx.fillRect(x0 + i * cw + 1, y, cw - 2, bh);
      if (cw > 16) text(ctx, String(i + 1), x0 + i * cw + cw / 2, y + bh + 12, { color: col.muted, size: 10, align: 'center' });
    }
    const keys = [[col.s[0], 'Learn + practise'], [col.s[3], 'Revise'], [col.s[2], 'Full mocks']];
    keys.forEach(([c, t], i) => { const kx = x0 + i * Math.min(130, (x1 - x0) / 3); ctx.fillStyle = c; ctx.fillRect(kx, h - 26, 10, 10); text(ctx, t, kx + 14, h - 21, { color: col.ink, size: 11 }); });
    text(ctx, 'Week', x0, 22, { color: col.muted, size: 11 });
  };
  go();
}
