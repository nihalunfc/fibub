// Class 12 Maths, Matrices: add matrices entry by entry (same order only) and multiply by a scalar entry by entry. Tap an entry of the
// answer to see the two entries it came from. Switch B to a different order and the sum is not defined.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const A = [[2, 5, 1], [0, 3, 4]], B1 = [[1, 0, 2], [3, 1, 1]], B2 = [[1, 3], [0, 1], [2, 1]];
export default function (host) {
  let k = 2, m = 1, shape = 'same', sel = [0, 0], geo = [];
  const cv = canvas(host, { aspect: 0.5, max: 440, min: 200, label: 'Matrix A and B and the result of kA plus mB entry by entry' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'C = kA + mB: add and scale entry by entry', col), B = shape === 'same' ? B1 : B2, cs = Math.min(30, (w - 70) / 9.5), W = (M) => M[0].length * cs;
    const draw = (M, x, y, c, hi, name) => {
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 5, y - 3); ctx.lineTo(x, y - 3); ctx.lineTo(x, y + M.length * cs + 3); ctx.lineTo(x + 5, y + M.length * cs + 3); ctx.moveTo(x + W(M) - 5, y - 3); ctx.lineTo(x + W(M), y - 3); ctx.lineTo(x + W(M), y + M.length * cs + 3); ctx.lineTo(x + W(M) - 5, y + M.length * cs + 3); ctx.stroke();
      M.forEach((r, i) => r.forEach((v, j) => { if (hi && hi[0] === i && hi[1] === j) { ctx.fillStyle = c; ctx.globalAlpha = 0.3; ctx.fillRect(x + j * cs, y + i * cs, cs, cs); ctx.globalAlpha = 1; } text(ctx, String(v).replace('-', '−'), x + j * cs + cs / 2, y + i * cs + cs / 2, { color: col.ink, size: 13, weight: 600, align: 'center' }); }));
      text(ctx, name, x + W(M) / 2, y - 14, { color: c, size: 12, weight: 700, align: 'center' });
    };
    const y = top + 38, sA = `${k}·`, xs = (w - (W(A) + W(B) + W(A) + 2 * 26 + 12)) / 2;
    const ok = shape === 'same', hi = ok ? sel : null;
    draw(A, xs, y, col.s[0], hi, `A (2×3) × ${k}`); text(ctx, '+', xs + W(A) + 13, y + cs, { color: col.ink, size: 16, weight: 700, align: 'center' });
    draw(B, xs + W(A) + 26, y, col.s[2], ok ? hi : null, `B (${B.length}×${B[0].length}) × ${m}`); text(ctx, '=', xs + W(A) + W(B) + 39, y + cs, { color: col.ink, size: 16, weight: 700, align: 'center' });
    geo = [xs + W(A) + W(B) + 52, y, cs];
    if (ok) { const C = A.map((r, i) => r.map((v, j) => k * v + m * B[i][j])); draw(C, geo[0], y, col.s[3], hi, 'C = kA + mB'); const [i, j] = sel; out.innerHTML = `c<sub>${i + 1}${j + 1}</sub> = ${k}·${A[i][j]} + ${m}·${B[i][j]} = <b>${C[i][j]}</b>. Each entry of C uses only the entries in the same place of A and B.`; }
    else { text(ctx, 'not defined', geo[0] + 6, y + cs, { color: col.bad, size: 13, weight: 800 }); out.innerHTML = 'A is 2×3 and B is 3×2. Matrices can be added only when they have the <b>same order</b> (same number of rows and columns), because every entry needs a partner in the same place.'; }
  };
  cv.c.addEventListener('pointerdown', (e) => { const b = cv.c.getBoundingClientRect(), j = Math.floor((e.clientX - b.left - geo[0]) / geo[2]), i = Math.floor((e.clientY - b.top - geo[1]) / geo[2]); if (shape === 'same' && i >= 0 && i < 2 && j >= 0 && j < 3) { sel = [i, j]; cv.redraw(); } });
  const r = row(host);
  slider(r, { label: 'k (times A)', min: -2, max: 4, step: 1, value: 2, fmt: String, oninput: (v) => { k = v; cv.redraw(); } });
  slider(r, { label: 'm (times B)', min: -2, max: 4, step: 1, value: 1, fmt: String, oninput: (v) => { m = v; cv.redraw(); } });
  choice(r, 'B is', [['same', '2×3 (same order)'], ['diff', '3×2 (different order)']], shape, (v) => { shape = v; cv.redraw(); });
  cv.redraw();
}
