// Class 10 Light (step player): the image made by a convex lens for every position of the object (far away, beyond
// 2F, at 2F, between F and 2F, at F, between F and the lens), then a concave lens. The numbers come from the lens
// formula 1/v - 1/u = 1/f with f = 10 cm.
import { canvas, text, title } from '../../kit.js';
import { drawLens, lensImage, lensNature } from './c10-light-lens.js';

const CASES = [
  ['convex', 32, 'Object far away (at infinity)', true], ['convex', 30, 'Object beyond 2F'], ['convex', 20, 'Object at 2F'],
  ['convex', 14, 'Object between F and 2F'], ['convex', 10, 'Object at F'], ['convex', 5, 'Object between F and the lens'],
  ['concave', 16, 'Concave lens: object anywhere in front'],
];
export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.68, max: 440, min: 290, label: 'Image formed by a convex lens for each object position, and by a concave lens' });
  cv.draw = (ctx, w, h, col) => {
    const [type, d, name, far] = CASES[step];
    title(ctx, name, col);
    drawLens(ctx, w, h, col, type, d, { far, quiet: true, cyf: 0.42 });
    const { v, m } = lensImage(type, d);
    const nat = far ? 'real, inverted, a point at F, highly diminished' : lensNature(type, d);
    const nums = far ? 'u = −∞, v = f = +10 cm' : `u = −${d} cm, v = ${Number.isFinite(v) ? v.toFixed(1) : '∞'} cm, m = ${Number.isFinite(m) ? m.toFixed(2) : '∞'}`;
    text(ctx, nums, 10, h - 34, { color: col.ink, size: 11.5, weight: 700 });
    text(ctx, nat, 10, h - 14, { color: col.s[3], size: 11, weight: 700 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, CASES.length - 1); cv.redraw(); } };
}
