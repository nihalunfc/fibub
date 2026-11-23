// Class 12 Maths, Functions: how many functions are there from a set with m elements to a set with n elements? n^m in all;
// n!/(n-m)! one-one; m! bijections when m = n; and the onto count by inclusion-exclusion. Bars use a log scale so small counts stay visible.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
const onto = (m, n) => { let s = 0; for (let k = 0; k <= n; k++) s += (-1) ** k * C(n, k) * (n - k) ** m; return s; };
const perm = (n, m) => { let r = 1; for (let i = 0; i < m; i++) r *= n - i; return m > n ? 0 : r; };
const fact = (m) => (m <= 1 ? 1 : m * fact(m - 1));
export default function (host) {
  let m = 3, n = 4;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Bars comparing the number of all, one-one, onto and bijective functions from a set of m to a set of n elements' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `Functions from a set of ${m} to a set of ${n}`, col);
    const rows = [['all functions', n ** m, `${n}^${m}`], ['one-one', perm(n, m), `${n}P${m}`], ['onto', onto(m, n), 'inclusion-exclusion'], ['bijective', m === n ? fact(m) : 0, m === n ? `${m}!` : 'needs m = n'], ['relations', 2 ** (m * n), `2^${m * n}`]];
    const mx = Math.log10(1 + Math.max(...rows.map((r) => r[1]))), bx = 10, bw = w - 20, rh = (h - top - 14) / rows.length;
    rows.forEach(([name, v, how], i) => {
      const y = top + 10 + i * rh, len = Math.max(v ? 4 : 0, (bw * Math.log10(1 + v)) / mx);
      text(ctx, `${name} (${how})`, bx, y + 8, { color: col.muted, size: 10.5 });
      ctx.fillStyle = col.s[i % 8]; ctx.globalAlpha = 0.85; ctx.fillRect(bx, y + 18, len, rh - 34); ctx.globalAlpha = 1;
      text(ctx, v.toLocaleString('en-IN'), Math.min(bx + len + 6, w - 60), y + 18 + (rh - 34) / 2, { color: len > bw - 60 ? col.panel : col.ink, size: 12, weight: 700, halo: len > bw - 60 ? undefined : col.panel });
    });
    out.textContent = m > n ? 'More inputs than outputs: no one-one function exists (two inputs must share an output).' : m < n ? 'Fewer inputs than outputs: no onto function exists (some output is left over).' : 'Same size: one-one, onto and bijective are all the same thing here.';
  };
  const r = row(host);
  slider(r, { label: 'Elements in A (m)', min: 1, max: 5, step: 1, value: 3, fmt: String, oninput: (v) => { m = v; cv.redraw(); } });
  slider(r, { label: 'Elements in B (n)', min: 1, max: 5, step: 1, value: 4, fmt: String, oninput: (v) => { n = v; cv.redraw(); } });
  cv.redraw();
}
