// Class 11 Maths, Sets: subsets and the power set. A set with n elements has 2^n subsets, because every element is either in or out (two choices each).
// Tap the element chips (or move the slider) to build a subset; every subset of the set is listed below, the current one lit.
import { canvas, text, title, row, slider, readout } from '../../kit.js';
import { chip } from '../c11m-lib.js';

const NAMES = ['a', 'b', 'c', 'd', 'e'];
export default function (host) {
  let n = 3, mask = 5, rects = [];
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'All subsets of a set, with the chosen subset highlighted' });
  const out = readout(host);
  const lab = (m) => '{' + NAMES.slice(0, n).filter((_, i) => m >> i & 1).join(',') + '}';
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `Subsets of {${NAMES.slice(0, n).join(', ')}}: tap a letter`, col), cw = 40, gap = 8, x0 = (w - n * cw - (n - 1) * gap) / 2;
    rects = [];
    for (let i = 0; i < n; i++) { const x = x0 + i * (cw + gap); rects.push([x, top + 4, cw, 34]); chip(ctx, x, top + 4, cw, 34, NAMES[i], !!(mask >> i & 1), col, 16); }
    text(ctx, 'binary code: ' + [...Array(n).keys()].reverse().map((i) => mask >> i & 1).join(' '), w / 2, top + 52, { color: col.muted, size: 12, align: 'center' });
    const total = 1 << n, cols = n <= 3 ? 4 : n === 4 ? 4 : 4, rows = Math.ceil(total / cols), gy = top + 70, ch = Math.min(26, (h - gy - 8) / rows), cwid = (w - 16) / cols;
    for (let m = 0; m < total; m++) {
      const cx = 8 + (m % cols) * cwid, cyy = gy + Math.floor(m / cols) * ch, on = m === mask, sub = (m & mask) === m;
      ctx.fillStyle = on ? col.s[0] : sub ? col.soft : col.panel; ctx.globalAlpha = on ? 0.9 : 1; ctx.fillRect(cx + 1, cyy + 1, cwid - 2, ch - 2); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.line; ctx.strokeRect(cx + 1, cyy + 1, cwid - 2, ch - 2);
      text(ctx, m === 0 ? '∅' : lab(m), cx + cwid / 2, cyy + ch / 2, { color: on ? col.panel : col.ink, size: n === 5 ? 11 : 12, weight: on ? 800 : 500, align: 'center' });
    }
    const subs = []; for (let m = 0; m < total; m++) if ((m & mask) === m) subs.push(m);
    out.innerHTML = `Chosen subset: <b>${mask === 0 ? '∅' : lab(mask)}</b>. The set has n = ${n} elements, so there are 2<sup>${n}</sup> = <b>${total}</b> subsets. The shaded cells are the subsets of the chosen one (${subs.length} = 2<sup>${[...Array(n).keys()].filter((i) => mask >> i & 1).length}</sup>).`;
  };
  cv.c.addEventListener('pointerdown', (e) => { const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top; rects.forEach(([rx, ry, rw, rh], i) => { if (x >= rx && x <= rx + rw && y >= ry && y <= ry + rh) { mask ^= 1 << i; cv.redraw(); } }); });
  slider(row(host), { label: 'Elements n', min: 1, max: 5, step: 1, value: n, fmt: (v) => v, oninput: (v) => { n = v; mask &= (1 << n) - 1; cv.redraw(); } });
  cv.redraw();
}
