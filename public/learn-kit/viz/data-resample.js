// resample() turns many small time steps into fewer bigger ones: 90 days of made-up sales become weekly or monthly
// bars using sum, mean or max. Try: switch the rule and the aggregate, and watch why a weekly SUM of a month with a
// short last week looks lower (partial period) while the mean does not.
import { canvas, text, row, choice, readout, title, axes, rng } from '../kit.js';

const r = rng(21), DAYS = 90;
const daily = Array.from({ length: DAYS }, (_, i) => Math.round(40 + 12 * Math.sin((i / 7) * 2 * Math.PI) + i * 0.25 + (r() - 0.5) * 16));
const MON = [31, 28, 31]; // Jan Feb Mar (2025)
export default function (host) {
  let rule = 'W', agg = 'sum';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Daily bars grouped into weekly or monthly bars' });
  const c1 = row(host); choice(c1, 'Rule', [['D', 'daily'], ['W', 'weekly ("W")'], ['M', 'monthly ("ME")']], rule, (v) => { rule = v; draw(); });
  const c2 = row(host); choice(c2, 'Aggregate', [['sum', 'sum'], ['mean', 'mean'], ['max', 'max']], agg, (v) => { agg = v; draw(); });
  const out = readout(host);
  function groups() {
    if (rule === 'D') return daily.map((_, i) => [i, i + 1]);
    if (rule === 'W') { const g = []; for (let s = 0; s < DAYS; s += 7) g.push([s, Math.min(DAYS, s + 7)]); return g; }
    const g = []; let s = 0; for (const m of MON) { g.push([s, s + m]); s += m; } if (s < DAYS) g.push([s, DAYS]); return g;
  }
  const val = (a, b) => { const v = daily.slice(a, b); return agg === 'sum' ? v.reduce((x, y) => x + y, 0) : agg === 'mean' ? v.reduce((x, y) => x + y, 0) / v.length : Math.max(...v); };
  function draw() { const g = groups(); out.innerHTML = `<code>df.resample("${rule === 'M' ? 'ME' : rule}").${agg}()</code> turns <b>${DAYS}</b> daily rows into <b>${g.length}</b>. ${rule === 'W' ? 'The last week has only ' + (DAYS % 7 || 7) + ' days, so its sum is lower, which is the partial-period trap.' : rule === 'M' ? 'Months have 31, 28 and 31 days, so sums differ even when the daily level is steady.' : 'Daily: nothing is combined yet.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const g = groups(), vs = g.map(([a, b]) => val(a, b)), top = Math.max(...vs) * 1.12;
    const ax = axes(ctx, w, h, col, { x: [0, DAYS], y: [0, top], xlabel: 'day of the quarter (made-up data)', l: 44, t: 26, xt: [0, 30, 60, 90] });
    title(ctx, 'Daily values and the resampled bars', col);
    ctx.save(); ax.clip();
    if (rule !== 'D') daily.forEach((v, i) => { ctx.fillStyle = col.line; const yy = ax.Y(Math.min(v, top)); ctx.fillRect(ax.X(i) + 0.5, yy, Math.max(1, ax.X(1) - ax.X(0) - 1), ax.B - yy); });
    g.forEach(([a, b], i) => { ctx.fillStyle = col.s[i % 3 === 0 ? 0 : i % 3 === 1 ? 2 : 1]; ctx.globalAlpha = rule === 'D' ? 1 : 0.8; const yy = ax.Y(vs[i]); ctx.fillRect(ax.X(a) + 1, yy, Math.max(1, ax.X(b) - ax.X(a) - 2), ax.B - yy); });
    ctx.restore(); ctx.globalAlpha = 1;
  };
  draw();
}
