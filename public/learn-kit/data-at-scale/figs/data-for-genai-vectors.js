// 6.3 Vector search in two dimensions: products placed by meaning, a question embedded into the same space,
// its nearest neighbours by cosine, a permission or stock filter, and the chunks handed to the language model.
import { canvas, text, title, line, dot } from '../../kit.js';

// [name, x, y, label side]. Cosine looks only at direction, so items far from the centre can still be the closest match.
const ITEMS = [
  ['rain coat', 0.55, 0.43, 'r'], ['waterproof jacket', 0.75, 0.44, 'l'], ['umbrella', 0.35, 0.6, 'r'], ['wellington boots', 0.45, 0.2, 'l'], ['storm poncho (out of stock)', 0.95, 0.72, 'r'],
  ['jacket potato', -0.7, 0.55, 'l'], ['baked beans', -0.8, 0.3, 'l'], ['potato salad', -0.55, 0.75, 'l'], ['sun cream', 0.15, -0.8, 'l'], ['sunglasses', 0.45, -0.55, 'l'],
];
const Q = [0.82, 0.64];
const cos = (a, b) => (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b));
const NAMES = ['Every product gets a position by meaning', 'The question is embedded into the same space', 'Nearest by direction (cosine similarity)', 'Filters: drop what the shopper cannot buy', 'The top matches go into the prompt'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 380, min: 260, label: 'Products as points in an embedding space and the nearest ones to a question' });
  let s = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, NAMES[s], col) + 4;
    const cx = w / 2, cy = top + (h - top - 26) / 2, sc = Math.min(w / 2 - 16, (h - top - 30) / 2) * 0.95;
    const P = (x, y) => [cx + x * sc, cy - y * sc];
    line(ctx, [P(-1, 0), P(1, 0)], col.line, 1); line(ctx, [P(0, -1), P(0, 1)], col.line, 1);
    const ranked = ITEMS.map((it) => [it, cos([it[1], it[2]], Q)]).sort((a, b) => b[1] - a[1]);
    const filtered = ranked.filter(([it]) => !(s >= 3 && it[0].includes('out of stock')));
    const top3 = filtered.slice(0, 3).map(([it]) => it[0]);
    if (s >= 1) { const [qx, qy] = P(...Q); line(ctx, [P(0, 0), [qx, qy]], col.s[3], 2, [5, 4]); }
    ITEMS.forEach(([name, x, y, side]) => {
      const [px, py] = P(x, y), hit = s >= 2 && top3.includes(name), gone = s >= 3 && name.includes('out of stock');
      if (hit && s >= 2) line(ctx, [P(0, 0), [px, py]], col.s[0], 1.5);
      dot(ctx, px, py, hit ? 6 : 4.5, gone ? col.panel : hit ? col.s[0] : col.muted, gone ? col.bad : null);
      const right = side === 'l';
      text(ctx, name.replace(' (out of stock)', gone ? ' ✕' : ''), px + (right ? 8 : -8), py - 8, { color: hit ? col.ink : col.muted, size: 10, weight: hit ? 700 : 400, align: right ? 'left' : 'right' });
    });
    if (s >= 1) { const [qx, qy] = P(...Q); dot(ctx, qx, qy, 7, col.s[3]); text(ctx, 'question', qx + 9, qy + 10, { color: col.s[3], size: 11, weight: 700 }); }
    const foot = s === 0 ? 'Close together = similar meaning' : s === 1 ? '"something to keep me dry in a storm"' : s === 2 ? 'Top 3: ' + top3.join(', ') : s === 3 ? 'Out of stock removed; next best moves up' : 'Prompt = question + top 3, with sources to cite';
    text(ctx, foot, 10, h - 12, { color: col.ink, size: 11.5, weight: 700 });
  };
  cv.redraw();
  return { step(i) { s = i; cv.redraw(); } };
}
