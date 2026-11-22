// Monthly recurring revenue (MRR) with churn: each month you lose a share of what you have and add new subscriptions.
// Press Play to watch the months go by. Without growth in new sales, MRR levels off at new ÷ churn; to keep climbing, new
// sales must grow, or churn must fall.
import { canvas, axes, line, dot, text, title, row, slider, readout, loop, button } from '../kit.js';
import { short } from './_biz.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.76, max: 410, label: 'MRR over 36 months with churn' });
  let m = 0;
  const reset = () => { m = 0; cv.redraw(); };
  const ctl = row(host);
  const S = {
    start: slider(ctl, { label: 'MRR today', min: 0, max: 20000, step: 500, value: 2000, fmt: short, oninput: reset }),
    add: slider(ctl, { label: 'New MRR a month', min: 100, max: 3000, step: 50, value: 600, fmt: short, oninput: reset }),
    churn: slider(ctl, { label: 'Churn a month', min: 0, max: 0.15, step: 0.0025, value: 0.05, fmt: (v) => (v * 100).toFixed(1) + '%', oninput: reset }),
    gr: slider(ctl, { label: 'New sales grow by', min: 0, max: 0.1, step: 0.005, value: 0, fmt: (v) => (v * 100).toFixed(1) + '% a mo', oninput: reset }),
  };
  const out = readout(host), N = 36;
  const run = (churn) => { const a = [S.start.value]; let add = S.add.value; for (let k = 1; k <= N; k++) { a.push(a[k - 1] * (1 - churn) + add); add *= 1 + S.gr.value; } return a; };
  const anim = loop(host, (dt) => { m = Math.min(N, m + dt * 6); cv.redraw(); });
  anim.button(ctl); button(ctl, 'Restart', () => { m = 0; anim.play(); });
  cv.draw = (ctx, w, h, col) => {
    const a = run(S.churn.value), b = run(0), hi = Math.max(...b) * 1.05;
    title(ctx, 'MRR, with and without churn', col);
    const ax = axes(ctx, w, h, col, { t: 34, x: [0, N], y: [0, hi], xlabel: 'Months from today', ylabel: 'MRR', fy: short, xt: [0, 6, 12, 18, 24, 30, 36] });
    line(ctx, b.map((v, k) => [ax.X(k), ax.Y(v)]), col.muted, 1.5, [5, 4]);
    text(ctx, 'if nobody left', ax.X(N) - 4, ax.Y(b[N]) + 12, { color: col.muted, size: 10, align: 'right' });
    const k = Math.floor(m), pts = a.slice(0, k + 1).map((v, i) => [ax.X(i), ax.Y(v)]);
    if (k < N) pts.push([ax.X(m), ax.Y(a[k] + (a[k + 1] - a[k]) * (m - k))]);
    line(ctx, pts, col.s[0], 3.5);
    const e = pts[pts.length - 1]; dot(ctx, e[0], e[1], 5, col.s[0], col.panel);
    const cap = S.churn.value > 0 && S.gr.value === 0 ? S.add.value / S.churn.value : null;
    if (cap && cap < hi) { line(ctx, [[ax.L, ax.Y(cap)], [ax.R, ax.Y(cap)]], col.s[1], 1.5, [2, 4]); text(ctx, `ceiling ${short(cap)}`, ax.L + 6, ax.Y(cap) - 9, { color: col.s[1], size: 10, weight: 700 }); }
    const i = Math.round(m);
    out.innerHTML = `Month <b>${i}</b>: MRR <b>${short(a[i])}</b> (a year of it is ${short(a[i] * 12)}). Month 12: ${short(a[12])}; month 36: ${short(a[36])}.` + (cap ? ` With flat new sales the line can never pass <b>${short(cap)}</b> (new ÷ churn = ${short(S.add.value)} ÷ ${(S.churn.value * 100).toFixed(1)}%).` : S.churn.value === 0 ? ' No churn: every sale stays.' : ' New sales are growing, so there is no fixed ceiling.');
  };
  cv.redraw();
}
