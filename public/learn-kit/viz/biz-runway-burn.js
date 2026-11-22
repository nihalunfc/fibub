// Runway burn-down: cash left each month = cash + sales - costs. Set your cash, costs, current sales and how fast sales
// grow, then press Play to watch the balance run down. The red line is the month cash would hit zero ("runway").
import { canvas, axes, line, dot, text, title, row, slider, readout, loop, button } from '../kit.js';
import { money, short } from './_biz.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.74, max: 410, label: 'Cash balance falling month by month' });
  let m = 0;
  const ctl = row(host);
  const S = {
    cash: slider(ctl, { label: 'Cash in bank', min: 20000, max: 500000, step: 5000, value: 120000, fmt: short, oninput: () => { m = 0; cv.redraw(); } }),
    cost: slider(ctl, { label: 'Costs a month', min: 5000, max: 60000, step: 1000, value: 18000, fmt: short, oninput: () => { m = 0; cv.redraw(); } }),
    rev: slider(ctl, { label: 'Sales now a month', min: 0, max: 40000, step: 500, value: 4000, fmt: short, oninput: () => { m = 0; cv.redraw(); } }),
    g: slider(ctl, { label: 'Sales growth a month', min: 0, max: 0.2, step: 0.005, value: 0.06, fmt: (v) => (v * 100).toFixed(1) + '%', oninput: () => { m = 0; cv.redraw(); } }),
  };
  const out = readout(host), N = 36;
  const sim = () => { const pts = [[0, S.cash.value]]; let c = S.cash.value, zero = null, r = S.rev.value; for (let k = 1; k <= N; k++) { c += r - S.cost.value; r *= 1 + S.g.value; pts.push([k, c]); if (zero === null && c <= 0) zero = k; } return { pts, zero }; };
  const anim = loop(host, (dt) => { m = Math.min(N, m + dt * 5); cv.redraw(); });
  anim.button(ctl); button(ctl, 'Restart', () => { m = 0; anim.play(); });
  cv.draw = (ctx, w, h, col) => {
    const { pts, zero } = sim(), lo = Math.min(0, ...pts.map((p) => p[1])), hi = Math.max(...pts.map((p) => p[1]), 1);
    title(ctx, 'Cash in the bank, month by month', col);
    const a = axes(ctx, w, h, col, { t: 34, x: [0, N], y: [lo * 1.05, hi * 1.08], xlabel: 'Months from today', ylabel: 'Cash', fy: short, xt: [0, 6, 12, 18, 24, 30, 36] });
    line(ctx, [[a.L, a.Y(0)], [a.R, a.Y(0)]], col.ink, 1.5);
    const shown = pts.filter((p) => p[0] <= m);
    const f = m % 1; // partial segment
    if (m < N && Math.floor(m) < N) { const p0 = pts[Math.floor(m)], p1 = pts[Math.floor(m) + 1]; shown.push([m, p0[1] + (p1[1] - p0[1]) * f]); }
    line(ctx, pts.map(([k, v]) => [a.X(k), a.Y(v)]), col.line, 2);
    line(ctx, shown.map(([k, v]) => [a.X(k), a.Y(v)]), col.s[0], 3.5);
    const cur = shown[shown.length - 1];
    dot(ctx, a.X(cur[0]), a.Y(cur[1]), 5, cur[1] < 0 ? col.bad : col.s[0], col.panel);
    if (zero) { line(ctx, [[a.X(zero), a.T], [a.X(zero), a.B]], col.bad, 1.5, [4, 3]); text(ctx, `cash runs out: month ${zero}`, a.X(zero) - 6, a.T + 10, { color: col.bad, size: 11, weight: 700, align: zero > N * 0.6 ? 'right' : 'left' }); }
    const net = S.rev.value - S.cost.value;
    out.innerHTML = `Month <b>${m.toFixed(0)}</b>: cash <b style="color:${cur[1] < 0 ? col.bad : col.ink}">${money(cur[1])}</b>. Burn today = ${money(S.cost.value)} − ${money(S.rev.value)} = <b>${money(-net)} a month</b>. ` + (zero ? `Runway: <b>${zero} months</b>. Press Restart, or lift growth or cut costs to push the line out.` : `<b style="color:${col.good}">Cash never reaches zero in 3 years.</b>`);
  };
  cv.redraw();
}
