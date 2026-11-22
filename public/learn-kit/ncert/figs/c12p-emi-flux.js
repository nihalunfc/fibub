// Class 12 Electromagnetic Induction: magnetic flux through a coil, Φ = B A cos θ, where θ is the angle between the field and the coil's normal.
// Seen edge-on, the flux is the number of field lines the coil intercepts: all of them when the coil faces the field (θ = 0), none when it is parallel to it (θ = 90°).
// Spun at constant ω, Φ = BA cos ωt, so ε = −dΦ/dt = BAω sin ωt: the emf curve is the flux curve moved a quarter turn along.
import { canvas, text, title, row, slider, button, readout, arrow, line, dot, axes, loop } from '../../kit.js';
import { rad } from '../c12p-mmlib.js';

export default function (host) {
  let th = 30, B = 0.5, A = 100, spin = false;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'Flux through a coil at different angles to the field' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Angle θ (normal to B)', min: 0, max: 360, step: 1, value: th, fmt: (v) => `${Math.round(v)}°`, oninput: (v) => { th = v; spin = false; } });
  slider(ctl, { label: 'Field B', min: 0.1, max: 1, step: 0.1, value: B, fmt: (v) => `${v.toFixed(1)} T`, oninput: (v) => { B = v; } });
  slider(ctl, { label: 'Coil area A', min: 20, max: 200, step: 10, value: A, fmt: (v) => `${v} cm²`, oninput: (v) => { A = v; } });
  button(ctl, 'Spin / stop', () => { spin = !spin; });
  const out = readout(host);
  loop(host, (dt) => { if (spin) { th = (th + dt * 70) % 360; sl.set(th); } cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Φ = BA cos θ: lines through the coil', col);
    const ht = h * 0.5, cx = w * 0.55, cy = top + (ht - top) / 2 + 2, b = Math.min(ht - top - 16, 110) / 2, a = rad(th), ext = b * Math.abs(Math.cos(a));
    const ys = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => cy + (k * b) / 4.4);
    ys.forEach((y) => { const hit = Math.abs(y - cy) < ext - 0.5; line(ctx, [[10, y], [w - 10, y]], hit ? col.s[1] : col.line, hit ? 2.4 : 1.2); arrow(ctx, w - 40, y, w - 30, y, hit ? col.s[1] : col.line, 1.5, 6); });
    const t = [-Math.sin(a), Math.cos(a)]; line(ctx, [[cx + t[0] * b, cy - t[1] * b], [cx - t[0] * b, cy + t[1] * b]], col.ink, 5);
    arrow(ctx, cx, cy, cx + Math.cos(a) * 46, cy - Math.sin(a) * 46, col.s[3], 3, 9); text(ctx, 'n', cx + Math.cos(a) * 58, cy - Math.sin(a) * 58, { color: col.s[3], size: 13, weight: 700, align: 'center' });
    text(ctx, 'B', 16, cy - b - 6, { color: col.s[0], size: 13, weight: 700 });
    const Phi = B * (A / 1e4) * Math.cos(a);
    out.innerHTML = `Φ = BA cosθ = ${B.toFixed(1)} × ${(A / 1e4).toFixed(4)} × cos ${Math.round(th)}° = <b>${(Phi * 1000).toFixed(2)} mWb</b> (1 Wb = 1 T m²). Lines in colour are the ones passing through the coil; a ${th % 180 === 90 ? 'parallel coil catches none: Φ = 0' : th % 180 === 0 ? 'face-on coil catches the most' : 'tilted coil catches fewer'}. When the coil turns round (θ = 180°), the flux changes sign.`;
    const g = axes(ctx, w, h, col, { x: [0, 360], y: [-1.15, 1.15], t: ht + 10, b: 34, l: 44, r: 12, xt: [0, 90, 180, 270, 360], yt: [-1, 0, 1], fx: (v) => v, fy: (v) => v, xlabel: 'θ = ωt (degrees)' });
    for (const [fn, c, lab] of [[(x) => Math.cos(rad(x)), col.s[0], 'Φ / BA'], [(x) => Math.sin(rad(x)), col.s[1], 'ε / BAω']]) { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 2.3; ctx.beginPath(); for (let k = 0; k <= 72; k++) { const X = g.X(k * 5), Y = g.Y(fn(k * 5)); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); ctx.restore(); dot(ctx, g.X(th), g.Y(fn(th)), 5, c, col.ink); }
    text(ctx, 'Φ / BA', g.L + 6, g.T + 8, { color: col.s[0], size: 10.5, weight: 700 }); text(ctx, 'ε / BAω', g.L + 70, g.T + 8, { color: col.s[1], size: 10.5, weight: 700 });
  };
  cv.redraw();
}
