// Class 10 Quadratic Equations (step player): factorising 2x² + 7x + 3 by splitting the middle term, shown with
// algebra tiles. A big square tile is x by x (area x²), a strip is x by 1 (area x), a small tile is 1 by 1.
// Find two numbers with product a×c = 6 and sum b = 7 (that is 6 and 1), split 7x as 6x + x, and the tiles
// pack into a rectangle (x + 3) by (2x + 1): so 2x² + 7x + 3 = (2x + 1)(x + 3).
import { canvas, text, title, loop, ease } from '../../kit.js';

export default function (host) {
  let step = 0, p = 0, tp = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Algebra tiles for 2x² + 7x + 3 packed into a rectangle' });
  loop(host, (dt) => { if (p !== tp) { p = p < tp ? Math.min(tp, p + dt * 0.8) : Math.max(tp, p - dt * 0.8); cv.redraw(); } });
  const CAP = ['2x² + 7x + 3 is 2 big squares, 7 strips and 3 small tiles', 'Product 2 × 3 = 6 and sum 7: the numbers are 6 and 1', 'Split 7x into 6x + x: six strips and one strip', 'Pack the tiles into one rectangle', 'Read the sides: (x + 3) wide, (2x + 1) tall'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Splitting the middle term', col);
    const u = Math.min((w - 40) / 9.5, (h - top - 84) / 9.8), X = 4 * u, g = 6;
    const x0 = (w - (2 * X + g)) / 2, y0 = top + 12;
    const rw = X + 3 * u, rx = (w - rw) / 2, ry = y0 + 10;
    const T = [];
    for (let i = 0; i < 2; i++) T.push({ k: 0, g: [x0 + i * (X + g), y0, X, X], r: [rx, ry + i * X, X, X] });
    for (let k = 0; k < 6; k++) T.push({ k: 1, g: [x0 + k * (u + g), y0 + X + g, u, X], r: [rx + X + (k % 3) * u, ry + Math.floor(k / 3) * X, u, X] });
    T.push({ k: step >= 2 ? 2 : 1, g: [x0 + 6 * (u + g), y0 + X + g, u, X], r: [rx, ry + 2 * X, X, u] });
    for (let k = 0; k < 3; k++) T.push({ k: 3, g: [x0 + k * (u + g), y0 + 2 * X + 2 * g, u, u], r: [rx + X + k * u, ry + 2 * X, u, u] });
    const e = ease(p), L = (a, b) => a + (b - a) * e;
    T.forEach((t) => {
      const [x, y, ww, hh] = t.g.map((v, i) => L(v, t.r[i]));
      ctx.fillStyle = col.s[[0, 1, 4, 3][t.k]]; ctx.globalAlpha = 0.85; ctx.fillRect(x, y, ww, hh); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.panel; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, ww, hh);
      if (t.k === 0) text(ctx, 'x²', x + ww / 2, y + hh / 2, { color: col.panel, size: 14, weight: 700, align: 'center' });
      else if (t.k === 1 && step < 3 && hh > 20) text(ctx, 'x', x + ww / 2, y + hh / 2, { color: col.panel, size: 11, weight: 700, align: 'center' });
      else if (t.k === 2 && step < 3) text(ctx, 'x', x + ww / 2, y + hh / 2, { color: col.panel, size: 11, weight: 700, align: 'center' });
    });
    const lx = x0 + 3 * (u + g) + 8, ly = y0 + 2 * X + 2 * g + u / 2;
    if (step === 1) { text(ctx, 'pair: 6 and 1', lx, ly, { color: col.s[2], size: 12, weight: 700 }); }
    if (step === 2) { text(ctx, '6 strips = 6x', lx, ly - 8, { color: col.s[1], size: 12, weight: 700 }); text(ctx, '1 strip = x', lx, ly + 8, { color: col.s[4], size: 12, weight: 700 }); }
    if (step >= 3 && p > 0.95) {
      text(ctx, 'x + 3', rx + rw / 2, ry + 2 * X + u + 12, { color: col.ink, size: 13, weight: 700, align: 'center' });
      text(ctx, '2x + 1', rx - 8, ry + (2 * X + u) / 2, { color: col.ink, size: 13, weight: 700, align: 'right' });
    }
    if (step === 4) text(ctx, 'x = −3 or x = −½', w / 2, h - 32, { color: col.s[1], size: 13, weight: 700, align: 'center' });
    text(ctx, CAP[step], w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(4, i); tp = step >= 3 ? 1 : 0; cv.redraw(); } };
}
