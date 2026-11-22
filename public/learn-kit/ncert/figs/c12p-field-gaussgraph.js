// Class 12 Electric Charges and Fields: the three Gauss's-law results as graphs of E against distance r from the centre/axis/plane.
//  Thin spherical shell (charge Q, radius R): E = 0 for r < R, kQ/r^2 for r >= R.   Long straight wire (charge per length lambda): E = lambda/(2 pi eps0 r).
//  Infinite plane sheet (charge per area sigma): E = sigma/(2 eps0), the same everywhere on each side. A slider moves the point where E is read.
import { canvas, text, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let kind = 'shell', r = 1.5;
  const k = 9e9, e0 = 8.854e-12, Rs = 1, Q = 4e-6, lam = 2e-6, sig = 2e-6;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 280, label: 'Graph of the electric field of a charged shell, wire or sheet against distance' });
  const ctl = row(host), ro = readout(host);
  const F = { shell: (x) => (x < Rs ? 0 : k * Q / (x * x)), wire: (x) => lam / (2 * Math.PI * e0 * x), sheet: () => sig / (2 * e0) };
  const NOTE = { shell: 'shell (Q = 4 µC, R = 1 m): zero inside, then kQ/r²', wire: 'long wire (λ = 2 µC/m): E = λ/(2π ε₀ r), falls as 1/r', sheet: 'infinite sheet (σ = 2 µC/m²): E = σ/2ε₀, the same at every distance' };
  choice(ctl, 'Charge shape', [['shell', 'Spherical shell'], ['wire', 'Long wire'], ['sheet', 'Plane sheet']], kind, (v) => { kind = v; go(); });
  slider(ctl, { label: 'distance r (m)', min: 0.1, max: 4, step: 0.05, value: r, fmt: (v) => v.toFixed(2), oninput: (v) => { r = v; go(); } });
  const go = () => { ro.textContent = `${NOTE[kind]}. At r = ${r.toFixed(2)} m: E = ${(F[kind](r) / 1e3).toFixed(1)} × 10³ N/C.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const ymax = kind === 'shell' ? 4e5 : kind === 'wire' ? 4e5 : 2e5;
    const A = axes(ctx, w, h, col, { x: [0, 4], y: [0, ymax], xlabel: kind === 'sheet' ? 'distance from the sheet r (m)' : kind === 'wire' ? 'distance from the wire r (m)' : 'distance from the centre r (m)', ylabel: 'E (×10³ N/C)', fy: (v) => (v / 1e3).toFixed(0), l: 50 });
    ctx.save(); A.clip();
    const pts = []; for (let i = 0; i <= 200; i++) { const x = 0.05 + i * 3.95 / 200; pts.push([A.X(x), A.Y(Math.min(ymax * 1.5, F[kind](x)))]); }
    if (kind === 'shell') { line(ctx, pts.filter((p, i) => 0.05 + i * 3.95 / 200 < Rs), col.s[0], 3); line(ctx, pts.filter((p, i) => 0.05 + i * 3.95 / 200 >= Rs), col.s[0], 3); } else line(ctx, pts, col.s[0], 3);
    ctx.restore();
    if (kind === 'shell') { ctx.strokeStyle = col.muted; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(A.X(Rs), A.T); ctx.lineTo(A.X(Rs), A.B); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'R', A.X(Rs) + 4, A.T + 10, { color: col.muted, size: 11 }); }
    ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(A.X(r), A.T); ctx.lineTo(A.X(r), A.B); ctx.stroke();
    dot(ctx, A.X(r), A.Y(Math.min(ymax * 0.99, F[kind](r))), 6, col.s[3], col.panel);
  };
  go();
}
