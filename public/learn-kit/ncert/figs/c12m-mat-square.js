// Class 12 Maths, Matrices: a 2 x 2 matrix [[a, b], [c, d]] moves every point of the plane. Its columns are where the points (1, 0) and (0, 1)
// land, so dragging those two dots reshapes the unit square into a parallelogram. The determinant ad - bc is the area scale factor (negative = flipped).
import { canvas, text, title, row, choice, axes, dot, arrow, touchGuard, readout } from '../../kit.js';

const PRE = { id: ['Identity', [1, 0, 0, 1]], rot: ['Turn 90°', [0, -1, 1, 0]], sc: ['Double', [2, 0, 0, 2]], sh: ['Shear', [1, 1, 0, 1]], rf: ['Swap x,y', [0, 1, 1, 0]], sq: ['Squash', [1, 1, 1, 1]] };
export default function (host) {
  let M = [1, 0, 0, 1]; // a b c d: image of (1,0) is (a,c); of (0,1) is (b,d)
  let drag = -1, A = null;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 310, label: 'The unit square and its image under a two by two matrix, with draggable corner points' });
  const out = readout(host);
  const F = [[0.25, 0.1], [0.25, 0.9], [0.8, 0.9], [0.25, 0.55], [0.6, 0.55]];
  const tf = ([x, y]) => [M[0] * x + M[1] * y, M[2] * x + M[3] * y];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Drag the two dots: they are the columns of the matrix', col);
    const yr = (3 * (h - 54)) / (w - 40);
    A = axes(ctx, w, h, col, { x: [-3, 3], y: [-yr, yr], l: 28, b: 24, t: 30, r: 12, xt: [-2, -1, 0, 1, 2], yt: [-2, -1, 0, 1, 2] });
    const { X, Y } = A, P = (p) => [X(p[0]), Y(p[1])];
    ctx.save(); A.clip();
    ctx.fillStyle = col.muted; ctx.globalAlpha = 0.1; ctx.fillRect(X(0), Y(1), X(1) - X(0), Y(0) - Y(1)); ctx.globalAlpha = 1; ctx.strokeStyle = col.muted; ctx.setLineDash([4, 3]); ctx.lineWidth = 1.2; ctx.strokeRect(X(0), Y(1), X(1) - X(0), Y(0) - Y(1)); ctx.setLineDash([]);
    const q = [[0, 0], [1, 0], [1, 1], [0, 1]].map(tf).map(P); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.22; ctx.beginPath(); q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.stroke();
    const f = F.map(tf).map(P); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.5; ctx.beginPath(); [0, 1, 2].forEach((i) => (i ? ctx.lineTo(...f[i]) : ctx.moveTo(...f[i]))); ctx.moveTo(...f[3]); ctx.lineTo(...f[4]); ctx.stroke();
    ctx.restore();
    const o = P([0, 0]); arrow(ctx, ...o, ...P([M[0], M[2]]), col.s[1], 2.5, 9); arrow(ctx, ...o, ...P([M[1], M[3]]), col.s[3], 2.5, 9);
    const h1 = P([M[0], M[2]]), h2 = P([M[1], M[3]]); dot(ctx, ...h1, 8, col.s[1], col.panel); dot(ctx, ...h2, 8, col.s[3], col.panel);
    text(ctx, '(1,0)→', h1[0] + 10, h1[1] - 10, { color: col.s[1], size: 11, weight: 700 }); text(ctx, '(0,1)→', h2[0] + 10, h2[1] - 10, { color: col.s[3], size: 11, weight: 700 });
    const d = M[0] * M[3] - M[1] * M[2], r = (v) => (+v.toFixed(1)).toString().replace('-', '−');
    out.innerHTML = `Matrix [[${r(M[0])}, ${r(M[1])}], [${r(M[2])}, ${r(M[3])}]] · determinant ad − bc = <b>${r(d)}</b>. The unit square (area 1) becomes a parallelogram of area <b>${r(Math.abs(d))}</b>${d < 0 ? ', turned over (mirror image)' : ''}${Math.abs(d) < 0.05 ? ' squashed flat: this matrix cannot be undone' : ''}.`;
  };
  const hit = (x, y) => { if (!A) return -1; const p = [[M[0], M[2]], [M[1], M[3]]].map(([u, v]) => [A.X(u), A.Y(v)]); return p.findIndex(([px, py]) => Math.hypot(px - x, py - y) < 18); };
  const set = (e) => { const b = cv.c.getBoundingClientRect(), u = Math.round(((e.clientX - b.left - A.X(0)) / (A.X(1) - A.X(0))) * 10) / 10, v = Math.round(((A.Y(0) - (e.clientY - b.top)) / (A.X(1) - A.X(0))) * 10) / 10, cl = (z) => Math.max(-2.8, Math.min(2.8, z)); if (drag === 0) { M[0] = cl(u); M[2] = cl(v); } else { M[1] = cl(u); M[3] = cl(v); } cv.redraw(); };
  cv.c.addEventListener('pointerdown', (e) => { const b = cv.c.getBoundingClientRect(); drag = hit(e.clientX - b.left, e.clientY - b.top); if (drag >= 0) { cv.c.setPointerCapture(e.pointerId); set(e); } });
  cv.c.addEventListener('pointermove', (e) => { if (drag >= 0) set(e); }); cv.c.addEventListener('pointerup', () => { drag = -1; });
  touchGuard(cv.c, (x, y) => hit(x, y) >= 0);
  choice(row(host), 'Try', Object.entries(PRE).map(([k, v]) => [k, v[0]]), 'id', (k) => { M = PRE[k][1].slice(); cv.redraw(); });
  cv.redraw();
}
