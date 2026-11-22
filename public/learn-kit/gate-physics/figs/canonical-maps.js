// 2.3 What a transformation does to a patch of phase space. A square patch of (q, p) is mapped by the chosen
// transformation; canonical maps keep its area ({Q, P} = 1), non-canonical ones do not. The pendulum flow (time
// evolution under H = p²/2 − cos q, by RK4) is a non-linear canonical map: the patch shears and curls but keeps its area.
import { canvas, axes, line, text, title, row, slider, choice, readout, fmt } from '../../kit.js';

const MAPS = {
  rot: { name: 'Rotation (canonical)', f: (q, p, s) => [q * Math.cos(s) + p * Math.sin(s), -q * Math.sin(s) + p * Math.cos(s)], pb: () => 1, label: 'Q = q cos s + p sin s, P = −q sin s + p cos s' },
  shear: { name: 'Shear', f: (q, p, s) => [q + s * p, p], pb: () => 1, label: 'Q = q + s p, P = p' },
  squeeze: { name: 'Squeeze', f: (q, p, s) => [q * Math.exp(s), p * Math.exp(-s)], pb: () => 1, label: 'Q = e^s q, P = e^−s p' },
  scale: { name: 'Scale both (not canonical)', f: (q, p, s) => [q * Math.exp(s / 2), p * Math.exp(s / 2)], pb: (s) => Math.exp(s), label: 'Q = e^(s/2) q, P = e^(s/2) p' },
  flow: { name: 'Pendulum flow', f: null, pb: () => 1, label: 'time evolution for time 3s under H = p²/2 − cos q' },
};

function evolve(q, p, T) {
  const n = Math.max(1, Math.ceil(Math.abs(T) / 0.02)), h = T / n;
  for (let i = 0; i < n; i++) {
    const a1 = p, b1 = -Math.sin(q), a2 = p + h / 2 * b1, b2 = -Math.sin(q + h / 2 * a1), a3 = p + h / 2 * b2, b3 = -Math.sin(q + h / 2 * a2), a4 = p + h * b3, b4 = -Math.sin(q + h * a3);
    q += h / 6 * (a1 + 2 * a2 + 2 * a3 + a4); p += h / 6 * (b1 + 2 * b2 + 2 * b3 + b4);
  }
  return [q, p];
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'A square patch of phase space and its image under a transformation' });
  let kind = 'shear', s = 0.8;
  const ctl = row(host);
  choice(ctl, 'Map', Object.entries(MAPS).map(([k, v]) => [k, v.name]), kind, (v) => { kind = v; cv.redraw(); });
  slider(ctl, { label: 'Strength or time s', min: 0, max: 1.5, step: 0.01, value: s, fmt: (x) => fmt(x, 3), oninput: (x) => { s = x; cv.redraw(); } });
  const out = readout(host);
  // patch boundary: square [0.3, 1.1] × [−0.4, 0.4], sampled densely so curved images stay smooth
  const q0 = 0.3, q1 = 1.1, p0 = -0.4, p1 = 0.4, N = 40;
  const boundary = [];
  for (let i = 0; i < N; i++) boundary.push([q0 + (q1 - q0) * i / N, p0]);
  for (let i = 0; i < N; i++) boundary.push([q1, p0 + (p1 - p0) * i / N]);
  for (let i = 0; i < N; i++) boundary.push([q1 - (q1 - q0) * i / N, p1]);
  for (let i = 0; i < N; i++) boundary.push([q0, p1 - (p1 - p0) * i / N]);
  const area = (pts) => Math.abs(pts.reduce((a, [x, y], i) => { const [x2, y2] = pts[(i + 1) % pts.length]; return a + x * y2 - x2 * y; }, 0)) / 2;
  cv.draw = (ctx, W, H, col) => {
    const m = MAPS[kind];
    const img = boundary.map(([q, p]) => (kind === 'flow' ? evolve(q, p, 3 * s) : m.f(q, p, s)));
    title(ctx, 'A patch of phase space under a map', col);
    const ax = axes(ctx, W, H, col, { x: [-2.5, 2.5], y: [-1.8, 1.8], xlabel: 'q (old) and Q (new)', ylabel: 'p and P', t: 30 });
    ctx.save(); ax.clip();
    const toPx = (pts) => pts.map(([x, y]) => [ax.X(x), ax.Y(y)]);
    const fill = (pts, color, alpha) => { ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.beginPath(); toPx(pts).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); ctx.restore(); };
    fill(boundary, col.s[2], 0.18); line(ctx, toPx([...boundary, boundary[0]]), col.s[2], 1.5, [4, 3]);
    fill(img, col.s[0], 0.3); line(ctx, toPx([...img, img[0]]), col.s[0], 2);
    ctx.restore();
    text(ctx, 'dashed: original patch', ax.L + 6, ax.T + 10, { color: col.s[2], size: 11, weight: 600 });
    text(ctx, 'solid: its image', ax.L + 6, ax.T + 26, { color: col.s[0], size: 11, weight: 600 });
    const A0 = area(boundary), A1 = area(img);
    out.innerHTML = `${m.label}. Area ratio new/old = <b>${fmt(A1 / A0, 4)}</b>; {Q, P} = <b>${fmt(m.pb(s), 4)}</b>. ${Math.abs(m.pb(s) - 1) < 1e-9 ? 'Canonical: the area is kept, whatever the shape does.' : 'Not canonical: the area changes by the factor {Q, P}.'}`;
  };
  cv.redraw();
}
