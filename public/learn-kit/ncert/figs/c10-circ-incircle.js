// Class 10 Circles: a circle inside a triangle touches the three sides. Tangents from one vertex to the circle are equal, so
// if the tangent lengths from A, B, C are x, y, z then AB = x + y, BC = y + z, CA = z + x and the perimeter is 2(x + y + z).
// The radius is r = √(xyz / (x + y + z)) (from area = r × half-perimeter and Heron's formula).
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let x = 3, y = 2, z = 4;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A triangle with its inscribed circle and the equal tangent lengths from each vertex' });
  const ctl = row(host);
  slider(ctl, { label: 'From A: x', min: 1, max: 6, step: 0.5, value: x, fmt: (v) => v + ' cm', oninput: (v) => { x = v; say(); } });
  slider(ctl, { label: 'From B: y', min: 1, max: 6, step: 0.5, value: y, fmt: (v) => v + ' cm', oninput: (v) => { y = v; say(); } });
  slider(ctl, { label: 'From C: z', min: 1, max: 6, step: 0.5, value: z, fmt: (v) => v + ' cm', oninput: (v) => { z = v; say(); } });
  const out = readout(host);
  function say() { const s = x + y + z; out.innerHTML = `AB = x + y = <b>${x + y}</b>, BC = y + z = <b>${y + z}</b>, CA = z + x = <b>${z + x}</b>. Perimeter = 2(x + y + z) = <b>${2 * s}</b> cm. Radius = √(xyz/(x+y+z)) = <b>${Math.sqrt((x * y * z) / s).toFixed(2)} cm</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Incircle: equal tangents from each corner', col);
    const a = y + z, b = z + x, c = x + y, Ax = (c * c + a * a - b * b) / (2 * a), Ay = Math.sqrt(Math.max(0.01, c * c - Ax * Ax)), s = x + y + z;
    const pts = [[0, 0], [a, 0], [Ax, Ay]], k = Math.min((w - 50) / Math.max(a, Ax, a - Ax, 1) / 1.0, (h - 115) / Ay), kk = Math.min(k, (w - 50) / (Math.max(a, Ax) - Math.min(0, Ax)));
    const minx = Math.min(0, Ax), maxx = Math.max(a, Ax), ox = (w - (maxx - minx) * kk) / 2 - minx * kk, oy = h - 50;
    const P = (q) => [ox + q[0] * kk, oy - q[1] * kk];
    const B = P(pts[0]), C = P(pts[1]), A = P(pts[2]);
    const I = [(a * pts[2][0] + b * pts[0][0] + c * pts[1][0]) / (a + b + c), (a * pts[2][1]) / (a + b + c)], r = Math.sqrt((x * y * z) / s);
    const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
    const TBC = lerp(B, C, y / a), TAB = lerp(B, A, y / c), TAC = lerp(C, A, z / b), Ic = P(I);
    ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(C[0], C[1]); ctx.closePath(); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(Ic[0], Ic[1], r * kk, 0, 7); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.stroke();
    const mark = (p, q, c0, t) => { line(ctx, [p, q], c0, 5); text(ctx, t, (p[0] + q[0]) / 2, (p[1] + q[1]) / 2, { color: col.ink, size: 11, weight: 700, halo: col.panel, align: 'center' }); };
    mark(A, TAB, col.s[1], 'x'); mark(A, TAC, col.s[1], 'x'); mark(B, TAB, col.s[2], 'y'); mark(B, TBC, col.s[2], 'y'); mark(C, TBC, col.s[3], 'z'); mark(C, TAC, col.s[3], 'z');
    [TAB, TBC, TAC].forEach((t) => dot(ctx, t[0], t[1], 4.5, col.s[0], col.panel));
    text(ctx, 'A', A[0], A[1] - 13, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, 'B', B[0] - 11, B[1] + 11, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, 'C', C[0] + 11, C[1] + 11, { color: col.ink, size: 13, weight: 700, align: 'center' });
  };
  say();
}
