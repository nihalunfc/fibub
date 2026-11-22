// 1.3 Cauchy's theorem, seen numerically. A circular contour (centre and radius set by sliders) is laid over a function
// with three simple poles. The figure adds up f(z) dz round the circle (720 steps) and compares it with 2 pi i times the
// residues of the poles inside. With no pole inside the integral is zero, however the circle is moved.
import { canvas, text, line, dot, row, slider, choice, readout, fmt, title } from '../../kit.js';

const POLES = [[0, 0], [1.2, 0.8], [-1.4, -0.6]];
const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const div = (a, b) => { const m = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / m, (a[1] * b[0] - a[0] * b[1]) / m]; };
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const RES = POLES.map((p, k) => POLES.reduce((acc, q, j) => (j === k ? acc : div(acc, sub(p, q))), [1, 0]));

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 260, label: 'A circular contour in the complex plane over a function with three poles; the integral counts the poles inside' });
  let X0 = 0.3, Y0 = 0.2, R = 0.8, fn = 'poles';
  const ctl = row(host);
  choice(ctl, 'Function', [['poles', 'Three simple poles'], ['entire', 'Entire: e^z']], fn, (v) => { fn = v; cv.redraw(); upd(); });
  slider(ctl, { label: 'Centre, real part', min: -2, max: 2, step: 0.05, value: X0, fmt: (v) => fmt(v, 2), oninput: (v) => { X0 = v; cv.redraw(); upd(); } });
  slider(ctl, { label: 'Centre, imaginary part', min: -1.5, max: 1.5, step: 0.05, value: Y0, fmt: (v) => fmt(v, 2), oninput: (v) => { Y0 = v; cv.redraw(); upd(); } });
  slider(ctl, { label: 'Radius', min: 0.2, max: 3, step: 0.05, value: R, fmt: (v) => fmt(v, 2), oninput: (v) => { R = v; cv.redraw(); upd(); } });
  const out = readout(host);
  const f = (z) => (fn === 'entire' ? [Math.exp(z[0]) * Math.cos(z[1]), Math.exp(z[0]) * Math.sin(z[1])] : POLES.reduce((acc, p) => div(acc, sub(z, p)), [1, 0]));
  const integral = () => {
    const N = 720; let s = [0, 0];
    for (let k = 0; k < N; k++) {
      const t = ((k + 0.5) / N) * 2 * Math.PI, z = [X0 + R * Math.cos(t), Y0 + R * Math.sin(t)], dz = [(-R * Math.sin(t) * 2 * Math.PI) / N, (R * Math.cos(t) * 2 * Math.PI) / N];
      const v = mul(f(z), dz); s = [s[0] + v[0], s[1] + v[1]];
    }
    return s;
  };
  const inside = () => (fn === 'entire' ? [] : POLES.map((p, k) => ({ k, d: Math.hypot(p[0] - X0, p[1] - Y0) })).filter((o) => o.d < R));
  const upd = () => {
    const I = integral(), ins = inside(), near = fn === 'poles' && POLES.some((p) => Math.abs(Math.hypot(p[0] - X0, p[1] - Y0) - R) < 0.06);
    const sum = ins.reduce((acc, o) => [acc[0] + RES[o.k][0], acc[1] + RES[o.k][1]], [0, 0]);
    const pred = [-2 * Math.PI * sum[1], 2 * Math.PI * sum[0]];
    const c = (z) => `${fmt(z[0], 3)} ${z[1] < 0 ? '−' : '+'} ${fmt(Math.abs(z[1]), 3)}i`;
    out.innerHTML = near ? '<b>A pole sits on the contour: the integral is not defined there (move the circle).</b>'
      : `Numerical ∮ f(z) dz = ${c(I.map((x) => (Math.abs(x) < 5e-4 ? 0 : x)))}. Poles inside: ${ins.length ? ins.map((o) => 'z' + (o.k + 1)).join(', ') : 'none'}; 2πi × (sum of their residues) = ${c(pred.map((x) => (Math.abs(x) < 5e-4 ? 0 : x)))}. ${ins.length ? '' : 'Nothing singular inside, so Cauchy\'s theorem gives 0.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const S = Math.min(w, h) / 6.6, cx = w / 2, cy = h / 2 + 8;
    const P = (x, y) => [cx + x * S, cy - y * S];
    title(ctx, fn === 'entire' ? 'e^z has no singularities: every loop gives 0' : 'The loop only sees the poles inside it', col);
    line(ctx, [P(-3.3, 0), P(3.3, 0)], col.line, 1); line(ctx, [P(0, -2.6), P(0, 2.6)], col.line, 1);
    text(ctx, 'Re z', ...P(3.0, -0.2), { color: col.muted, size: 11 }); text(ctx, 'Im z', ...P(0.1, 2.4), { color: col.muted, size: 11 });
    const pts = []; for (let k = 0; k <= 160; k++) { const t = (k / 160) * 2 * Math.PI; pts.push(P(X0 + R * Math.cos(t), Y0 + R * Math.sin(t))); }
    line(ctx, pts, col.s[0], 2.5);
    // direction arrow head at the top of the circle (anticlockwise)
    const [ax, ay] = P(X0, Y0 + R); ctx.save(); ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(ax - 7, ay); ctx.lineTo(ax + 3, ay - 5); ctx.lineTo(ax + 3, ay + 5); ctx.closePath(); ctx.fill(); ctx.restore();
    if (fn === 'poles') POLES.forEach((p, k) => {
      const inn = Math.hypot(p[0] - X0, p[1] - Y0) < R;
      const [x, y] = P(...p); ctx.save(); ctx.strokeStyle = inn ? col.s[1] : col.muted; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(x - 6, y - 6); ctx.lineTo(x + 6, y + 6); ctx.moveTo(x + 6, y - 6); ctx.lineTo(x - 6, y + 6); ctx.stroke(); ctx.restore();
      text(ctx, `z${k + 1}`, x + 8, y - 10, { color: inn ? col.s[1] : col.muted, size: 12, weight: 700, halo: col.panel });
    });
    dot(ctx, ...P(X0, Y0), 3, col.s[0]);
    text(ctx, fn === 'poles' ? '× poles (coloured when enclosed, grey when outside)' : 'f(z) = e^z is analytic everywhere', 8, h - 10, { color: col.muted, size: 11, base: 'bottom' });
  };
  cv.redraw(); upd();
}
