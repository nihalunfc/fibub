// Class 12 Maths, Composite functions: two machines in a row. Choose f and g and which goes first. A number travels through both machines;
// g∘f means "f first, then g". Swapping the order usually gives a different answer.
import { canvas, text, title, row, slider, choice, loop, dot, arrow, ease } from '../../kit.js';

const M = { add: ['x + 3', (x) => x + 3], dbl: ['2x', (x) => 2 * x], sq: ['x²', (x) => x * x], neg: ['5 − x', (x) => 5 - x] };
const fm = (v) => (+v.toFixed(2)).toString().replace('-', '−');
export default function (host) {
  let fk = 'add', gk = 'sq', x = 2, order = 'gf', t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A number passing through machine f and then machine g to show composition' });
  cv.draw = (ctx, w, h, col) => {
    const first = order === 'gf' ? 'f' : 'g', fn = { f: M[fk], g: M[gk] };
    title(ctx, order === 'gf' ? 'g∘f: x goes into f first, then g' : 'f∘g: x goes into g first, then f', col);
    const A = fn[first], B = fn[first === 'f' ? 'g' : 'f'], mid = A[1](x), out = B[1](mid), bw = Math.min(84, w * 0.22), by = 100, bh = 54;
    const xs = [w * 0.17, w * 0.5, w * 0.83], bx = [w * 0.33 - bw / 2, w * 0.67 - bw / 2];
    [[first, A, bx[0]], [first === 'f' ? 'g' : 'f', B, bx[1]]].forEach(([nm, m, X], i) => {
      ctx.fillStyle = col.soft; ctx.fillRect(X, by, bw, bh); ctx.strokeStyle = col.s[i * 2]; ctx.lineWidth = 2; ctx.strokeRect(X, by, bw, bh);
      text(ctx, nm, X + bw / 2, by + 15, { color: col.s[i * 2], size: 13, weight: 700, align: 'center' }); text(ctx, m[0], X + bw / 2, by + 36, { color: col.ink, size: 13, align: 'center' });
    });
    arrow(ctx, 12, by + bh / 2, bx[0] - 2, by + bh / 2, col.muted, 1.5, 6); arrow(ctx, bx[0] + bw + 2, by + bh / 2, bx[1] - 2, by + bh / 2, col.muted, 1.5, 6); arrow(ctx, bx[1] + bw + 2, by + bh / 2, w - 12, by + bh / 2, col.muted, 1.5, 6);
    // moving token over the cycle: 0..1 enters A, 1..2 mid, 2..3 out
    const p = (t % 4) / 4 * 3, sx = [12, bx[0] + bw / 2, bx[1] + bw / 2, w - 22];
    const s = Math.min(2, Math.floor(p)), u = ease(p - s), px = s < 2 ? sx[s] + (sx[s + 1] - sx[s]) * u : sx[2] + (sx[3] - sx[2]) * u, val = p < 1 ? x : p < 2 ? mid : out;
    dot(ctx, Math.max(22, Math.min(w - 22, px)), by + bh / 2 - 38, 14, col.s[3], col.panel); text(ctx, fm(val), Math.max(22, Math.min(w - 22, px)), by + bh / 2 - 38, { color: col.panel, size: 10.5, weight: 700, align: 'center' });
    text(ctx, `x = ${fm(x)}`, 12, by + bh + 22, { color: col.ink, size: 12, weight: 600 }); text(ctx, `after ${first}: ${fm(mid)}`, w / 2, by + bh + 22, { color: col.ink, size: 12, weight: 600, align: 'center' }); text(ctx, `out: ${fm(out)}`, w - 12, by + bh + 22, { color: col.ink, size: 12, weight: 600, align: 'right' });
    const gof = M[gk][1](M[fk][1](x)), fog = M[fk][1](M[gk][1](x));
    text(ctx, `g(f(${fm(x)})) = ${fm(gof)}`, 12, by + bh + 62, { color: col.s[0], size: 12.5, weight: 700 });
    text(ctx, `f(g(${fm(x)})) = ${fm(fog)}`, 12, by + bh + 84, { color: col.s[2], size: 12.5, weight: 700 });
    text(ctx, Math.abs(gof - fog) < 1e-9 ? 'Same here, but this is luck' : 'Different: g∘f is not f∘g', 12, by + bh + 108, { color: col.ink, size: 12, weight: 700 });
  };
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  const r = row(host); anim.button(r);
  choice(r, 'f(x) =', Object.entries(M).map(([k, v]) => [k, v[0]]), fk, (v) => { fk = v; cv.redraw(); });
  choice(r, 'g(x) =', Object.entries(M).map(([k, v]) => [k, v[0]]), gk, (v) => { gk = v; cv.redraw(); });
  choice(r, 'Order', [['gf', 'g∘f (f first)'], ['fg', 'f∘g (g first)']], order, (v) => { order = v; cv.redraw(); });
  slider(r, { label: 'x', min: -4, max: 6, step: 1, value: 2, fmt: (v) => String(v), oninput: (v) => { x = v; cv.redraw(); } });
  cv.redraw();
}
