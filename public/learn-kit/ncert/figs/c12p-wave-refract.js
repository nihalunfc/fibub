// Class 12 Wave Optics (step player): proof of Snell's law with Huygens' principle. A plane wave in air (speed v1) meets glass (speed v2 = v1/n).
// While point B of the front travels BC = v1 t in air, the wavelet from A grows to AE = v2 t in glass. The new front is the tangent CE.
// Triangles ABC and AEC share the hypotenuse AC: sin i = BC/AC, sin r = AE/AC, so sin i / sin r = v1/v2 = n.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';
import { rad } from '../c12p-optlib.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 300, label: 'Huygens construction for refraction at a plane surface' });
  const TITLES = ['Plane front AB meets the surface', 'B travels to C in time t: BC = v₁t', 'Meanwhile the wavelet from A grows: AE = v₂t', 'The tangent from C to the wavelet is the new front CE', 'Two right triangles share the side AC', 'Divide: sin i / sin r = v₁/v₂ = n'];
  const I = 50, N = 1.5;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 6, Y = top + (h - top) * 0.46, i = rad(I), r = Math.asin(Math.sin(i) / N);
    ctx.fillStyle = col.soft; ctx.fillRect(0, Y, w, h - Y);
    line(ctx, [[0, Y], [w, Y]], col.ink, 2);
    text(ctx, 'air: v₁', 8, Y - 10, { color: col.muted, size: 11 }); text(ctx, 'glass: v₂ = v₁/n', 8, h - 10, { color: col.muted, size: 11 });
    const A = [w * 0.27, Y], Lc = w * 0.46, C = [A[0] + Lc, Y];
    const BCl = Lc * Math.sin(i), B = [C[0] - BCl * Math.sin(i), C[1] - BCl * Math.cos(i)], AE = BCl / N;
    const E = [A[0] + AE * Math.sin(r), A[1] + AE * Math.cos(r)];
    // normal at A
    line(ctx, [[A[0], Y - 70], [A[0], Y + 70]], col.muted, 1, [4, 4]);
    // the incident front AB
    line(ctx, [A, B], col.s[0], 3.5);
    dot(ctx, ...A, 4, col.ink); dot(ctx, ...B, 4, col.ink);
    text(ctx, 'A', A[0] - 12, A[1] - 8, { color: col.ink, size: 13, weight: 700 }); text(ctx, 'B', B[0] - 4, B[1] - 12, { color: col.ink, size: 13, weight: 700, align: 'center' });
    const dx = Math.sin(i), dy = Math.cos(i);
    for (const f of [0.35, 0.8]) { const p = [A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f]; arrow(ctx, p[0] - dx * 52, p[1] - dy * 52, p[0] - dx * 6, p[1] - dy * 6, col.s[0], 1.6, 6); }
    if (step === 0) text(ctx, 'rays ⟂ front', B[0] - 34, B[1] - 40, { color: col.s[0], size: 11, align: 'center' });
    if (step >= 1) {
      dot(ctx, ...C, 4, col.ink); text(ctx, 'C', C[0] + 8, C[1] - 8, { color: col.ink, size: 13, weight: 700 });
      line(ctx, [B, C], col.s[2], 2.5, step >= 4 ? undefined : [6, 3]);
      text(ctx, 'BC = v₁t', (B[0] + C[0]) / 2 + 6, (B[1] + C[1]) / 2 - 10, { color: col.s[2], size: 12, weight: 700 });
      line(ctx, [A, C], col.ink, 1.5);
      if (step === 1) line(ctx, [A, B], col.s[0], 3.5);
    }
    if (step >= 2) {
      ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(A[0], A[1], AE, 0, Math.PI); ctx.stroke();
      dot(ctx, ...E, 4, col.ink); text(ctx, 'E', E[0] + 8, E[1] + 12, { color: col.ink, size: 13, weight: 700 });
      line(ctx, [A, E], col.s[1], 2.5); text(ctx, 'AE = v₂t', (A[0] + E[0]) / 2 - 8, (A[1] + E[1]) / 2 + 14, { color: col.s[1], size: 12, weight: 700, align: 'right' });
    }
    if (step >= 3) {
      line(ctx, [C, E], col.s[3], 3.5); text(ctx, 'new front', (C[0] + E[0]) / 2 + 14, (C[1] + E[1]) / 2 + 14, { color: col.s[3], size: 11.5, weight: 700 });
      const ux = Math.sin(r), uy = Math.cos(r);
      for (const k of [0.4, 0.9]) { const p = [E[0] + (C[0] - E[0]) * k, E[1] + (C[1] - E[1]) * k]; arrow(ctx, p[0], p[1], p[0] + ux * 50, p[1] + uy * 50, col.s[3], 1.6, 6); }
    }
    if (step >= 4) {
      const aB = Math.atan2(B[1] - A[1], B[0] - A[0]), aE = Math.atan2(E[1] - C[1], E[0] - C[0]);
      ctx.lineWidth = 1.5; ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.arc(A[0], A[1], 28, 0, aB, true); ctx.stroke();
      text(ctx, 'i', A[0] + 40 * Math.cos(aB / 2), A[1] + 40 * Math.sin(aB / 2), { color: col.s[0], size: 13, weight: 700, align: 'center' });
      ctx.strokeStyle = col.s[3]; ctx.beginPath(); ctx.arc(C[0], C[1], 34, Math.PI, aE, true); ctx.stroke();
      text(ctx, 'r', C[0] + 24 * Math.cos((Math.PI + aE) / 2) - 6, C[1] + 24 * Math.sin((Math.PI + aE) / 2) + 6, { color: col.s[3], size: 13, weight: 700, align: 'center' });
      text(ctx, 'sin i = BC/AC', w - 8, Y - 60, { color: col.s[2], size: 12, weight: 700, align: 'right' });
      text(ctx, 'sin r = AE/AC', w - 8, Y + 30, { color: col.s[1], size: 12, weight: 700, align: 'right' });
    }
    if (step >= 5) text(ctx, 'sin i / sin r = v₁/v₂ = n', w / 2, h - 28, { color: col.s[7], size: 13.5, weight: 700, align: 'center', halo: col.soft });
  };
  cv.redraw();
  return { step(k) { step = Math.min(5, k); cv.redraw(); } };
}
