// The derivative as the slope the secant settles on. The line through (x, f(x)) and (x + h, f(x + h)) is a secant;
// make h smaller (or press Play to shrink it automatically) and it turns into the tangent. The lower graph plots the
// secant slope against h: it flattens out at f′(x). Drag the point or use the slider to change x.
import { canvas, axes, row, slider, choice, readout, loop, dot, line, text } from '../kit.js';
import { curve, drag, f2 } from './_math.js';

const FN = { sq: ['x²', (x) => x * x, (x) => 2 * x], cube: ['x³ − 2x', (x) => x ** 3 - 2 * x, (x) => 3 * x * x - 2], sin: ['sin x', Math.sin, Math.cos], exp: ['eˣ', Math.exp, Math.exp], abs: ['|x| (corner)', Math.abs, (x) => Math.sign(x)] };
export default function (host) {
  let k = 'sq', x0 = 1, h = 1.5, tm = 0;
  const cv = canvas(host, { aspect: 0.95, max: 420, min: 300, label: 'A secant line approaching the tangent and its slope against h' });
  const c = row(host), c2 = row(host);
  choice(c, 'Function', Object.entries(FN).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; re(); });
  const anim = loop(host, (dt) => { tm += dt; h = Math.max(0.01, 1.5 * Math.exp(-tm * 0.9)); if (tm > 6) { tm = 0; h = 1.5; } hs.set(h); re(); }, { autoplay: false });
  anim.button(c);
  slider(c2, { label: 'x', min: -2, max: 2, step: 0.05, value: x0, fmt: (v) => f2(v), oninput: (v) => { x0 = v; re(); } });
  const hs = slider(c2, { label: 'h', min: 0.01, max: 2, step: 0.01, value: h, fmt: (v) => f2(v), oninput: (v) => { h = v; re(); } });
  const out = readout(host);
  let A0 = null;
  drag(cv, () => (A0 ? [[A0.X(x0), A0.Y(FN[k][1](x0))]] : []), (i, px) => { x0 = Math.max(-2, Math.min(2, -2 + ((px - A0.L) / (A0.R - A0.L)) * 4)); re(); });
  const sec = (x, hh) => (FN[k][1](x + hh) - FN[k][1](x)) / hh;
  function re() { cv.redraw(); const f = FN[k][1], d = FN[k][2](x0);
    out.innerHTML = `At x = ${f2(x0)}: secant slope = [f(${f2(x0 + h)}) − f(${f2(x0)})] / ${f2(h)} = <b>${f2(sec(x0, h), 4)}</b>. True derivative f′(${f2(x0)}) = <b>${f2(d, 4)}</b>. Gap = ${f2(sec(x0, h) - d, 4)}${k === 'abs' && Math.abs(x0) < 0.06 ? '. At the corner the slope from the right is +1 and from the left −1: no single tangent, so no derivative.' : ' and it shrinks with h.'}`; }
  cv.draw = (ctx, w, h2, col) => {
    const f = FN[k][1], top = Math.round(h2 * 0.58);
    // upper panel: function
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, top); ctx.clip();
    const A = axes(ctx, w, top, col, { x: [-2.5, 3.5], y: [-3, 5], l: 30, b: 20, t: 22, r: 10, xt: [-2, 0, 2], yt: [-2, 0, 2, 4] }); A0 = A;
    curve(ctx, A, f, -2.5, 3.5, col.s[0], 3);
    const y0 = f(x0), y1 = f(x0 + h), m = sec(x0, h), d = FN[k][2](x0);
    curve(ctx, A, (x) => y0 + d * (x - x0), -2.5, 3.5, col.muted, 1.5, { n: 2, dash: [5, 4] });
    curve(ctx, A, (x) => y0 + m * (x - x0), -2.5, 3.5, col.s[1], 2.5, { n: 2 });
    line(ctx, [[A.X(x0), A.Y(y0)], [A.X(x0 + h), A.Y(y0)], [A.X(x0 + h), A.Y(y1)]], col.s[2], 1.5, [3, 3]);
    dot(ctx, A.X(x0), A.Y(y0), 6, col.s[0], col.ink); dot(ctx, A.X(x0 + h), A.Y(y1), 5, col.s[1], col.ink);
    text(ctx, 'orange: secant · dashed: tangent', A.L + 6, A.T + 10, { color: col.muted, size: 10 });
    ctx.restore();
    // lower panel: secant slope against h
    ctx.save(); ctx.translate(0, top); ctx.beginPath(); ctx.rect(0, 0, w, h2 - top); ctx.clip();
    const hh = h2 - top, vals = [-1, 1].flatMap((sg) => [0.01, 1, 2].map((q) => sec(x0, sg * q))), lo = Math.min(d - 3, ...vals), hi = Math.max(d + 3, ...vals);
    const B = axes(ctx, w, hh, col, { x: [0, 2], y: [lo, hi], l: 30, b: 28, t: 8, r: 10, xlabel: 'h', xt: [0, 0.5, 1, 1.5, 2], yt: [] });
    curve(ctx, B, (q) => sec(x0, Math.max(0.005, q)), 0.005, 2, col.s[1], 2.5);
    line(ctx, [[B.L, B.Y(d)], [B.R, B.Y(d)]], col.muted, 1.5, [5, 4]);
    dot(ctx, B.X(h), B.Y(m), 5, col.s[1], col.ink);
    text(ctx, 'slope of secant', B.L + 6, B.T + 8, { color: col.s[1], size: 10, weight: 600 }); text(ctx, "f′(x)", B.R - 4, B.Y(d) - 8, { color: col.muted, size: 10, align: 'right' });
    ctx.restore();
  };
  re();
}
