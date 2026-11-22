// Class 10 Light (step player): the image made by a concave mirror for every position of the object, then a convex
// mirror. Each step moves the object to one of the standard places (far away, beyond C, at C, between C and F, at F,
// between F and P) and draws the principal rays and the image, with the numbers from 1/v + 1/u = 1/f (f = 10 cm).
import { canvas, text, title } from '../../kit.js';
import { drawMirror, mirrorImage, mirrorNature } from './c10-light-mirror.js';

const CASES = [
  ['concave', 45, 'Object far away (at infinity)', true], ['concave', 30, 'Object beyond C'], ['concave', 20, 'Object at C'],
  ['concave', 14, 'Object between C and F'], ['concave', 10, 'Object at F'], ['concave', 5, 'Object between F and P'],
  ['convex', 18, 'Convex mirror: object anywhere in front'],
];
export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.68, max: 440, min: 290, label: 'Image formed by a concave mirror for each object position, and by a convex mirror' });
  cv.draw = (ctx, w, h, col) => {
    const [type, d, name, far] = CASES[step];
    title(ctx, name, col);
    drawMirror(ctx, w, h, col, type, d, { far, quiet: true, cyf: 0.42 });
    const { v, m } = mirrorImage(type, d);
    const nat = far ? 'real, inverted, a point at F, highly diminished' : mirrorNature(type, d);
    const nums = far ? 'u = −∞, v = f = −10 cm' : `u = −${d} cm, v = ${Number.isFinite(v) ? v.toFixed(1) : '∞'} cm, m = ${Number.isFinite(m) ? m.toFixed(2) : '∞'}`;
    text(ctx, nums, 10, h - 34, { color: col.ink, size: 11.5, weight: 700 });
    text(ctx, nat, 10, h - 14, { color: col.s[3], size: 11, weight: 700 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, CASES.length - 1); cv.redraw(); } };
}
