// 8.3 Split the 30 minutes: plan, write and check. Too little planning or no checking costs marks.
import { canvas, row, slider, readout, text, title } from '../../kit.js';
export default function (host) {
  let plan = 5, check = 3;
  const cv = canvas(host, { aspect: 0.32, max: 170, min: 130, label: 'How the 30 minutes of the Issue task are split' });
  const ctl = row(host);
  slider(ctl, { label: 'Planning', min: 0, max: 12, step: 1, value: plan, fmt: (v) => Math.round(v) + ' min', oninput: (v) => { plan = Math.round(v); go(); } });
  slider(ctl, { label: 'Checking', min: 0, max: 8, step: 1, value: check, fmt: (v) => Math.round(v) + ' min', oninput: (v) => { check = Math.round(v); go(); } });
  const out = readout(host);
  const go = () => {
    cv.redraw(); const write = 30 - plan - check, words = write * 22;
    out.innerHTML = `Writing time <b>${write} minutes</b>, about ${words} words at a steady 22 words a minute. ` +
      (plan < 3 ? 'Too little planning: essays written with no plan tend to wander and repeat.' : plan > 8 ? 'Too long planning: you may not finish the body paragraphs.' : check < 2 ? 'Leave 2 or 3 minutes to fix typos and missing words.' : words < 400 ? 'A little short: most strong essays run 450 to 650 words.' : 'A good split.');
  };
  cv.draw = (ctx, w, h, col) => {
    const l = 16, r = w - 16, y = h * 0.5, X = (m) => l + (r - l) * m / 30;
    [[0, plan, col.s[1], 'Plan'], [plan, 30 - check, col.s[0], 'Write'], [30 - check, 30, col.s[2], 'Check']].forEach(([a, b, c, lab]) => {
      if (b <= a) return; ctx.fillStyle = c; ctx.fillRect(X(a), y - 14, X(b) - X(a) - 1, 28);
      if (X(b) - X(a) > 34) text(ctx, `${lab} ${b - a}`, (X(a) + X(b)) / 2, y + 30, { color: col.ink, size: 11.5, align: 'center' });
    });
    title(ctx, '30 minutes, one essay', col);
  };
  go();
}
