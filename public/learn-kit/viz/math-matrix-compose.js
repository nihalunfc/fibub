// Matrices as moves of the whole plane. Choose two transformations and press Apply: the unit square (and the letter F,
// so you can see turns and flips) is moved by the first, then by the second. Swap the order and the picture is different:
// matrix multiplication is not commutative. The area of the square is multiplied by det at each stage.
import { canvas, axes, row, choice, button, readout, loop, line, text, ease } from '../kit.js';
import { f2 } from './_math.js';

const M = {
  rot: ['Rotate 60°', [[0.5, -0.866], [0.866, 0.5]]], shear: ['Shear (x + 1y)', [[1, 1], [0, 1]]], scale: ['Stretch x by 2', [[2, 0], [0, 1]]],
  flip: ['Reflect in x-axis', [[1, 0], [0, -1]]], proj: ['Squash onto y = x', [[0.5, 0.5], [0.5, 0.5]]], id: ['Do nothing', [[1, 0], [0, 1]]],
};
const mul = (A, B) => [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]], [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]];
const lerpM = (A, t) => [[1 + (A[0][0] - 1) * t, A[0][1] * t], [A[1][0] * t, 1 + (A[1][1] - 1) * t]];
export default function (host) {
  let f = 'rot', g = 'shear', order = 'fg', t = 1, stage = 0, run = false, t0 = 0;
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 260, label: 'The unit square and letter F moved by two matrices in turn' });
  const c = row(host), c2 = row(host), c3 = row(host);
  const opts = Object.entries(M).map(([id, v]) => [id, v[0]]);
  choice(c, 'First', opts, f, (v) => { f = v; reset(); }); choice(c2, 'Second', opts, g, (v) => { g = v; reset(); });
  choice(c3, 'Order', [['fg', 'First then Second'], ['gf', 'Swap the order']], order, (v) => { order = v; reset(); });
  button(c3, 'Apply ▶', () => { stage = 0; t0 = 0; run = true; });
  loop(host, (dt) => { if (!run) return; t0 += dt / 1.4; if (t0 >= 1) { t0 = 0; stage++; if (stage >= 2) { run = false; stage = 2; t = 1; } } cv.redraw(); }, { autoplay: true });
  const out = readout(host);
  const seq = () => (order === 'fg' ? [M[f][1], M[g][1]] : [M[g][1], M[f][1]]);
  function reset() { run = false; stage = 2; t0 = 0; cv.redraw(); }
  const cur = () => { const [A, B] = seq(); if (!run && stage === 2) return mul(B, A); if (stage === 0) return lerpM(A, ease(t0)); return mul(lerpM(B, ease(t0)), A); };
  const det = (m) => m[0][0] * m[1][1] - m[0][1] * m[1][0];
  const fmtM = (m) => `[${f2(m[0][0])} ${f2(m[0][1])}; ${f2(m[1][0])} ${f2(m[1][1])}]`;
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-3, 3], y: [-2.4, 2.4], l: 8, b: 8, t: 22, r: 8, xt: [], yt: [], grid: true });
    const m = cur(), T = ([x, y]) => [A.X(m[0][0] * x + m[0][1] * y), A.Y(m[1][0] * x + m[1][1] * y)];
    line(ctx, [[A.L, A.Y(0)], [A.R, A.Y(0)]], col.muted, 1); line(ctx, [[A.X(0), A.T], [A.X(0), A.B]], col.muted, 1);
    const sq = [[0, 0], [1, 0], [1, 1], [0, 1]], P = sq.map(T);
    ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.stroke();
    // the letter F inside the unit square
    line(ctx, [[0.25, 0.15], [0.25, 0.85], [0.7, 0.85]].map(T), col.s[1], 3); line(ctx, [[0.25, 0.5], [0.55, 0.5]].map(T), col.s[1], 3);
    line(ctx, [T([0, 0]), T([1, 0])], col.s[3], 3); line(ctx, [T([0, 0]), T([0, 1])], col.s[2], 3);
    text(ctx, 'pink edge: where î goes (column 1) · green edge: where ĵ goes (column 2)', A.L + 6, A.T + 8, { color: col.muted, size: 9.5 });
    const st = !run ? 'Done' : stage === 0 ? `Applying ${order === 'fg' ? M[f][0] : M[g][0]}` : `Applying ${order === 'fg' ? M[g][0] : M[f][0]}`;
    text(ctx, st, A.R - 6, A.B - 10, { color: col.ink, size: 12, weight: 700, align: 'right' });
    const [a1, b1] = seq(), tot = mul(b1, a1);
    out.innerHTML = `First ${fmtM(a1)} (det ${f2(det(a1))}), then ${fmtM(b1)} (det ${f2(det(b1))}). Combined matrix = (second)(first) = <b>${fmtM(tot)}</b>, det = <b>${f2(det(tot))}</b> = ${f2(det(a1))} × ${f2(det(b1))}. The square's area is now ${f2(Math.abs(det(m)))}. ${det(tot) === 0 ? 'det = 0: the plane is squashed onto a line and cannot be undone (no inverse).' : det(tot) < 0 ? 'det < 0: the picture is flipped (mirror image).' : ''}`;
  };
  stage = 2; cv.redraw();
}
