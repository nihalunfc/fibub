// Class 11 Maths, Trigonometric Functions: solving sin x = k, cos x = k or tan x = k. Draw the horizontal line y = k across the graph; every crossing is a
// solution. Because the graph repeats, there are infinitely many, all described by one general formula built from the principal value α.
import { canvas, text, title, row, slider, choice, readout, dot } from '../../kit.js';
import { plot, curve, r2, piLabel } from '../c11m-lib.js';

export default function (host) {
  let fn = 'sin', k = 0.5, sl;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A horizontal line crossing a trigonometric graph at the solutions of an equation' });
  const out = readout(host);
  const F = { sin: Math.sin, cos: Math.cos, tan: Math.tan };
  const sols = () => {
    const T = 2 * Math.PI, out = [];
    if (fn === 'sin' && Math.abs(k) <= 1) { const a = Math.asin(k); for (let n = -2; n <= 2; n++) out.push(a + n * T, Math.PI - a + n * T); }
    if (fn === 'cos' && Math.abs(k) <= 1) { const a = Math.acos(k); for (let n = -2; n <= 2; n++) out.push(a + n * T, -a + n * T); }
    if (fn === 'tan') { const a = Math.atan(k); for (let n = -3; n <= 3; n++) out.push(a + n * Math.PI); }
    return out.filter((x) => x >= -T - 1e-9 && x <= T + 1e-9);
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Solve ${fn} x = ${r2(k, 2)}`, col);
    const T = 2 * Math.PI, ym = fn === 'tan' ? 4 : 2, P = plot(ctx, w, h, col, { x: [-T, T], y: [-ym, ym], l: 22, b: 14, t: 28, r: 12, sx: Math.PI, sy: fn === 'tan' ? 2 : 1, fx: piLabel });
    curve(ctx, P, F[fn], col.s[0], 2.6, 100);
    ctx.save(); P.clip(); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(P.L, P.Y(k)); ctx.lineTo(P.R, P.Y(k)); ctx.stroke(); ctx.restore();
    const S = sols(); S.forEach((x) => dot(ctx, P.X(x), P.Y(k), 5.5, col.ink, col.panel));
    const ok = fn === 'tan' || Math.abs(k) <= 1, a = fn === 'sin' ? Math.asin(k) : fn === 'cos' ? Math.acos(k) : Math.atan(k);
    const gen = fn === 'sin' ? 'x = nπ + (−1)ⁿ α' : fn === 'cos' ? 'x = 2nπ ± α' : 'x = nπ + α';
    out.innerHTML = ok ? `Principal value α = <b>${r2(a, 3)}</b> rad (${r2((a * 180) / Math.PI, 1)}°). General solution: <b>${gen}</b>, n any integer. ${S.length} solutions are on this graph.` : `<b>No solution:</b> ${fn} x never goes beyond ±1.`;
  };
  const r = row(host);
  choice(r, 'Equation', [['sin', 'sin x = k'], ['cos', 'cos x = k'], ['tan', 'tan x = k']], fn, (v) => { fn = v; k = Math.max(-2, Math.min(2, k)); sl.set(k); cv.redraw(); });
  sl = slider(r, { label: 'k', min: -2, max: 2, step: 0.05, value: k, fmt: (v) => r2(v, 2), oninput: (v) => { k = v; cv.redraw(); } });
  cv.redraw();
}
