// Linear programming by sliding a line. The shaded polygon is the feasible region (all the constraints at once).
// The dashed line Z = ax + by is a line of equal profit; slide it with the Z slider, or press Play to push it as far
// as it will go. The last feasible point it touches is the best corner. Change the profit weights a and b and the
// best corner changes.
import { canvas, axes, row, slider, choice, button, readout, loop, dot, line, text } from '../kit.js';
import { f2 } from './_math.js';

// constraints (p·x + q·y <= r) plus x, y >= 0: clip the box [0,7]x[0,6] by each half-plane to get the corners
const CON = [[2, 1, 10], [1, 2, 8], [1, -1, 3]];
const clip = (poly, [p, q, r]) => { const out = []; poly.forEach((P, i) => { const Q = poly[(i + 1) % poly.length], fp = p * P[0] + q * P[1] - r, fq = p * Q[0] + q * Q[1] - r; if (fp <= 1e-9) out.push(P); if ((fp < -1e-9 && fq > 1e-9) || (fp > 1e-9 && fq < -1e-9)) { const t = fp / (fp - fq); out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); } }); return out; };
const CORNERS = CON.reduce(clip, [[0, 0], [7, 0], [7, 6], [0, 6]]).map(([x, y]) => [+x.toFixed(6), +y.toFixed(6)]);
export default function (host) {
  let a = 3, b = 2, z = 0, tm = 0;
  const cv = canvas(host, { aspect: 0.82, max: 380, min: 260, label: 'A feasible region with a profit line sliding to the best corner' });
  const c = row(host), c2 = row(host);
  slider(c, { label: 'profit a (per x)', min: 0, max: 5, step: 0.5, value: a, fmt: (v) => f2(v, 1), oninput: (v) => { a = v; zs.set(Math.min(z, zmax())); re(); } });
  slider(c, { label: 'profit b (per y)', min: 0, max: 5, step: 0.5, value: b, fmt: (v) => f2(v, 1), oninput: (v) => { b = v; re(); } });
  const zmax = () => Math.max(...CORNERS.map(([x, y]) => a * x + b * y));
  const anim = loop(host, (dt) => { tm += dt; z = Math.min(zmax(), z + dt * 6); zs.set(z); if (z >= zmax()) anim.pause(); re(); }, { autoplay: false });
  anim.button(c2);
  const zs = slider(c2, { label: 'Z = ax + by', min: 0, max: 30, step: 0.1, value: z, fmt: (v) => f2(v, 1), oninput: (v) => { z = v; re(); } });
  const out = readout(host);
  function re() { cv.redraw(); const best = CORNERS.reduce((p, q) => (a * q[0] + b * q[1] > a * p[0] + b * p[1] + 1e-9 ? q : p)), zm = zmax();
    const tied = CORNERS.filter((q) => Math.abs(a * q[0] + b * q[1] - zm) < 1e-9);
    out.innerHTML = `Feasible corners: ${CORNERS.map(([x, y]) => `(${+x.toFixed(1)}, ${+y.toFixed(1)}) → Z = ${f2(a * x + b * y, 1)}`).join('; ')}. Best: <b>${tied.length > 1 ? `every point between two corners — the line lies along an edge` : `(${+best[0].toFixed(1)}, ${+best[1].toFixed(1)})`}</b> with Z = <b>${f2(zm, 1)}</b>. Now sliding at Z = ${f2(z, 1)} ${z > zm + 1e-6 ? '(past the region: not feasible)' : ''}.`; }
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0, 7], y: [0, 6], l: 28, b: 24, t: 22, r: 10, xlabel: 'x', ylabel: 'y' });
    ctx.save(); ctx.setLineDash([2, 3]); CON.forEach(([p, q, r], i) => { const pts = q ? [[0, r / q], [7, (r - 7 * p) / q]] : [[r / p, 0], [r / p, 6]]; ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.save(); ctx.clip(); line(ctx, pts.map(([x, y]) => [A.X(x), A.Y(y)]), col.muted, 1); ctx.restore(); }); ctx.restore();
    ctx.beginPath(); CORNERS.forEach(([x, y], i) => (i ? ctx.lineTo(A.X(x), A.Y(y)) : ctx.moveTo(A.X(x), A.Y(y)))); ctx.closePath(); ctx.globalAlpha = 0.25; ctx.fillStyle = col.s[0]; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.stroke();
    const zm = zmax(); ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.clip();
    if (a > 0 || b > 0) { const pts = []; if (b > 0) pts.push([0, z / b], [7, (z - 7 * a) / b]); else pts.push([z / a, 0], [z / a, 6]); line(ctx, pts.map(([x, y]) => [A.X(x), A.Y(y)]), z > zm + 1e-6 ? col.bad : col.s[1], 2.5, [7, 4]); }
    ctx.restore();
    CORNERS.forEach(([x, y]) => { const best = Math.abs(a * x + b * y - zm) < 1e-9; dot(ctx, A.X(x), A.Y(y), best ? 7 : 4.5, best ? col.s[2] : col.ink, best ? col.ink : undefined); text(ctx, `(${+x.toFixed(1)}, ${+y.toFixed(1)})`, A.X(x) + 8, A.Y(y) - 9, { color: col.muted, size: 10 }); });
    text(ctx, 'dashed: line of equal profit', A.L + 6, A.T + 10, { color: col.muted, size: 10 });
  };
  re();
}
