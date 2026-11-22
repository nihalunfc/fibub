// Class 9 Science, Chapter 4 (step player): the three equations of uniform acceleration read straight off one velocity-time
// graph (u = 2 m/s, v = 10 m/s, t = 4 s, so a = 2 m/s² and s = 24 m). Steps: the graph; slope gives v = u + at; the trapezium
// area gives s = ½(u+v)t; splitting it gives s = ut + ½at²; removing t gives v² = u² + 2as; which equation to use.
import { canvas, axes, text, title, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 320, label: 'A velocity-time graph used to derive the three equations of motion step by step' });
  const T = ['A uniformly accelerating body', 'Slope of the graph: v = u + at', 'Area (trapezium): s = ½(u + v)t', 'Split the area: s = ut + ½at²', 'Remove t: v² = u² + 2as', 'Which equation do I need?'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col) + 2, u = 2, v = 10, t = 4;
    const gh = 0.56, ah = Math.round((h - top) * gh);
    const ax = axes(ctx, w, h - (h - top - ah) + 4 - 0, col, { x: [0, 5], y: [0, 12], t: top + 4, xlabel: 't (s)', ylabel: 'v (m/s)', b: 34, l: 40 });
    const X0 = ax.X(0), Xt = ax.X(t);
    ctx.save(); ctx.globalAlpha = 0.3;
    if (step === 2 || step === 4) { ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(X0, ax.Y(0)); ctx.lineTo(X0, ax.Y(u)); ctx.lineTo(Xt, ax.Y(v)); ctx.lineTo(Xt, ax.Y(0)); ctx.fill(); }
    if (step === 3) { ctx.fillStyle = col.s[0]; ctx.fillRect(X0, ax.Y(u), Xt - X0, ax.Y(0) - ax.Y(u)); ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.moveTo(X0, ax.Y(u)); ctx.lineTo(Xt, ax.Y(v)); ctx.lineTo(Xt, ax.Y(u)); ctx.fill(); }
    ctx.restore();
    line(ctx, [[X0, ax.Y(u)], [Xt, ax.Y(v)]], col.ink, 3); dot(ctx, X0, ax.Y(u), 5, col.ink); dot(ctx, Xt, ax.Y(v), 5, col.ink);
    line(ctx, [[Xt, ax.Y(0)], [Xt, ax.Y(v)]], col.muted, 1, [4, 3]);
    text(ctx, 'u = 2', X0 + 8, ax.Y(u) + 12, { color: col.ink, size: 11, weight: 700, halo: col.panel }); text(ctx, 'v = 10', Xt - 8, ax.Y(v) - 10, { color: col.ink, size: 11, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 't = 4', Xt, ax.Y(0) - 8, { color: col.muted, size: 10.5, align: 'center' });
    if (step === 1) { line(ctx, [[X0, ax.Y(u)], [Xt, ax.Y(u)], [Xt, ax.Y(v)]], col.s[1], 2, [5, 3]); text(ctx, 'run = t', (X0 + Xt) / 2, ax.Y(u) + 12, { color: col.s[1], size: 11, weight: 700, align: 'center' }); text(ctx, 'rise = v − u', Xt - 6, ax.Y(6) , { color: col.s[1], size: 11, weight: 700, align: 'right', halo: col.panel }); }
    if (step === 3) { text(ctx, 'u·t = 8', (X0 + Xt) / 2, ax.Y(1), { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, '½at² = 16', Xt - 6, ax.Y(5.4), { color: col.ink, size: 11, weight: 700, align: 'right', halo: col.panel }); }
    if (step === 2 || step === 4) text(ctx, 's = 24 m', (X0 + Xt) / 2, ax.Y(2.6), { color: col.ink, size: 12, weight: 700, align: 'center' });
    // text block under the graph
    const y0 = ax.B + 36, L = [
      ['u = 2 m/s at t = 0', 'v = 10 m/s at t = 4 s', 'a = (10 − 2)/4 = 2 m/s²'],
      ['slope = a = (v − u)/t', 'so  v = u + at', 'check: 2 + 2 × 4 = 10 ✓'],
      ['area = ½ × (u + v) × t', 's = ½(2 + 10) × 4 = 24 m', 'average speed 6 m/s × 4 s'],
      ['rectangle u·t  +  triangle ½·(at)·t', 's = ut + ½at²', 'check: 8 + ½ × 2 × 16 = 24 ✓'],
      ['from v = u + at: t = (v − u)/a', 'put in s = ½(u + v)t:  2as = v² − u²', 'v² = u² + 2as: 100 = 4 + 96 ✓'],
      ['v = u + at   →  no s needed', 's = ut + ½at²  →  no v needed', 'v² = u² + 2as  →  no t needed'],
    ][step];
    L.forEach((l, i) => text(ctx, l, 12, y0 + i * 17, { color: i === 1 ? col.s[0] : col.ink, size: i === 1 ? 12.5 : 11.5, weight: i === 1 ? 700 : 400 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
