// Class 12 Electrostatic Potential and Capacitance: potential of a dipole. At distance r and angle theta from the dipole axis (far field) V = k p cos(theta) / r^2.
// Positive on the +q side, negative on the -q side, zero on the whole equatorial plane (theta = 90 deg). Exact two-charge potentials are summed for the readout
// (charges +-1 nC, 2a = 4 cm, r = 0.5 m), next to the formula.
import { canvas, text, title, dot, line, axes, row, slider, readout } from '../../kit.js';

export default function (host) {
  let th = 40;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Potential of a dipole at different angles around it' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'angle θ from the axis (°)', min: 0, max: 180, step: 1, value: th, fmt: (v) => v.toFixed(0) + '°', oninput: (v) => { th = v; go(); } });
  const k = 9e9, q = 1e-9, a = 0.02, r = 0.5;
  const exact = (t) => { const x = r * Math.cos(t), y = r * Math.sin(t); return k * q * (1 / Math.hypot(x - a, y) - 1 / Math.hypot(x + a, y)); };
  const go = () => { const t = th * Math.PI / 180, f = k * 2 * q * a * Math.cos(t) / r ** 2; ro.textContent = `θ = ${th}°: V = kp cos θ / r² = ${f.toFixed(2)} V (exact sum of the two charges: ${exact(t).toFixed(2)} V). Zero at 90°.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Dipole potential V = kp cos θ / r²', col);
    const hh = h * 0.46, cx = w * 0.3, cy = hh * 0.62 + 12, R = Math.min(w * 0.22, hh * 0.38), t = th * Math.PI / 180;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    line(ctx, [[cx, cy - R - 8], [cx, cy + R + 8]], col.line, 1, [4, 3]); text(ctx, 'V = 0 plane', cx + 6, cy - R - 6, { color: col.muted, size: 10 });
    line(ctx, [[cx - R - 8, cy], [cx + R + 8, cy]], col.muted, 1);
    dot(ctx, cx + R * 0.3, cy, 7, col.s[2]); dot(ctx, cx - R * 0.3, cy, 7, col.s[0]); text(ctx, '+', cx + R * 0.3, cy, { color: col.panel, size: 11, weight: 700, align: 'center' }); text(ctx, '−', cx - R * 0.3, cy, { color: col.panel, size: 11, weight: 700, align: 'center' });
    const P = [cx + R * Math.cos(t), cy - R * Math.sin(t)]; line(ctx, [[cx, cy], P], col.s[3], 1.5); dot(ctx, ...P, 6, col.s[3], col.panel); text(ctx, 'P', P[0] + 10, P[1] - 8, { color: col.s[3], size: 12, weight: 700 });
    text(ctx, 'V > 0', cx + R * 0.15, cy + R * 0.6, { color: col.s[2], size: 11, weight: 700 }); text(ctx, 'V < 0', cx - R * 0.15, cy + R * 0.6, { color: col.s[0], size: 11, weight: 700, align: 'right' });
    const A = axes(ctx, w, h, col, { x: [0, 180], y: [-1, 1], t: hh + 30, b: 34, xt: [0, 45, 90, 135, 180], yt: [-1, 0, 1], fx: (v) => v + '°', fy: (v) => (v === 1 ? '+max' : v === -1 ? '−max' : '0'), xlabel: 'angle θ', l: 48 });
    const pts = []; for (let i = 0; i <= 90; i++) pts.push([A.X(i * 2), A.Y(Math.cos(i * 2 * Math.PI / 180))]); line(ctx, pts, col.s[0], 3);
    dot(ctx, A.X(th), A.Y(Math.cos(t)), 6, col.s[3], col.panel);
  };
  go();
}
