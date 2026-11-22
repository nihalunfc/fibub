// Unit economics of one customer: gross profit earned each month (some customers leave) against what it cost to win
// them (CAC). The curve crosses CAC at the payback month and levels off at lifetime value (LTV = monthly profit ÷ churn).
// Try: raise churn from 3% to 10% and watch LTV and the LTV:CAC ratio fall.
import { canvas, axes, line, dot, text, title, row, slider, readout } from '../kit.js';
import { money } from './_biz.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.74, max: 410, label: 'Cumulative gross profit per customer against CAC' });
  const ctl = row(host);
  const S = {
    price: slider(ctl, { label: 'Price a month', min: 5, max: 100, step: 1, value: 30, fmt: (v) => '$' + v, oninput: () => cv.redraw() }),
    gm: slider(ctl, { label: 'Gross margin', min: 0.2, max: 0.95, step: 0.01, value: 0.7, fmt: (v) => Math.round(v * 100) + '%', oninput: () => cv.redraw() }),
    churn: slider(ctl, { label: 'Churn a month', min: 0.01, max: 0.3, step: 0.005, value: 0.05, fmt: (v) => (v * 100).toFixed(1) + '%', oninput: () => cv.redraw() }),
    cac: slider(ctl, { label: 'CAC (cost to win)', min: 20, max: 800, step: 10, value: 150, fmt: (v) => '$' + v, oninput: () => cv.redraw() }),
  };
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const p = S.price.value, g = S.gm.value, c = S.churn.value, cac = S.cac.value, m = p * g, ltv = m / c, N = 36;
    const pts = []; let cum = 0, pay = null;
    for (let k = 0; k <= N; k++) { if (k > 0) cum += m * Math.pow(1 - c, k - 1); pts.push([k, cum]); if (pay === null && cum >= cac) pay = k; }
    const yMax = Math.max(cac, ltv, pts[N][1]) * 1.12;
    title(ctx, 'What one customer earns you, month by month', col);
    const a = axes(ctx, w, h, col, { t: 34, x: [0, N], y: [0, yMax], xlabel: 'Months since the customer joined', ylabel: 'Gross profit', fy: (t) => '$' + t, xt: [0, 6, 12, 18, 24, 30, 36] });
    line(ctx, [[a.X(0), a.Y(cac)], [a.X(N), a.Y(cac)]], col.bad, 2, [6, 4]);
    text(ctx, `CAC $${cac}`, a.R - 4, a.Y(cac) - 9, { color: col.bad, size: 11, weight: 700, align: 'right' });
    line(ctx, [[a.X(0), a.Y(ltv)], [a.X(N), a.Y(ltv)]], col.muted, 1.5, [2, 4]);
    text(ctx, `LTV $${Math.round(ltv)} (forever)`, a.L + 6, a.Y(ltv) - 9, { color: col.muted, size: 10, weight: 600 });
    line(ctx, pts.map(([k, v]) => [a.X(k), a.Y(v)]), col.s[0], 3);
    if (pay) { dot(ctx, a.X(pay), a.Y(pts[pay][1]), 6, col.good, col.panel); text(ctx, `paid back in month ${pay}`, a.X(pay) + 8, a.Y(pts[pay][1]) + 16, { color: col.good, size: 11, weight: 700, halo: col.panel }); }
    else text(ctx, 'Not paid back within 3 years', a.R - 6, a.Y(0) - 14, { color: col.bad, size: 11, weight: 700, align: 'right' });
    const r = ltv / cac;
    out.innerHTML = `Each customer leaves <b>${money(m, 2)}</b> of gross profit a month and stays about <b>${(1 / c).toFixed(1)} months</b> (1 ÷ churn). <b>LTV = ${money(m, 2)} ÷ ${(c * 100).toFixed(1)}% = ${money(ltv)}</b>. LTV : CAC = <b style="color:${r >= 3 ? col.good : r >= 1 ? col.warn : col.bad}">${r.toFixed(1)} : 1</b> (a common rule of thumb is 3 : 1 or better). Simple payback = ${money(cac)} ÷ ${money(m, 2)} = ${(cac / m).toFixed(1)} months.`;
  };
  cv.redraw();
}
