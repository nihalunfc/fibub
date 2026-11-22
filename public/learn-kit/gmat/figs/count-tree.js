// 5.3 The counting principle as a tree: every choice branches, and the leaves multiply.
import { canvas, text, line, dot, row, slider, readout, title } from '../../kit.js';
export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 340, min: 240, label: 'A tree of choices', mark: 'bl' });
  let a = 3, b = 2, c = 2;
  const ctl = row(host), f = (v) => String(Math.round(v));
  slider(ctl, { label: 'Mains', min: 1, max: 4, step: 1, value: a, fmt: f, oninput: (v) => { a = Math.round(v); go(); } });
  slider(ctl, { label: 'Drinks', min: 1, max: 3, step: 1, value: b, fmt: f, oninput: (v) => { b = Math.round(v); go(); } });
  slider(ctl, { label: 'Desserts', min: 1, max: 3, step: 1, value: c, fmt: f, oninput: (v) => { c = Math.round(v); go(); } });
  const out = readout(host);
  const go = () => { cv.redraw(); out.innerHTML = `${a} × ${b} × ${c} = <b>${a * b * c}</b> different meals: one for each leaf on the right. "And" between choices means multiply.`; };
  cv.draw = (ctx, w, h, col) => {
    const xs = [30, w * 0.33, w * 0.62, w - 30], leaves = a * b * c, T = 30, B = h - 14, Y = (i, n) => T + ((i + 0.5) / n) * (B - T);
    dot(ctx, xs[0], (T + B) / 2, 5, col.ink);
    for (let i = 0; i < a; i++) {
      const y1 = Y(i, a); line(ctx, [[xs[0], (T + B) / 2], [xs[1], y1]], col.s[0], 1.5); dot(ctx, xs[1], y1, 4, col.s[0]);
      for (let j = 0; j < b; j++) {
        const k = i * b + j, y2 = Y(k, a * b); line(ctx, [[xs[1], y1], [xs[2], y2]], col.s[1], 1.2); dot(ctx, xs[2], y2, 3.5, col.s[1]);
        for (let l = 0; l < c; l++) { const y3 = Y(k * c + l, leaves); line(ctx, [[xs[2], y2], [xs[3], y3]], col.s[2], 1); dot(ctx, xs[3], y3, 3, col.s[2]); }
      }
    }
    ['main', 'drink', 'dessert'].forEach((s, i) => text(ctx, s, xs[i + 1], 14, { color: col.muted, size: 11, align: 'center' }));
    title(ctx, '', col);
  };
  go();
}
