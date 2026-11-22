// Class 12 Electromagnetic Induction: mutual inductance. A changing current in coil 1 makes a changing flux through nearby coil 2 and so an emf ε2 = −M dI1/dt.
// M depends on the coils' geometry and how much of coil 1's flux links coil 2 (the coupling k): pull the coils apart and M falls. This is how a transformer
// works. The emf is a steady square wave when the current is a triangle wave (constant dI/dt).
import { canvas, text, title, row, slider, readout, line, dot, axes, loop } from '../../kit.js';

export default function (host) {
  let d = 0.2, rate = 5, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Two coils: a changing current in one induces an emf in the other' });
  const ctl = row(host);
  slider(ctl, { label: 'Gap between coils', min: 0, max: 1, step: 0.05, value: d, fmt: (x) => (x === 0 ? 'touching' : `${(x * 10).toFixed(1)} cm`), oninput: (x) => { d = x; } });
  slider(ctl, { label: 'Rate of change of I₁', min: 1, max: 10, step: 1, value: rate, fmt: (x) => `${x} A/s`, oninput: (x) => { rate = x; } });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'ε₂ = −M dI₁/dt: coupling falls as they separate', col);
    const k = Math.exp(-d * 2.6), M = 0.2 * k, ht = h * 0.42, cy = top + (ht - top) / 2 + 4, x1 = w * 0.3, x2 = w * 0.3 + 70 + d * 90;
    const coil = (x, c) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); for (let j = 0; j < 5; j++) ctx.ellipse(x + j * 8, cy, 7, 32, 0, 0, 7); ctx.stroke(); ctx.restore(); };
    for (let j = -3; j <= 3; j++) { const y = cy + j * 10, linked = Math.abs(j) <= Math.round(3 * k + 0.2); line(ctx, [[x1 + 36, y], [x2 - 4, y]], linked ? col.s[0] : col.line, linked ? 2 : 1); }
    coil(x1, col.s[1]); coil(x2, col.s[2]); text(ctx, 'coil 1 (I₁)', x1 + 18, cy - 44, { color: col.s[1], size: 10.5, weight: 700, align: 'center' }); text(ctx, 'coil 2 (ε₂)', x2 + 18, cy - 44, { color: col.s[2], size: 10.5, weight: 700, align: 'center' });
    text(ctx, `k = ${k.toFixed(2)}  (fraction of flux that links)`, w / 2, cy + 48, { color: col.muted, size: 10.5, align: 'center' });
    const per = 2, tri = (tt) => { const p = (tt % per) / per; return p < 0.5 ? p * 2 : 2 - p * 2; }, sq = (tt) => ((tt % per) / per < 0.5 ? -1 : 1);
    const g = axes(ctx, w, h, col, { x: [0, 4], y: [-1.3, 1.3], t: ht + 8, b: 34, l: 44, r: 14, xt: [0, 1, 2, 3, 4], fx: (v) => v, yt: [-1, 0, 1], fy: (v) => v, xlabel: 'time (s)' });
    const draw = (fn, c) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 2.3; ctx.beginPath(); for (let j = 0; j <= 200; j++) { const x = j * 0.02, X = g.X(x), Y = g.Y(fn(x)); j ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); ctx.restore(); };
    draw((x) => tri(x), col.s[1]); draw((x) => sq(x) * k * (rate / 10) * 1.0, col.s[2]);
    const tt = t % 4; dot(ctx, g.X(tt), g.Y(tri(tt)), 5, col.s[1], col.ink); dot(ctx, g.X(tt), g.Y(sq(tt) * k * rate / 10), 5, col.s[2], col.ink);
    text(ctx, 'I₁ (rising, falling)', g.L + 6, g.T + 8, { color: col.s[1], size: 10.5, weight: 700 }); text(ctx, 'ε₂ (steady while I₁ is steady)', g.L + 6, g.T + 22, { color: col.s[2], size: 10.5, weight: 700 });
    out.innerHTML = `Here M = k√(L₁L₂) = ${k.toFixed(2)} × 0.2 H = <b>${(M * 1000).toFixed(0)} mH</b>. With dI₁/dt = ${rate} A/s, ε₂ = M dI₁/dt = <b>${(M * rate).toFixed(2)} V</b>; the sign flips when the current starts falling. Pull the coils apart and ε₂ drops; slide them together (or add an iron core) and it rises.`;
  };
  cv.redraw();
}
