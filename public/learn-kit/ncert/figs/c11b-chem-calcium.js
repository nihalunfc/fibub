// Class 11 Biology, Chemical coordination: calcium balance by two opposing hormones. Normal blood calcium is about 9-10.5 mg/dL. If it falls the parathyroid glands release PTH, which frees calcium
// from bone, makes the kidney keep it and (through vitamin D) lets the gut absorb more. If it rises the thyroid's C cells release calcitonin, which slows bone breakdown. Illustrative curves.
import { canvas, text, title, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let ca = 9.8;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Blood calcium against hormone release: parathyroid hormone rises when calcium is low and calcitonin rises when it is high' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Blood calcium', min: 7, max: 12.5, step: 0.1, value: ca, fmt: (v) => v.toFixed(1) + ' mg/dL', oninput: (v) => { ca = v; go(); } });
  const pth = (c) => 1 / (1 + Math.exp((c - 9.3) * 3)), cal = (c) => 1 / (1 + Math.exp(-(c - 10.5) * 3));
  const go = () => { ro.textContent = `Calcium ${ca.toFixed(1)} mg/dL: PTH ${(pth(ca) * 100).toFixed(0)} %, calcitonin ${(cal(ca) * 100).toFixed(0)} %. ` + (ca < 9 ? 'Low: PTH pulls calcium out of bone, the kidney keeps it, and vitamin D helps the gut absorb it, so the level rises.' : ca > 10.5 ? 'High: calcitonin slows bone breakdown and the level falls back.' : 'In the normal band: both hormones are low. Calcium is needed for nerves, muscle contraction and clotting.'); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'PTH up when low, calcitonin up when high', col), A = axes(ctx, w, h, col, { x: [7, 12.5], y: [0, 1], xlabel: 'blood calcium (mg/dL)', ylabel: 'hormone release', l: 48, t: t0 + 8, b: 40, xt: [7, 8, 9, 10, 11, 12], yt: [0, 0.5, 1], fy: (v) => Math.round(v * 100) + '%' });
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.18; ctx.fillRect(A.X(9), A.T, A.X(10.5) - A.X(9), A.B - A.T); ctx.globalAlpha = 1; text(ctx, 'normal', (A.X(9) + A.X(10.5)) / 2, A.T + 10, { color: col.s[2], size: 10, weight: 700, align: 'center' });
    [[pth, col.s[3], 'PTH'], [cal, col.s[0], 'calcitonin']].forEach(([f, c, n]) => { const pts = []; for (let v = 7; v <= 12.5; v += 0.1) pts.push([A.X(v), A.Y(f(v))]); line(ctx, pts, c, 3); dot(ctx, A.X(ca), A.Y(f(ca)), 5.5, c, col.bg); void n; });
    text(ctx, 'PTH', A.X(7.3), A.Y(0.9), { color: col.s[3], size: 11, weight: 700 }); text(ctx, 'calcitonin', A.X(12.4), A.Y(0.9), { color: col.s[0], size: 11, weight: 700, align: 'right' });
    line(ctx, [[A.X(ca), A.T], [A.X(ca), A.B]], col.muted, 1, [3, 3]);
  };
  go();
}
