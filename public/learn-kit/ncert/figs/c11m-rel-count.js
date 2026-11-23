// Class 11 Maths, Relations and Functions: how many relations and functions exist between two small sets? With n(A) = m and n(B) = n there are
// mn ordered pairs; a relation is any subset of them (2^(mn) choices); a function gives each of the m inputs one of n outputs (n^m choices).
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let m = 2, n = 3;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'Bar chart of the number of pairs, relations and functions between two sets' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `A has ${m} elements, B has ${n}`, col), perm = (() => { let p = 1; for (let i = 0; i < m; i++) p *= Math.max(0, n - i); return p; })();
    const rows = [['ordered pairs in A × B', m * n, col.s[0], 'm × n'], ['relations from A to B', 2 ** (m * n), col.s[3], '2^(mn)'], ['functions from A to B', n ** m, col.s[2], 'n^m'], ['one-one functions', perm, col.s[4], 'n(n−1)…(n−m+1)']];
    const mx = Math.log10(Math.max(...rows.map((r) => r[1])) + 1) || 1, bh = 26, gy = top + 10;
    rows.forEach(([name, v, c, f], i) => {
      const y = gy + i * 58; text(ctx, `${name}  (${f})`, 12, y + 4, { color: col.muted, size: 11.5, weight: 600 });
      const bw = Math.max(2, ((Math.log10(v + 1) / mx) * (w - 24)) * 0.8); ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(12, y + 14, bw, bh); ctx.globalAlpha = 1;
      text(ctx, v.toLocaleString('en-IN'), 16 + bw, y + 14 + bh / 2, { color: col.ink, size: 14, weight: 800 });
    });
    text(ctx, 'Bar length uses a log scale, because these numbers explode.', 12, h - 10, { color: col.muted, size: 10.5 });
    out.innerHTML = `Every function is a relation, but only ${n ** m} of the ${(2 ** (m * n)).toLocaleString('en-IN')} relations are functions.`;
  };
  const r = row(host);
  slider(r, { label: 'n(A) = m', min: 1, max: 4, step: 1, value: m, fmt: (v) => v, oninput: (v) => { m = v; cv.redraw(); } });
  slider(r, { label: 'n(B) = n', min: 1, max: 4, step: 1, value: n, fmt: (v) => v, oninput: (v) => { n = v; cv.redraw(); } });
  cv.redraw();
}
