// Class 12 Magnetism and Matter: a magnetic dipole (a compass needle or bar magnet) in a uniform field. Torque τ = m B sin θ turns it
// towards B; potential energy U = −m B cos θ is lowest (−mB) when m ∥ B and highest (+mB) when opposite. Released, it swings like a pendulum
// with T = 2π√(J/mB): a stronger field gives a shorter period (J = 0.04 kg m², m = 2 A m²).
import { canvas, text, title, row, slider, button, readout, arrow, axes, line, dot, loop } from '../../kit.js';
import { rad, barMagnet } from '../c12p-mmlib.js';

export default function (host) {
  let th = 120, B = 0.2, free = false, w1 = 0;
  const m = 2, J = 0.04;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'A bar magnet in a uniform field with its potential energy curve' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Angle θ between m and B', min: 0, max: 180, step: 1, value: th, fmt: (x) => `${Math.round(x)}°`, oninput: (x) => { th = x; free = false; w1 = 0; } });
  slider(ctl, { label: 'Field B', min: 0.05, max: 0.5, step: 0.05, value: B, fmt: (x) => `${x.toFixed(2)} T`, oninput: (x) => { B = x; } });
  button(ctl, 'Release', () => { free = true; w1 = 0; });
  const out = readout(host);
  loop(host, (dt) => { if (free) { const K = (m * B) / J; for (let k = 0; k < 8; k++) { const d = dt / 8; w1 += (-K * Math.sin(rad(th)) - 0.35 * w1) * d; th += (w1 * d * 180) / Math.PI; } sl.set(((th % 360) + 360) % 360 > 180 ? 0 : Math.abs(th) % 180); } cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'τ = mB sin θ and U = −mB cos θ', col);
    const ht = h * 0.5, cx = w * 0.58, cy = top + (ht - top) / 2 + 4;
    for (let k = 0; k < 5; k++) arrow(ctx, 14, cy - 60 + k * 30, 62, cy - 60 + k * 30, col.s[0], 1.5, 7); text(ctx, 'B', 38, cy - 76, { color: col.s[0], size: 13, weight: 700, align: 'center' });
    barMagnet(ctx, cx, cy, 100, 22, col, -rad(th));
    const U = -m * B * Math.cos(rad(th)), tau = m * B * Math.sin(rad(th)), T = 2 * Math.PI * Math.sqrt(J / (m * B));
    out.innerHTML = `τ = mB sinθ = <b>${tau.toFixed(3)} N m</b>, U = −mB cosθ = <b>${U.toFixed(3)} J</b> (between ±${(m * B).toFixed(2)} J). For small swings the period is T = 2π√(J/mB) = <b>${T.toFixed(2)} s</b>. Press Release and change B: stronger field, faster swing. Friction slowly settles it at θ = 0.`;
    const g = axes(ctx, w, h, col, { x: [-180, 180], y: [-1.15, 1.15], t: ht + 8, b: 34, l: 52, r: 14, xt: [-180, -90, 0, 90, 180], yt: [-1, -0.5, 0, 0.5, 1], fy: (v) => v.toFixed(1), fx: (v) => v, xlabel: 'θ (degrees)' });
    text(ctx, 'U (joules)', g.L + 6, g.T + 8, { color: col.muted, size: 10 });
    ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; ctx.beginPath(); for (let k = 0; k <= 72; k++) { const x = -180 + k * 5, X = g.X(x), Y = g.Y(-m * B * Math.cos(rad(x))); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); ctx.restore();
    dot(ctx, g.X(th), g.Y(U), 7, col.s[3], col.ink);
  };
  cv.redraw();
}
