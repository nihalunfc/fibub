// Class 12 Electrostatic Potential and Capacitance: potential and field of a point charge. V = kQ/r falls as 1/r, E = kQ/r^2 falls as 1/r^2,
// and V(r) is the area under the E curve from r to infinity (the work per unit charge to bring a test charge in from far away). The shaded area is that
// work up to 1.5 m (the graph stops there); the readout compares it with the exact change in V.
import { canvas, text, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let r = 0.3, sg = 1;
  const k = 9e9, Q = 2e-6, RM = 1.5;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Graphs of the potential and the field of a point charge against distance' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Charge', [[1, '+2 µC'], [-1, '−2 µC']], 1, (v) => { sg = v; go(); });
  slider(ctl, { label: 'distance r (m)', min: 0.1, max: 1.2, step: 0.01, value: r, fmt: (v) => v.toFixed(2), oninput: (v) => { r = v; go(); } });
  const V = (x) => sg * k * Q / x / 1e3, E = (x) => sg * k * Q / x / x / 1e3;
  const go = () => {
    let a = 0; const N = 400; for (let i = 0; i < N; i++) { const x = r + (RM - r) * (i + 0.5) / N; a += E(x) * (RM - r) / N; }
    ro.textContent = `r = ${r.toFixed(2)} m:  V = ${V(r).toFixed(0)} kV,  E = ${E(r).toFixed(0)} kN/C.  Area under E from r to ${RM} m = ${a.toFixed(1)} kV = V(r) − V(${RM}) = ${(V(r) - V(RM)).toFixed(1)} kV.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const mid = h / 2;
    const yr = (m) => (sg > 0 ? [0, m] : [-m, 0]);
    const A1 = axes(ctx, w, h, col, { x: [0.1, RM], y: yr(200), t: 22, b: h - mid + 6, ylabel: 'V (kV)', xt: [0.5, 1, 1.5], fx: () => '', l: 54 });
    const A2 = axes(ctx, w, h, col, { x: [0.1, RM], y: yr(2000), t: mid + 14, b: 36, xlabel: 'distance r (m)', ylabel: 'E (kN/C)', xt: [0.5, 1, 1.5], fy: (v) => (+v).toFixed(0), l: 54 });
    const pts = (f, A) => { const o = []; for (let i = 0; i <= 120; i++) { const x = 0.1 + i * (RM - 0.1) / 120; o.push([A.X(x), A.Y(Math.max(-2000, Math.min(2000, f(x))))]); } return o; };
    line(ctx, pts(V, A1), col.s[2], 3); line(ctx, pts(E, A2), col.s[0], 3);
    ctx.save(); ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.moveTo(A2.X(r), A2.Y(0));
    for (let i = 0; i <= 60; i++) { const x = r + (RM - r) * i / 60; ctx.lineTo(A2.X(x), A2.Y(E(x))); } ctx.lineTo(A2.X(RM), A2.Y(0)); ctx.closePath(); ctx.fill(); ctx.restore();
    for (const A of [A1, A2]) { ctx.strokeStyle = col.muted; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(A.X(r), A.T); ctx.lineTo(A.X(r), A.B); ctx.stroke(); ctx.setLineDash([]); }
    dot(ctx, A1.X(r), A1.Y(V(r)), 5, col.s[2], col.panel); dot(ctx, A2.X(r), A2.Y(E(r)), 5, col.s[0], col.panel);
    text(ctx, 'V = kQ/r', A1.R - 6, A1.T + 12, { color: col.s[2], size: 12, weight: 700, align: 'right' });
    text(ctx, 'E = kQ/r²', A2.R - 6, A2.T + 12, { color: col.s[0], size: 12, weight: 700, align: 'right' });
    text(ctx, 'shaded area = work per unit charge', A2.R - 6, A2.B - 10, { color: col.s[3], size: 10.5, align: 'right' });
  };
  go();
}
