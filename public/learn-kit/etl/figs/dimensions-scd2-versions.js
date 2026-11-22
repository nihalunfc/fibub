// 5.2 Watch it happen: an SCD2 menu dimension. The Classic Burger's price changes on 1 March and 1 July. Each
// change closes the current version (valid_to = change date) and opens a new one with a new surrogate key.
// Orders join to the version whose half-open interval [valid_from, valid_to) contains the order time.
import { canvas, axes, text, title, line, dot, calm, ease, loop } from '../../kit.js';
import { box, grid, wrap } from './c-draw.js';

const V = [
  { key: 101, price: '$6.49', from: 0, to: 2, f: 'Jan 1', t: 'Mar 1' },
  { key: 214, price: '$6.99', from: 2, to: 6, f: 'Mar 1', t: 'Jul 1' },
  { key: 388, price: '$7.29', from: 6, to: 12, f: 'Jul 1', t: '9999-12-31' },
];
const SHOW = [1, 2, 2, 3, 3]; // versions visible per step
const NOTE = [
  'One version so far: key 101, open-ended (valid_to 9999-12-31), current.',
  '1 March: the snapshot shows a new price. Close 101 at Mar 1 and open key 214.',
  'An order on 20 Feb picks key 101. An order at Mar 1 00:00 picks only key 214.',
  '1 July: another change. Close 214, open key 388. Three rows, one burger.',
  'Checks: each valid_to equals the next valid_from (no gaps or overlaps), one current row.',
];
const M = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 390, min: 340, label: 'Timeline of three versions of a menu item in a slowly changing dimension' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.6); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'SCD2: one row per version', col);
    const A = axes(ctx, w, 190, col, { x: [0, 12], y: [0, 3.4], xt: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], fx: (v) => M[v], yt: [], grid: false, l: 14, r: 14, t: 46, b: 26 });
    const n = SHOW[step], a = ease(k);
    V.slice(0, n).forEach((v, i) => {
      const fresh = (i === n - 1 && (step === 1 || step === 3)), al = fresh ? a : 1;
      const to = i === n - 1 ? 12 : v.to;
      const y = A.Y(3 - i) - 9;
      box(ctx, A.X(v.from) + 1, y, (A.X(to) - A.X(v.from)) * (fresh ? a : 1) - 2, 18, { fill: col.s[i] + '55', stroke: col.s[i], width: 1.2, r: 3, alpha: al });
      text(ctx, `${v.key} · ${v.price}`, A.X(v.from) + 6, y + 9, { color: col.ink, size: 10.5, weight: 700, fit: false });
    });
    if (step === 2) {
      const xs = [[1.65, 0, 'Feb 20 → 101'], [2, 1, 'Mar 1 00:00 → 214']];
      xs.forEach(([x, i, s], j) => {
        line(ctx, [[A.X(x), A.T - 4], [A.X(x), A.Y(3 - i)]], col.s[3], 1.5, [3, 3]);
        dot(ctx, A.X(x), A.Y(3 - i), 5, col.s[3], col.panel);
        text(ctx, s, A.X(x) + (j ? 8 : -8), A.T - 9, { color: col.ink, size: 10, align: j ? 'left' : 'right', halo: col.panel });
      });
    }
    const W = w - 16;
    const rows = V.slice(0, n).map((v, i) => [v.key, v.price, v.f, i === n - 1 ? '9999-12-31' : v.t, i === n - 1 ? 'yes' : 'no']);
    grid(ctx, 8, 200, [{ w: W * 0.14, label: 'key' }, { w: W * 0.17, label: 'price' }, { w: W * 0.2, label: 'valid_from' }, { w: W * 0.3, label: 'valid_to' }, { w: W * 0.19, label: 'current' }], rows, col,
      { rh: 19, hi: (i) => (step === 4 ? (col.good || col.s[2]) + '22' : (i === n - 1 && (step === 1 || step === 3) ? col.s[1] + '33' : null)) });
    wrap(ctx, NOTE[step], 8, h - 34, w - 16, { color: col.ink, size: 11, weight: 600 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
