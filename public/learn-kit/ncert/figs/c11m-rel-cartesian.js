// Class 11 Maths, Relations and Functions: the Cartesian product A × B is the set of ALL ordered pairs (a, b) with a from A and b from B, so it has
// n(A) × n(B) pairs, and (a, b) is not (b, a). A relation from A to B is any chosen part (subset) of A × B. Tap cells to choose a relation.
import { canvas, text, title, row, slider, button, choice, readout } from '../../kit.js';
import { pos } from '../c11m-lib.js';

const AL = [1, 2, 3, 4, 5], BL = ['p', 'q', 'r', 'u', 'v'];
export default function (host) {
  let m = 3, n = 2, R = new Set(['0,0', '1,1']), flip = false, G = null;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 290, label: 'Grid of all ordered pairs of two sets; tapped pairs form a relation' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, flip ? 'B × A: every pair (b, a)' : 'A × B: every pair (a, b). Tap to pick a relation', col), cs = Math.min(46, (w - 70) / 5), x0 = 44, y0 = top + 16, cols = flip ? n : m, rows = flip ? m : n;
    G = { x0, y0, cs, cols, rows };
    const first = flip ? BL : AL, second = flip ? AL : BL;
    for (let i = 0; i < cols; i++) text(ctx, String(first[i]), x0 + i * cs + cs / 2, y0 - 8, { color: col.s[0], size: 13, weight: 800, align: 'center' });
    for (let j = 0; j < rows; j++) text(ctx, String(second[j]), x0 - 14, y0 + (rows - 1 - j) * cs + cs / 2, { color: col.s[2], size: 13, weight: 800, align: 'center' });
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const ai = flip ? j : i, bi = flip ? i : j, on = R.has(ai + ',' + bi), x = x0 + i * cs, y = y0 + (rows - 1 - j) * cs;
      ctx.fillStyle = on ? col.s[3] : col.soft; ctx.globalAlpha = on ? 0.35 : 1; ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2); ctx.globalAlpha = 1; ctx.strokeStyle = col.line; ctx.strokeRect(x + 1, y + 1, cs - 2, cs - 2);
      text(ctx, flip ? `(${first[i]},${second[j]})` : `(${first[i]},${second[j]})`, x + cs / 2, y + cs / 2, { color: on ? col.ink : col.muted, size: 11, weight: on ? 800 : 500, align: 'center' });
    }
    const ly = y0 + rows * cs + 20, pairs = [...R].map((k) => k.split(',').map(Number)).filter(([a, b]) => a < m && b < n).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    text(ctx, `n(A) = ${m}, n(B) = ${n}  →  n(A × B) = ${m} × ${n} = ${m * n}`, 10, ly, { color: col.ink, size: 12.5, weight: 700 });
    text(ctx, 'R = {' + pairs.map(([a, b]) => `(${AL[a]},${BL[b]})`).join(', ') + '}', 10, ly + 22, { color: col.s[3], size: 12.5, weight: 700 });
    out.innerHTML = `A = {${AL.slice(0, m).join(', ')}}, B = {${BL.slice(0, n).join(', ')}}. R has <b>${pairs.length}</b> pairs. Domain of R = {${[...new Set(pairs.map((p) => AL[p[0]]))].join(', ')}}, range = {${[...new Set(pairs.map((p) => BL[p[1]]))].join(', ')}}. Number of different relations from A to B: 2<sup>${m * n}</sup> = <b>${2 ** (m * n)}</b>.`;
  };
  cv.c.addEventListener('pointerdown', (e) => { const [x, y] = pos(cv.c, e), i = Math.floor((x - G.x0) / G.cs), jr = Math.floor((y - G.y0) / G.cs); if (i < 0 || i >= G.cols || jr < 0 || jr >= G.rows) return; const j = G.rows - 1 - jr, k = flip ? j + ',' + i : i + ',' + j; R.has(k) ? R.delete(k) : R.add(k); cv.redraw(); });
  const r = row(host);
  slider(r, { label: 'n(A)', min: 1, max: 5, step: 1, value: m, fmt: (v) => v, oninput: (v) => { m = v; cv.redraw(); } });
  slider(r, { label: 'n(B)', min: 1, max: 5, step: 1, value: n, fmt: (v) => v, oninput: (v) => { n = v; cv.redraw(); } });
  choice(r, 'Show', [['ab', 'A × B'], ['ba', 'B × A']], 'ab', (v) => { flip = v === 'ba'; cv.redraw(); });
  button(r, 'Clear', () => { R.clear(); cv.redraw(); }); button(r, 'Select all', () => { for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) R.add(i + ',' + j); cv.redraw(); });
  cv.redraw();
}
