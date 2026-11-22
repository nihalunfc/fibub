// 3.4 The logistic map x → r x (1 − x). Top: the bifurcation diagram (long-time values of x for each r): period
// doubling at r = 3, 3.449, 3.544, ..., chaos after 3.5699, windows such as period 3 at 3.828. Bottom: the Lyapunov
// exponent λ(r), negative on stable cycles and positive in chaos. The slider marks one r and reports its attractor.
import { canvas, line, text, title, row, slider, readout, fmt } from '../../kit.js';

const R0 = 2.8, R1 = 4, NR = 480;
let cache = null;
function compute() {
  const pts = [], lyap = [];
  for (let i = 0; i < NR; i++) {
    const r = R0 + (R1 - R0) * i / (NR - 1);
    let x = 0.4; for (let k = 0; k < 400; k++) x = r * x * (1 - x);
    const xs = []; let s = 0;
    for (let k = 0; k < 300; k++) { s += Math.log(Math.abs(r * (1 - 2 * x)) + 1e-12); x = r * x * (1 - x); if (k < 160) xs.push(x); }
    pts.push(xs); lyap.push(s / 300);
  }
  return { pts, lyap };
}
function attractor(r) {
  let x = 0.4; for (let k = 0; k < 2000; k++) x = r * x * (1 - x);
  const xs = []; for (let k = 0; k < 64; k++) { x = r * x * (1 - x); xs.push(x); }
  for (let p = 1; p <= 32; p++) if (xs.every((v, k) => k < p || Math.abs(v - xs[k - p]) < 1e-6)) return { p, xs: xs.slice(0, p) };
  return { p: 0 };
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.78, max: 480, min: 320, label: 'Bifurcation diagram of the logistic map with its Lyapunov exponent below' });
  let r = 3.5;
  const ctl = row(host);
  slider(ctl, { label: 'r', min: R0, max: R1, step: 0.001, value: r, fmt: (v) => v.toFixed(3), oninput: (v) => { r = v; cv.redraw(); } });
  const out = readout(host);
  cv.draw = (ctx, W, H, col) => {
    cache ??= compute();
    title(ctx, 'Logistic map: attractor (top) and Lyapunov exponent (bottom)', col);
    const L = 46, Rr = W - 12, T1 = 40, B1 = T1 + (H - 90) * 0.62, T2 = B1 + 18, B2 = H - 30;
    const X = (rv) => L + (rv - R0) / (R1 - R0) * (Rr - L), Y1 = (x) => B1 - x * (B1 - T1), Y2 = (l) => T2 + (0.8 - l) / 2.8 * (B2 - T2);
    ctx.fillStyle = col.ink; ctx.globalAlpha = 0.5;
    cache.pts.forEach((xs, i) => { const px = X(R0 + (R1 - R0) * i / (NR - 1)); xs.forEach((x) => ctx.fillRect(px, Y1(x), 1, 1)); });
    ctx.globalAlpha = 1;
    line(ctx, [[L, B1], [Rr, B1]], col.muted, 1); line(ctx, [[L, T1], [L, B1]], col.muted, 1);
    line(ctx, [[L, Y2(0)], [Rr, Y2(0)]], col.muted, 1, [3, 3]); line(ctx, [[L, T2], [L, B2]], col.muted, 1);
    line(ctx, cache.lyap.map((l, i) => [X(R0 + (R1 - R0) * i / (NR - 1)), Y2(Math.max(-2, l))]), col.s[0], 1.5);
    text(ctx, 'x', L - 14, (T1 + B1) / 2, { color: col.ink, size: 12, weight: 700 });
    text(ctx, 'λ', L - 14, (T2 + B2) / 2, { color: col.s[0], size: 12, weight: 700 });
    text(ctx, '0', L - 6, Y2(0), { color: col.muted, size: 10, align: 'right' });
    for (const v of [3, 3.5, 4]) text(ctx, String(v), X(v), H - 14, { color: col.muted, size: 11, align: 'center' });
    text(ctx, 'r', (L + Rr) / 2, H - 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
    line(ctx, [[X(r), T1], [X(r), B2]], col.s[3], 1.5);
    const a = attractor(r), i = Math.round((r - R0) / (R1 - R0) * (NR - 1)), lam = cache.lyap[i];
    out.innerHTML = `r = <b>${r.toFixed(3)}</b>: ${a.p ? `a stable cycle of period <b>${a.p}</b> (x = ${a.xs.slice(0, 4).map((v) => fmt(v, 4)).join(', ')}${a.p > 4 ? ', ...' : ''})` : '<b>no short cycle: chaotic</b> (or a cycle longer than 32)'}; Lyapunov exponent λ ≈ <b>${fmt(lam, 3)}</b>${lam > 0.005 ? ' (positive: sensitive dependence)' : ' (negative or zero: predictable)'}. Landmarks: 3, 3.449, 3.544, 3.5699, the period-3 window at 3.828, and λ = ln 2 at r = 4.`;
  };
  cv.redraw();
}
