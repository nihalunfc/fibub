// Class 12 Maths, Relations: the Cartesian product A x B as a grid of pairs. Any subset of the grid is a relation from A to B, so there are
// 2^(m n) of them. Tap points to build one; the figure shows its domain, range and whether it happens to be a function.
import { canvas, text, title, row, slider, button, dot, readout } from '../../kit.js';

export default function (host) {
  let m = 3, n = 3; const S = new Set(); let geo = {};
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A grid of the pairs of A times B where tapped points form a relation with its domain and range' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Tap pairs (a, b) to build a relation from A to B', col), L = 40, B = h - 34, cell = Math.min((w - L - 30) / m, (B - top - 10) / n);
    geo = { L, B, cell };
    const dom = new Set([...S].map((s) => +s.split(',')[0])), ran = new Set([...S].map((s) => +s.split(',')[1]));
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
      const x = L + (i - 0.5) * cell, y = B - (j - 0.5) * cell, on = S.has(i + ',' + j);
      ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(x - cell / 2, y - cell / 2, cell, cell);
      dot(ctx, x, y, Math.min(11, cell / 3), on ? col.s[0] : col.soft, on ? col.ink : col.line);
    }
    for (let i = 1; i <= m; i++) text(ctx, String(i), L + (i - 0.5) * cell, B + 12, { color: dom.has(i) ? col.s[2] : col.muted, size: 12, weight: dom.has(i) ? 800 : 400, align: 'center' });
    for (let j = 1; j <= n; j++) text(ctx, String(j), L - 12, B - (j - 0.5) * cell, { color: ran.has(j) ? col.s[3] : col.muted, size: 12, weight: ran.has(j) ? 800 : 400, align: 'center' });
    text(ctx, 'A →', w - 8, B + 24, { color: col.muted, size: 11, align: 'right' }); text(ctx, 'B ↑', 6, top + 10, { color: col.muted, size: 11 });
    const isF = [...Array(m)].every((_, i) => [...S].filter((s) => +s.split(',')[0] === i + 1).length === 1);
    out.innerHTML = `|A × B| = ${m} × ${n} = <b>${m * n}</b> pairs, so there are 2<sup>${m * n}</sup> = <b>${(2 ** (m * n)).toLocaleString('en-IN')}</b> relations from A to B. Yours has ${S.size} pair${S.size === 1 ? '' : 's'}. Domain {${[...dom].sort().join(', ')}}, range {${[...ran].sort().join(', ')}}. ${isF ? '<b>It is a function</b>: one point in every column.' : 'Not a function: each column needs exactly one point.'}`;
  };
  cv.c.addEventListener('pointerdown', (e) => {
    const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left - geo.L, y = geo.B - (e.clientY - b.top), i = Math.floor(x / geo.cell) + 1, j = Math.floor(y / geo.cell) + 1;
    if (i >= 1 && j >= 1 && i <= m && j <= n) { const k = i + ',' + j; S.has(k) ? S.delete(k) : S.add(k); cv.redraw(); }
  });
  const r = row(host);
  const trim = () => { [...S].forEach((s) => { const [i, j] = s.split(',').map(Number); if (i > m || j > n) S.delete(s); }); cv.redraw(); };
  slider(r, { label: 'Elements in A', min: 1, max: 5, step: 1, value: 3, fmt: String, oninput: (v) => { m = v; trim(); } });
  slider(r, { label: 'Elements in B', min: 1, max: 5, step: 1, value: 3, fmt: String, oninput: (v) => { n = v; trim(); } });
  button(r, 'Clear', () => { S.clear(); cv.redraw(); });
  cv.redraw();
}
