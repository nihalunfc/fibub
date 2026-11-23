// Class 8 Fractions in Disguise: a percent is a fraction with denominator 100. Pick a fraction and see it on a 10 x 10 grid of 100
// squares; the number of shaded squares is the percent: (n / d) x 100.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let d = 4, n = 3, sl;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 280, label: 'A ten by ten grid shaded to show a fraction as a percent' });
  const ctl = row(host);
  choice(ctl, 'Denominator', [[2, '2'], [4, '4'], [5, '5'], [8, '8'], [20, '20'], [25, '25']], d, (v) => { d = v; if (n > d) n = d; upd(); });
  sl = slider(ctl, { label: 'Numerator', min: 0, max: 25, step: 1, value: n, fmt: (v) => String(Math.min(Math.round(v), d)), oninput: (v) => { n = Math.min(Math.round(v), d); upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const pc = n / d * 100, t = title(ctx, n + '/' + d + ' = ' + +pc.toFixed(2) + '%', col), s = Math.min((w - 40) / 10, (h - t - 56) / 10), ox = (w - 10 * s) / 2, oy = t + 22, k = Math.round(pc);
    for (let i = 0; i < 100; i++) { const r = Math.floor(i / 10), c = i % 10; ctx.fillStyle = i < k ? col.s[0] : col.panel; ctx.globalAlpha = i < k ? 0.7 : 1; ctx.fillRect(ox + c * s + 1, oy + (9 - r) * s + 1, s - 2, s - 2); ctx.globalAlpha = 1; ctx.strokeStyle = col.line; ctx.strokeRect(ox + c * s + 1, oy + (9 - r) * s + 1, s - 2, s - 2); }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(ox, oy, 10 * s, 10 * s);
    text(ctx, k + ' of 100 squares shaded', w / 2, h - 16, { color: col.ink, size: 13, weight: 700, align: 'center' });
  };
  function upd() { out.innerHTML = `${n}/${d} = ${+(n / d).toFixed(4)} as a decimal = ${n}/${d} × 100 = <b>${+(n / d * 100).toFixed(2)}%</b>. Same amount, three disguises.`; cv.redraw(); }
  upd();
}
