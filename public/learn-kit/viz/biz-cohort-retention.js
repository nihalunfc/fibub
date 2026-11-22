// Cohort retention: the share of each month's new customers still active later. Set how many leave in month 1 and how
// many stay for good. A curve that flattens means a product people keep; one that slides to zero is a leaky bucket.
// The grid under the chart shows six made-up cohorts, each a little better than the one before.
import { canvas, axes, line, text, title, row, slider, readout, choice } from '../kit.js';
import { pct } from './_biz.js';

export default function (host) {
  const cv = canvas(host, { aspect: 1.0, max: 460, min: 330, label: 'Retention curve and cohort grid' });
  let mode = 'custom';
  const ctl = row(host), ctl2 = row(host);
  const P = { custom: null, leaky: [0.4, 0], flat: [0.35, 0.3], sticky: [0.15, 0.6] };
  choice(ctl, 'Example', [['custom', 'My numbers'], ['leaky', 'Leaky bucket'], ['flat', 'Flattens'], ['sticky', 'Sticky']], mode, (v) => { mode = v; if (P[v]) { S.drop.set(P[v][0]); S.floor.set(P[v][1]); } cv.redraw(); });
  const S = {
    drop: slider(ctl2, { label: 'Leave in month 1', min: 0.05, max: 0.7, step: 0.01, value: 0.35, fmt: (v) => pct(v), oninput: () => { mode = 'custom'; cv.redraw(); } }),
    floor: slider(ctl2, { label: 'Stay for good', min: 0, max: 0.8, step: 0.01, value: 0.3, fmt: (v) => pct(v), oninput: () => { mode = 'custom'; cv.redraw(); } }),
  };
  const out = readout(host), N = 12;
  const R = (t, d = S.drop.value, f = S.floor.value) => (t === 0 ? 1 : Math.max(f, Math.min(1, f + (1 - f) * Math.pow(Math.max(0, 1 - d / Math.max(1 - f, 0.01)), t))));
  cv.draw = (ctx, w, h, col) => {
    const d = S.drop.value, f = S.floor.value, top = h * 0.56;
    title(ctx, 'Share of a cohort still active', col);
    const a = axes(ctx, w, top, col, { t: 34, x: [0, N], y: [0, 1], xlabel: 'Months since joining', ylabel: 'Still active', fy: (v) => Math.round(v * 100) + '%', b: 36, xt: [0, 2, 4, 6, 8, 10, 12] });
    line(ctx, Array.from({ length: N + 1 }, (_, t) => [a.X(t), a.Y(R(t))]), col.s[0], 3);
    line(ctx, [[a.X(0), a.Y(f)], [a.X(N), a.Y(f)]], col.muted, 1.2, [3, 4]);
    text(ctx, 'long-run floor', a.R - 4, a.Y(f) - 8, { color: col.muted, size: 10, align: 'right' });
    // cohort grid
    const gy = top + 6, cw = (w - 64) / 7, rh = Math.min(22, (h - gy - 40) / 6);
    text(ctx, 'Six cohorts (each a bit better than the last)', 10, gy + 6, { color: col.ink, size: 11, weight: 700 });
    for (let c = 0; c < 6; c++) {
      text(ctx, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][c], 8, gy + 24 + c * rh + rh / 2, { color: col.muted, size: 10, fit: false });
      for (let t = 0; t <= 6 - c - 1 + 0; t++) {
        const v = R(t, Math.max(0.02, d * (1 - 0.06 * c)), Math.min(0.95, f + 0.02 * c)), x = 40 + t * cw;
        ctx.globalAlpha = 0.12 + 0.88 * v; ctx.fillStyle = col.s[0]; ctx.fillRect(x, gy + 18 + c * rh, cw - 2, rh - 2); ctx.globalAlpha = 1;
        text(ctx, Math.round(v * 100) + '', x + cw / 2 - 1, gy + 18 + c * rh + rh / 2, { color: v > 0.55 ? col.bg : col.ink, size: 10, align: 'center', fit: false });
      }
    }
    text(ctx, 'Columns: months since joining, 0 to 5', 40, h - 8, { color: col.muted, size: 10, fit: false });
    out.innerHTML = `Of 100 people who join, about <b>${Math.round(R(1) * 100)}</b> are left after 1 month, <b>${Math.round(R(6) * 100)}</b> after 6 and <b>${Math.round(R(12) * 100)}</b> after a year. ` + (f < 0.05 ? '<b>This curve heads to zero: the bucket leaks.</b> Fix the product before buying more customers.' : `<b>It flattens near ${pct(f)}</b>: that group is your real customer base, and the rest of the business can grow on top of it.`);
  };
  cv.redraw();
}
