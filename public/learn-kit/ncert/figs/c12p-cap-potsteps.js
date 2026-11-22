// Class 12 Electrostatic Potential and Capacitance (step player): where V = kQ/r comes from. Bring a unit positive test charge in from far away to a distance r from Q.
// At distance x the force is kQ/x^2 (field E). In a tiny step dx the work is E dx; adding the strips (the area under the E-x curve from r out to infinity) gives
// W = kQ/r, and that is the potential V(r). Drawn with kQ = 1 and r = 0.6.
import { canvas, text, title, axes, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'Area under the field curve as the work to bring a test charge in from far away' });
  const TITLES = ['Bring a test charge in from far away', 'The force changes as it gets closer', 'Work in one thin strip: dW = E dx', 'Add more and more thin strips', 'The area is the work: W = kQ/r', 'So the potential is V = kQ/r'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col);
    const A = axes(ctx, w, h, col, { x: [0, 3], y: [0, 3], xt: [0, 1, 2, 3], yt: [0, 1, 2, 3], xlabel: 'distance x from Q', ylabel: 'E = kQ/x²', l: 46, t: top + 14, b: 56 });
    const r0 = 0.6, E = (x) => 1 / (x * x);
    ctx.save(); A.clip();
    if (step >= 2) {
      const n = step === 2 ? 1 : step === 3 ? 14 : 80, x0 = step === 2 ? 1.5 : r0, x1 = step === 2 ? 1.8 : 3, dx = (x1 - x0) / n;
      ctx.fillStyle = col.s[3]; ctx.strokeStyle = col.panel; ctx.globalAlpha = step === 3 ? 0.55 : 0.45; ctx.lineWidth = 1;
      for (let i = 0; i < n; i++) { const xa = x0 + i * dx; const hgt = Math.min(3, E(xa + dx / 2)); ctx.fillRect(A.X(xa), A.Y(hgt), A.X(xa + dx) - A.X(xa), A.Y(0) - A.Y(hgt)); if (n < 30) ctx.strokeRect(A.X(xa), A.Y(hgt), A.X(xa + dx) - A.X(xa), A.Y(0) - A.Y(hgt)); }
      ctx.globalAlpha = 1;
    }
    const pts = []; for (let i = 0; i <= 150; i++) { const x = 0.3 + i * 2.7 / 150; pts.push([A.X(x), A.Y(Math.min(3, E(x)))]); } line(ctx, pts, col.s[0], 3);
    ctx.restore();
    // Q and test charge on a line at the bottom
    const ly = h - 26, X = (x) => A.X(x);
    dot(ctx, X(0.05), ly, 8, col.s[2]); text(ctx, 'Q', X(0.05), ly, { color: col.panel, size: 10, weight: 700, align: 'center' });
    const tx = step === 0 ? 2.7 : step >= 4 ? r0 : step === 1 ? 1.6 : 1.5;
    dot(ctx, X(tx), ly, 5, col.s[3]); text(ctx, 'test +1', X(tx), ly - 13, { color: col.s[3], size: 10.5, align: 'center' });
    arrow(ctx, X(Math.min(3, tx + 0.35)), ly + 10, X(Math.max(0.15, tx - 0.05)), ly + 10, col.s[3], 2, 6);
    if (step === 1) { dot(ctx, A.X(1.6), A.Y(E(1.6)), 5, col.s[3], col.panel); text(ctx, 'force on the test charge = E', A.X(1.7), A.Y(E(1.6)) - 8, { color: col.s[3], size: 11, weight: 700 }); }
    if (step === 2) text(ctx, 'one strip: height E, width dx', A.X(1.9), A.Y(1.0), { color: col.s[3], size: 11, weight: 700 });
    if (step >= 4) { ctx.strokeStyle = col.muted; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(A.X(r0), A.T); ctx.lineTo(A.X(r0), A.B); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'r', A.X(r0) + 4, A.T + 8, { color: col.muted, size: 11 }); text(ctx, 'area = ∫ E dx = kQ/r', A.X(1.15), A.Y(1.6), { color: col.s[3], size: 12, weight: 700 }); }
    if (step === 5) text(ctx, 'V(r) = work per unit charge = kQ/r', w / 2, A.B + 26, { color: col.s[7], size: 12.5, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
