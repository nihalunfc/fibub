// Class 10 Arithmetic Progressions: how the sum of the first n terms S_n grows (or stops growing). S_n = n/2 [2a + (n - 1)d].
// With d > 0 the sum climbs faster and faster. With d < 0 the terms eventually turn negative and the sum peaks, then falls.
// The bars are S_n; the dot marks the largest sum.
import { canvas, axes, line, dot, text, title, row, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  let a = 20, d = -3;
  const N = 16;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Bars showing the sum of the first n terms of an AP for n from 1 to 16' });
  const ctl = row(host);
  slider(ctl, { label: 'first term a', min: -10, max: 40, step: 1, value: a, oninput: (v) => { a = v; go(); } });
  slider(ctl, { label: 'common difference d', min: -6, max: 6, step: 1, value: d, oninput: (v) => { d = v; go(); } });
  const out = readout(host);
  const S = (n) => (n * (2 * a + (n - 1) * d)) / 2;
  const go = () => {
    let best = 1; for (let n = 1; n <= N; n++) if (S(n) > S(best)) best = n;
    out.innerHTML = `S<sub>n</sub> = n/2 [2a + (n − 1)d]. S<sub>10</sub> = <b>${fmt(S(10))}</b>. ${d < 0 && S(best) > S(N) ? `The terms turn negative, so the sum is largest at n = <b>${best}</b> (S = ${fmt(S(best))}) and then falls.` : d >= 0 && a >= 0 ? 'Terms are never negative, so the sum only grows.' : 'Watch how the sign of each new term decides whether the sum grows or shrinks.'}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Sum of the first n terms (a = ${a}, d = ${d})`, col);
    const vals = Array.from({ length: N }, (_, i) => S(i + 1)), lo = Math.min(0, ...vals), hi = Math.max(1, ...vals);
    const A = axes(ctx, w, h, col, { x: [0, N + 1], y: [lo, hi * 1.1 || 1], t: 34, b: 32, l: 44, xlabel: 'n', xt: [0, 4, 8, 12, 16] });
    ctx.save(); A.clip();
    const bw = (A.R - A.L) / (N + 1) - 2;
    let best = 1; for (let n = 1; n <= N; n++) if (S(n) > S(best)) best = n;
    for (let n = 1; n <= N; n++) { const x = A.X(n) - bw / 2, y0 = A.Y(0), y1 = A.Y(S(n)); ctx.fillStyle = n === best ? col.s[2] : S(n) >= 0 ? col.s[0] : col.s[3]; ctx.globalAlpha = 0.85; ctx.fillRect(x, Math.min(y0, y1), bw, Math.abs(y1 - y0)); }
    ctx.globalAlpha = 1; ctx.restore();
    line(ctx, [[A.L, A.Y(0)], [A.R, A.Y(0)]], col.muted, 1.5);
    dot(ctx, A.X(best), A.Y(S(best)), 5, col.s[2], col.panel);
  };
  go();
}
