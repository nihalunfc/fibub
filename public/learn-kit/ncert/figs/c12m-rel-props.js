// Class 12 Maths, Relations: tap the 4 x 4 grid to put pairs (a, b) into a relation on {1,2,3,4}. The arrow diagram redraws and the
// three tests (reflexive, symmetric, transitive) report the first pair that breaks each rule. All three true = equivalence relation.
import { canvas, text, title, row, choice, button, dot, arrow } from '../../kit.js';

const PRE = {
  eq: ['a = b', (a, b) => a === b], le: ['a ≤ b', (a, b) => a <= b], lt: ['a < b', (a, b) => a < b],
  par: ['same parity', (a, b) => (a - b) % 2 === 0], div: ['a divides b', (a, b) => b % a === 0], near: ['|a − b| = 1', (a, b) => Math.abs(a - b) === 1],
};
export default function (host) {
  const N = 4, R = Array.from({ length: N }, () => Array(N).fill(false));
  const load = (k) => { for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) R[i][j] = PRE[k][1](i + 1, j + 1); };
  load('par');
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 310, label: 'A relation on the set 1 to 4 as a grid and arrow diagram, with tests for reflexive, symmetric and transitive' });
  let geo = null;
  const tests = () => {
    let r = null, s = null, t = null;
    for (let i = 0; i < N && !r; i++) if (!R[i][i]) r = `(${i + 1}, ${i + 1}) is missing`;
    for (let i = 0; i < N && !s; i++) for (let j = 0; j < N && !s; j++) if (R[i][j] && !R[j][i]) s = `(${i + 1}, ${j + 1}) is in, (${j + 1}, ${i + 1}) is not`;
    for (let i = 0; i < N && !t; i++) for (let j = 0; j < N && !t; j++) if (R[i][j]) for (let k = 0; k < N && !t; k++) if (R[j][k] && !R[i][k]) t = `(${i + 1},${j + 1}) and (${j + 1},${k + 1}) are in, (${i + 1},${k + 1}) is not`;
    return { r, s, t };
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Tap a cell to add or remove the pair (row, column)', col);
    const cs = Math.min(36, (w - 40) * 0.5 / (N + 1)), gx = 26, gy = top + 24;
    geo = { gx, gy, cs };
    for (let i = 0; i < N; i++) {
      text(ctx, String(i + 1), gx + i * cs + cs / 2, gy - 9, { color: col.muted, size: 11, align: 'center' });
      text(ctx, String(i + 1), gx - 10, gy + i * cs + cs / 2, { color: col.muted, size: 11, align: 'center' });
      for (let j = 0; j < N; j++) {
        const x = gx + j * cs, y = gy + i * cs;
        ctx.fillStyle = R[i][j] ? col.s[0] : col.soft; ctx.globalAlpha = R[i][j] ? 0.85 : 1; ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2); ctx.globalAlpha = 1;
        if (R[i][j]) text(ctx, '✓', x + cs / 2, y + cs / 2, { color: col.panel, size: 13, weight: 700, align: 'center' });
      }
    }
    // arrow diagram: dots in a row pair of rings
    const rx0 = gx + N * cs + 18, cx = (rx0 + w - 10) / 2, cy = gy + (N * cs) / 2, rad = Math.min((w - rx0 - 24) / 2, N * cs / 2 - 6);
    const P = (i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / N; return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)]; };
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (R[i][j]) {
      const [x0, y0] = P(i), [x1, y1] = P(j);
      if (i === j) { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.5; const dx = x0 - cx, dy = y0 - cy, d = Math.hypot(dx, dy) || 1; ctx.beginPath(); ctx.arc(x0 + (dx / d) * 9, y0 + (dy / d) * 9, 6, 0, 7); ctx.stroke(); continue; }
      const dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy), nx = -dy / d * 3.5, ny = dx / d * 3.5, ux = dx / d, uy = dy / d;
      arrow(ctx, x0 + nx + ux * 8, y0 + ny + uy * 8, x1 + nx - ux * 8, y1 + ny - uy * 8, col.s[0], 1.4, 6);
    }
    for (let i = 0; i < N; i++) { const [x, y] = P(i); dot(ctx, x, y, 9, col.panel, col.ink); text(ctx, String(i + 1), x, y, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    const T = tests(), by = gy + N * cs + 22, ok = (v) => (v ? '✗ ' : '✓ ');
    text(ctx, ok(T.r) + 'Reflexive' + (T.r ? ': ' + T.r : ''), 10, by, { color: T.r ? col.bad : col.good, size: 11.5, weight: 600 });
    text(ctx, ok(T.s) + 'Symmetric' + (T.s ? ': ' + T.s : ''), 10, by + 20, { color: T.s ? col.bad : col.good, size: 11.5, weight: 600 });
    text(ctx, ok(T.t) + 'Transitive' + (T.t ? ': ' + T.t : ''), 10, by + 40, { color: T.t ? col.bad : col.good, size: 11.5, weight: 600 });
    const eq = !T.r && !T.s && !T.t;
    text(ctx, eq ? 'Equivalence relation (all three hold)' : 'Not an equivalence relation', 10, by + 66, { color: eq ? col.good : col.ink, size: 12.5, weight: 700 });
  };
  cv.c.addEventListener('pointerdown', (e) => {
    const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left - geo.gx, y = e.clientY - b.top - geo.gy, j = Math.floor(x / geo.cs), i = Math.floor(y / geo.cs);
    if (i >= 0 && j >= 0 && i < N && j < N) { R[i][j] = !R[i][j]; cv.redraw(); }
  });
  const r = row(host);
  choice(r, 'Start from', Object.entries(PRE).map(([k, v]) => [k, v[0]]), 'par', (k) => { load(k); cv.redraw(); });
  button(r, 'Clear', () => { R.forEach((l) => l.fill(false)); cv.redraw(); });
  cv.redraw();
}
