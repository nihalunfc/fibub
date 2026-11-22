// 1.4 When does the big semicircle vanish? The closed contour is the real segment [-R, R] plus the upper arc of
// radius R. The figure integrates each piece numerically for three integrands and plots |arc integral| against R:
// 1/(z^2+1) falls like 1/R; z/(z^2+1) tends to pi i and never vanishes; z e^{iz}/(z^2+1) vanishes thanks to
// Jordan's lemma even though it only falls like 1/R.
import { canvas, text, line, dot, axes, row, slider, choice, readout, fmt, title } from '../../kit.js';

const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const div = (a, b) => { const m = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / m, (a[1] * b[0] - a[0] * b[1]) / m]; };
const FN = {
  r2: { name: '1/(z²+1)', f: (z) => div([1, 0], [z[0] * z[0] - z[1] * z[1] + 1, 2 * z[0] * z[1]]), res: [0, -0.5] },
  r1: { name: 'z/(z²+1)', f: (z) => div(z, [z[0] * z[0] - z[1] * z[1] + 1, 2 * z[0] * z[1]]), res: [0.5, 0] },
  jl: { name: 'z e^{iz}/(z²+1)', f: (z) => { const e = Math.exp(-z[1]); return mul(div(z, [z[0] * z[0] - z[1] * z[1] + 1, 2 * z[0] * z[1]]), [e * Math.cos(z[0]), e * Math.sin(z[0])]); }, res: [Math.exp(-1) / 2, 0] },
};
const arcInt = (f, R, N = 1500) => { let s = [0, 0]; for (let k = 0; k < N; k++) { const t = ((k + 0.5) / N) * Math.PI, z = [R * Math.cos(t), R * Math.sin(t)], dz = [(-R * Math.sin(t) * Math.PI) / N, (R * Math.cos(t) * Math.PI) / N], v = mul(f(z), dz); s = [s[0] + v[0], s[1] + v[1]]; } return s; };
const lineInt = (f, R, N = 6000) => { let s = [0, 0]; const h = (2 * R) / N; for (let k = 0; k < N; k++) { const v = f([-R + (k + 0.5) * h, 0]); s = [s[0] + v[0] * h, s[1] + v[1] * h]; } return s; };

export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 280, label: 'Upper semicircle contour and a graph of the size of the arc integral against the radius R' });
  let key = 'jl', R = 6;
  const ctl = row(host);
  choice(ctl, 'Integrand', Object.entries(FN).map(([k, v]) => [k, v.name]), key, (v) => { key = v; curve = null; cv.redraw(); upd(); });
  slider(ctl, { label: 'Radius R', min: 1.5, max: 40, step: 0.5, value: R, fmt: (v) => fmt(v, 3), oninput: (v) => { R = v; cv.redraw(); upd(); } });
  const out = readout(host);
  let curve = null;
  const getCurve = () => { if (!curve) { curve = []; for (let r = 1.5; r <= 40.01; r += 0.5) { const a = arcInt(FN[key].f, r, 600); curve.push([r, Math.hypot(...a)]); } } return curve; };
  const c = (z) => `${fmt(Math.abs(z[0]) < 5e-4 ? 0 : z[0], 3)} ${z[1] < 0 ? '−' : '+'} ${fmt(Math.abs(z[1]) < 5e-4 ? 0 : Math.abs(z[1]), 3)}i`;
  const upd = () => {
    const F = FN[key], A = arcInt(F.f, R), L = lineInt(F.f, R), T = [A[0] + L[0], A[1] + L[1]], res2 = [-2 * Math.PI * F.res[1], 2 * Math.PI * F.res[0]];
    const verdict = key === 'r2' ? 'The arc dies like π/R: the real integral equals 2πi Res = π.' : key === 'r1' ? 'The arc tends to πi and never dies: closing the contour does NOT give the real integral (which only exists as a principal value, equal to 0).' : 'The arc dies (Jordan\'s lemma: e^{iz} decays in the upper half-plane), so ∫ x e^{ix}/(x²+1) dx = 2πi Res = iπ/e.';
    out.innerHTML = `Real segment: ${c(L)}. Arc: ${c(A)}. Segment + arc = ${c(T)} = 2πi × Res at i = ${c(res2)} for every R > 1. ${verdict}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = h * 0.5;
    title(ctx, `Closing the contour for ${FN[key].name}`, col);
    // schematic contour, fixed pixel size; pole at i drawn at height 1/R of the radius
    const cx = w / 2, cy = top - 8, rad = Math.min(w * 0.36, top - 46);
    line(ctx, [[cx - rad - 20, cy], [cx + rad + 20, cy]], col.line, 1);
    const pts = []; for (let k = 0; k <= 80; k++) { const t = (k / 80) * Math.PI; pts.push([cx + rad * Math.cos(t), cy - rad * Math.sin(t)]); }
    line(ctx, pts, col.s[1], 3); line(ctx, [[cx - rad, cy], [cx + rad, cy]], col.s[0], 3);
    const py = cy - rad / R; ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - 5, py - 5); ctx.lineTo(cx + 5, py + 5); ctx.moveTo(cx + 5, py - 5); ctx.lineTo(cx - 5, py + 5); ctx.stroke(); ctx.restore();
    text(ctx, 'pole at i', cx + 9, py - 8, { color: col.ink, size: 11, halo: col.panel });
    text(ctx, `−R = −${fmt(R, 3)}`, cx - rad, cy + 12, { color: col.s[0], size: 11, align: 'center', halo: col.panel });
    text(ctx, `R`, cx + rad, cy + 12, { color: col.s[0], size: 11, align: 'center', halo: col.panel });
    text(ctx, 'arc', cx + rad * 0.72, cy - rad * 0.8, { color: col.s[1], size: 12, weight: 700, halo: col.panel });
    // graph of |arc| vs R
    const cvv = getCurve(), ymax = Math.max(0.5, ...cvv.map((p) => p[1])) * 1.1;
    const ax = axes(ctx, w, h, col, { x: [0, 40], y: [0, ymax], t: top + 16, xlabel: 'radius R', ylabel: '|arc integral|' });
    line(ctx, cvv.map(([r, v]) => [ax.X(r), ax.Y(v)]), col.s[1], 2);
    if (key === 'r1') line(ctx, [[ax.X(0), ax.Y(Math.PI)], [ax.X(40), ax.Y(Math.PI)]], col.muted, 1, [4, 4]);
    dot(ctx, ax.X(R), ax.Y(Math.hypot(...arcInt(FN[key].f, R, 600))), 5, col.s[1], col.panel);
  };
  cv.redraw(); upd();
}
