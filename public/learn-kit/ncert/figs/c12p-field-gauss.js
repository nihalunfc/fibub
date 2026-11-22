// Class 12 Electric Charges and Fields: Gauss's law tested numerically. A positive charge sits on the x-axis; the closed surface is a sphere
// (drawn as a circle). The flux of E through the whole sphere is computed by adding up E.n dA over thin rings (2000 of them). Move the charge:
// the answer is q/eps0 (here 1.00 in units of q/eps0) whenever it is inside, wherever it sits, and 0 when it is outside, because every line that
// enters also leaves. Green arrows go out through the surface, orange ones come in.
import { canvas, text, title, dot, arrow, row, slider, readout } from '../../kit.js';

export default function (host) {
  let d = 0.4, q = 1;
  const R = 1;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 280, label: 'A charge near a spherical surface and the total flux through it' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'charge position x (sphere radius = 1)', min: -2.2, max: 2.2, step: 0.05, value: d, fmt: (v) => v.toFixed(2), oninput: (v) => { d = v; go(); } });
  slider(ctl, { label: 'charge q (µC)', min: 1, max: 3, step: 1, value: q, fmt: (v) => v.toFixed(0), oninput: (v) => { q = v; go(); } });
  const flux = () => { let s = 0; const N = 2000; for (let i = 0; i < N; i++) { const ph = (i + 0.5) / N * Math.PI, X = R * Math.cos(ph), Y = R * Math.sin(ph), dx = X - d, r2 = dx * dx + Y * Y, e = 1 / (4 * Math.PI * r2 ** 1.5), en = e * (dx * Math.cos(ph) + Y * Math.sin(ph)); s += en * 2 * Math.PI * R * R * Math.sin(ph) * (Math.PI / N); } return s; };
  const go = () => { const f = flux(), inside = Math.abs(d) < R; ro.textContent = `Net flux through the sphere = ${f.toFixed(3)} × q/ε₀ (added up numerically). Charge is ${inside ? 'inside' : 'outside'}: ${inside ? `Φ = q/ε₀ = ${(q * 1e-6 / 8.854e-12 / 1e3).toFixed(1)} × 10³ N m²/C` : 'Φ = 0'}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Flux through a closed surface depends only on the charge inside', col) + 4;
    const cx = w / 2, cy = (top + h) / 2 + 4, s = Math.min(w / 6, (h - top) / 2.6), px = cx + d * s, py = cy;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx, cy, R * s, 0, 7); ctx.stroke();
    for (let k = 0; k < 24; k++) {
      const a = k / 24 * 2 * Math.PI, X = cx + R * s * Math.cos(a), Y = cy + R * s * Math.sin(a), dx = X - px, dy = Y - py, r = Math.hypot(dx, dy), m = Math.min(30, 20 * q * (s / r) * (s / r));
      const out = (dx * Math.cos(a) + dy * Math.sin(a)) > 0, ex = dx / r * m, ey = dy / r * m, c = out ? col.s[2] : col.s[3];
      arrow(ctx, X - ex / 2, Y - ey / 2, X + ex / 2, Y + ey / 2, c, 2, 5);
    }
    dot(ctx, px, py, 9 + q * 1.5, col.s[2], col.panel); text(ctx, '+', px, py, { color: col.panel, size: 13, weight: 700, align: 'center' });
    text(ctx, 'closed surface', cx, cy + R * s + 16, { color: col.muted, size: 11, align: 'center' });
  };
  go();
}
