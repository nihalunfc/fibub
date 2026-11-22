// Least-squares line through points you can drag. The fitted line y = mx + c makes the total of the squared vertical
// gaps (the little squares) as small as possible. Drag a point far from the rest and the line swings towards it: an
// outlier has a strong pull. The correlation r shows how well a straight line describes the points (+1 or −1 is a
// perfect line, 0 is none).
import { canvas, axes, row, button, readout, dot, line, text } from '../kit.js';
import { drag, f2 } from './_math.js';

export default function (host) {
  let P = [[1, 1.4], [2, 2.6], [3, 2.9], [4, 4.4], [5, 4.6], [6, 6.1], [7, 6.4]], show = true;
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 260, label: 'Points, their least squares line and the squared residuals' });
  const c = row(host);
  button(c, 'Hide / show squares', () => { show = !show; cv.redraw(); });
  button(c, 'Add outlier', () => { P[6] = [7, 1]; cv.redraw(); out2(); });
  button(c, 'Reset', () => { P = [[1, 1.4], [2, 2.6], [3, 2.9], [4, 4.4], [5, 4.6], [6, 6.1], [7, 6.4]]; cv.redraw(); out2(); });
  const out = readout(host);
  let A0 = null;
  drag(cv, () => (A0 ? P.map(([x, y]) => [A0.X(x), A0.Y(y)]) : []), (i, px, py) => { P[i] = [Math.max(0, Math.min(8, ((px - A0.L) / (A0.R - A0.L)) * 8)), Math.max(0, Math.min(8, 8 - ((py - A0.T) / (A0.B - A0.T)) * 8))]; cv.redraw(); out2(); });
  const fit = () => { const n = P.length, sx = P.reduce((s, p) => s + p[0], 0), sy = P.reduce((s, p) => s + p[1], 0), sxx = P.reduce((s, p) => s + p[0] ** 2, 0), sxy = P.reduce((s, p) => s + p[0] * p[1], 0), syy = P.reduce((s, p) => s + p[1] ** 2, 0), den = n * sxx - sx * sx, m = (n * sxy - sx * sy) / den, cc = (sy - m * sx) / n, r = (n * sxy - sx * sy) / Math.sqrt(den * (n * syy - sy * sy) || 1e-9); return { m, c: cc, r, sse: P.reduce((s, p) => s + (p[1] - m * p[0] - cc) ** 2, 0) }; };
  function out2() { const f = fit(); out.innerHTML = `Best line: y = <b>${f2(f.m)}x ${f.c < 0 ? '−' : '+'} ${f2(Math.abs(f.c))}</b>. Correlation r = <b>${f2(f.r, 3)}</b> (r² = ${f2(f.r ** 2, 3)}: ${f2(f.r ** 2 * 100, 0)}% of the variation is explained by the line). Sum of squared residuals = ${f2(f.sse)}; any other line gives a bigger total.`; }
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0, 8], y: [0, 8], l: 28, b: 22, t: 22, r: 10 }); A0 = A; const f = fit();
    if (show) P.forEach(([x, y]) => { const e = y - (f.m * x + f.c), s = Math.abs(A.Y(y) - A.Y(f.m * x + f.c)); ctx.globalAlpha = 0.25; ctx.fillStyle = col.s[3]; ctx.fillRect(e >= 0 ? A.X(x) : A.X(x), Math.min(A.Y(y), A.Y(f.m * x + f.c)), s, s); ctx.globalAlpha = 1; });
    ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.clip(); line(ctx, [[A.X(0), A.Y(f.c)], [A.X(8), A.Y(8 * f.m + f.c)]], col.s[0], 2.5); ctx.restore();
    P.forEach(([x, y]) => { line(ctx, [[A.X(x), A.Y(y)], [A.X(x), A.Y(f.m * x + f.c)]], col.s[3], 1.5); dot(ctx, A.X(x), A.Y(y), 6, col.s[1], col.ink); });
    text(ctx, 'drag the dots · pink squares = (gap)²', A.L + 6, A.T + 10, { color: col.muted, size: 10 });
  };
  out2();
}
