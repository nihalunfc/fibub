// Class 12 Moving Charges: the torque on a current loop in a uniform magnetic field, τ = N I A B sin θ (τ = m × B).
// End view: B points right, the loop is seen edge-on, its magnetic moment m = N I A points along the normal. The two long sides
// feel equal and opposite forces (a couple); the sides along m feel none. The torque turns m towards B. Press Release to watch it swing.
import { canvas, text, title, row, slider, button, readout, arrow, line, dot, axes, loop } from '../../kit.js';
import { into, outof, rad, si } from '../c12p-mmlib.js';

export default function (host) {
  let th = 70, N = 50, I = 2, B = 0.4, free = false, w1 = 0;
  const A = 0.002;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'A current loop turning in a magnetic field' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Angle θ between m and B', min: 0, max: 180, step: 1, value: th, fmt: (x) => `${Math.round(x)}°`, oninput: (x) => { th = x; free = false; w1 = 0; } });
  slider(ctl, { label: 'Turns N', min: 10, max: 100, step: 10, value: N, fmt: (x) => `${x}`, oninput: (x) => { N = x; } });
  slider(ctl, { label: 'Current I', min: 0.5, max: 5, step: 0.5, value: I, fmt: (x) => `${x} A`, oninput: (x) => { I = x; } });
  slider(ctl, { label: 'Field B', min: 0.1, max: 1, step: 0.1, value: B, fmt: (x) => `${x.toFixed(1)} T`, oninput: (x) => { B = x; } });
  button(ctl, 'Release the loop', () => { free = true; w1 = 0; });
  const out = readout(host);
  loop(host, (dt) => { if (free) { const K = 30 * (N * I * B) / 10; for (let k = 0; k < 5; k++) { const d = dt / 5; w1 += (-K * Math.sin(rad(th)) - 2.2 * w1) * d; th += (w1 * d * 180) / Math.PI; } if (Math.abs(w1) < 0.01 && Math.abs(th) < 0.5) { free = false; th = 0; } sl.set(Math.min(180, Math.max(0, th))); } cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'τ = N I A B sin θ turns m towards B', col);
    const ht = h * 0.56, cx = w * 0.56, cy = top + (ht - top) / 2 + 4, b = Math.min(ht - top - 40, 110) / 2, a = rad(th);
    const n = [Math.cos(a), Math.sin(a)], tt = [-Math.sin(a), Math.cos(a)];
    for (let k = 0; k < 5; k++) arrow(ctx, 14, cy - 70 + k * 35, 62, cy - 70 + k * 35, col.s[0], 1.5, 7); text(ctx, 'B', 38, cy - 86, { color: col.s[0], size: 13, weight: 700, align: 'center' });
    const P1 = [cx + tt[0] * b, cy - tt[1] * b], P2 = [cx - tt[0] * b, cy + tt[1] * b];
    line(ctx, [P1, P2], col.ink, 3.5);
    outof(ctx, P1[0], P1[1], 7, col.s[2], 2.5); into(ctx, P2[0], P2[1], 7, col.s[2], 2.5);
    const F = N * I * (0.05) * B, Lf = 20 + Math.min(40, F * 3);
    arrow(ctx, P1[0], P1[1], P1[0], P1[1] - Lf, col.s[1], 3, 9); arrow(ctx, P2[0], P2[1], P2[0], P2[1] + Lf, col.s[1], 3, 9);
    text(ctx, 'F', P1[0] + 12, P1[1] - Lf / 2, { color: col.s[1], size: 13, weight: 700 }); text(ctx, 'F', P2[0] + 12, P2[1] + Lf / 2, { color: col.s[1], size: 13, weight: 700 });
    arrow(ctx, cx, cy, cx + n[0] * 70, cy - n[1] * 70, col.s[3], 3, 10); text(ctx, 'm', cx + n[0] * 82, cy - n[1] * 82, { color: col.s[3], size: 14, weight: 700, align: 'center' });
    dot(ctx, cx, cy, 3, col.ink);
    const tau = N * I * A * B * Math.sin(a);
    out.innerHTML = `Loop 5 cm × 4 cm (A = 20 cm²). m = NIA = <b>${(N * I * A).toFixed(2)} A m²</b>. Torque τ = NIAB sinθ = <b>${(tau * 1000).toFixed(1)} mN m</b>${th % 180 < 1 ? ' (zero: m along B; at θ = 0 it is stable, at 180° unstable)' : th > 89 && th < 91 ? ' (the largest value)' : ''}. Dots/crosses are the current in the two long sides.`;
    const g = axes(ctx, w, h, col, { x: [0, 180], y: [0, 1.1], t: ht + 10, b: 34, l: 54, r: 14, xt: [0, 90, 180], yt: [0, 0.5, 1], fy: (v) => v, xlabel: 'θ (degrees)' });
    text(ctx, 'τ / τ max', g.L + 6, g.T + 8, { color: col.muted, size: 10.5 });
    ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; ctx.beginPath(); for (let k = 0; k <= 60; k++) { const x = k * 3, X = g.X(x), Y = g.Y(Math.sin(rad(x))); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); ctx.restore();
    dot(ctx, g.X(Math.min(180, Math.max(0, th))), g.Y(Math.sin(a)), 6, col.s[1], col.ink);
  };
  cv.redraw();
}
