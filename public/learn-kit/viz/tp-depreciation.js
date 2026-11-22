// Depreciation compared: straight-line (same amount every year) against written-down value (a fixed percentage of what
// is left). Move cost, scrap value, life and the WDV rate and watch both book-value curves fall. The two methods write
// off the same total only if the WDV rate is chosen to end at scrap value; the readout shows the "matching" rate.
import { canvas, axes, row, slider, choice, readout, line, dot, text, title } from '../kit.js';

const rs = (v) => '₹' + Math.round(v).toLocaleString('en-IN');
export default function (host) {
  let cost = 100000, scrap = 10000, life = 5, rate = 30, yr = 2;
  const cv = canvas(host, { aspect: 0.8, max: 400, min: 300, label: 'Book value of an asset under straight-line and written-down value depreciation' });
  const c = row(host), c2 = row(host);
  slider(c, { label: 'Cost', min: 20000, max: 200000, step: 5000, value: cost, fmt: rs, oninput: (v) => { cost = v; scrap = Math.min(scrap, v * 0.4); cv.redraw(); show(); } });
  slider(c, { label: 'Scrap value', min: 0, max: 40000, step: 1000, value: scrap, fmt: rs, oninput: (v) => { scrap = Math.min(v, cost * 0.4); cv.redraw(); show(); } });
  slider(c2, { label: 'Life (years)', min: 2, max: 10, step: 1, value: life, fmt: (v) => v, oninput: (v) => { life = v; yr = Math.min(yr, v); cv.redraw(); show(); } });
  slider(c2, { label: 'WDV rate %', min: 5, max: 60, step: 1, value: rate, fmt: (v) => v + '%', oninput: (v) => { rate = v; cv.redraw(); show(); } });
  const c3 = row(host);
  slider(c3, { label: 'Look at year', min: 1, max: 10, step: 1, value: yr, fmt: (v) => v, oninput: (v) => { yr = Math.min(v, life); cv.redraw(); show(); } });
  const out = readout(host);
  const slm = (t) => cost - ((cost - scrap) / life) * t, wdv = (t) => cost * Math.pow(1 - rate / 100, t);
  const show = () => {
    const t = Math.min(yr, life), match = (1 - Math.pow(Math.max(scrap, 1) / cost, 1 / life)) * 100;
    out.innerHTML = `Year ${t}: straight-line charge <b>${rs((cost - scrap) / life)}</b>, book value ${rs(slm(t))}. WDV charge <b>${rs(wdv(t - 1) - wdv(t))}</b>, book value ${rs(wdv(t))}. A WDV rate of about ${match.toFixed(1)}% would end exactly at the scrap value in year ${life}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Book value year by year', col);
    const A = axes(ctx, w, h, col, { x: [0, life], y: [0, cost], xlabel: 'Years', ylabel: 'Book value (₹)', xt: Array.from({ length: life + 1 }, (_, i) => i), fy: (v) => v / 1000 + 'k', l: 46 });
    const pts = (f) => Array.from({ length: life * 10 + 1 }, (_, i) => [A.X(i / 10), A.Y(f(i / 10))]);
    line(ctx, pts(slm), col.s[0], 2.5); line(ctx, pts(wdv), col.s[1], 2.5);
    const t = Math.min(yr, life);
    ctx.strokeStyle = col.muted; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(A.X(t), A.T); ctx.lineTo(A.X(t), A.B); ctx.stroke(); ctx.setLineDash([]);
    dot(ctx, A.X(t), A.Y(slm(t)), 5, col.s[0], col.panel); dot(ctx, A.X(t), A.Y(wdv(t)), 5, col.s[1], col.panel);
    text(ctx, 'Straight-line', A.R - 4, A.Y(slm(life)) - 16, { color: col.s[0], size: 11, weight: 700, align: 'right' });
    text(ctx, 'Written-down value', A.R - 4, A.Y(wdv(life)) - 10, { color: col.s[1], size: 11, weight: 700, align: 'right', halo: col.panel });
  };
  show();
}
