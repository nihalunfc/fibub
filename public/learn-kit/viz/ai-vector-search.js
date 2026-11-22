// Searching a vector database. 70 made-up chunks sit on a 2D map of meaning. Drag the question (star) and the k nearest
// chunks light up. Switch to "Approximate": the map is cut into 6 cells by k-means and only the nearest cells are
// searched, which compares far fewer points but can miss a true neighbour near a cell edge. Raise "cells searched" to fix it.
import { canvas, text, row, slider, choice, readout, title, dot, line } from '../kit.js';
import { rng } from '../kit.js';
import { pointer, gauss } from './_ai.js';

const R = rng(8), CEN = [[0.2, 0.25], [0.5, 0.2], [0.8, 0.3], [0.25, 0.75], [0.55, 0.7], [0.85, 0.8]];
const PTS = CEN.flatMap(([cx, cy]) => Array.from({ length: 12 }, () => [Math.max(0.02, Math.min(0.98, cx + 0.07 * gauss(R))), Math.max(0.02, Math.min(0.98, cy + 0.07 * gauss(R)))]));
let cents = CEN.map((c) => [...c]);
for (let it = 0; it < 8; it++) { const sum = cents.map(() => [0, 0, 0]); PTS.forEach((p) => { const c = near(p); sum[c][0] += p[0]; sum[c][1] += p[1]; sum[c][2]++; }); cents = sum.map((s, i) => (s[2] ? [s[0] / s[2], s[1] / s[2]] : cents[i])); }
function near(p) { let b = 0, bd = 9; cents.forEach((c, i) => { const d = Math.hypot(c[0] - p[0], c[1] - p[1]); if (d < bd) { bd = d; b = i; } }); return b; }
const CELL = PTS.map(near);
export default function (host) {
  let q = [0.62, 0.45], k = 5, mode = 'exact', np = 1;
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 270, label: 'Points on a map with the nearest ones to a question highlighted' });
  const ctl = row(host);
  choice(ctl, 'Search', [['exact', 'Exact (all points)'], ['ann', 'Approximate (cells)']], mode, (v) => { mode = v; show(); });
  slider(ctl, { label: 'Neighbours k', min: 1, max: 10, step: 1, value: 5, fmt: (v) => Math.round(v), oninput: (v) => { k = Math.round(v); show(); } });
  slider(ctl, { label: 'Cells searched', min: 1, max: 6, step: 1, value: 1, fmt: (v) => Math.round(v), oninput: (v) => { np = Math.round(v); show(); } });
  const out = readout(host), g = { W: 0, H: 0, T: 30 };
  const px = (p) => [8 + p[0] * g.W, g.T + (1 - p[1]) * g.H];
  pointer(cv, (x, y) => { q = [Math.max(0, Math.min(1, (x - 8) / g.W)), Math.max(0, Math.min(1, 1 - (y - g.T) / g.H))]; show(); }, (x, y) => y > g.T);
  function calc() {
    const d = PTS.map((p, i) => [i, Math.hypot(p[0] - q[0], p[1] - q[1])]), exact = d.slice().sort((a, b) => a[1] - b[1]).slice(0, k).map((a) => a[0]);
    const cellOrder = cents.map((c, i) => [i, Math.hypot(c[0] - q[0], c[1] - q[1])]).sort((a, b) => a[1] - b[1]).slice(0, np).map((a) => a[0]);
    const scanned = mode === 'exact' ? PTS.map((_, i) => i) : PTS.map((_, i) => i).filter((i) => cellOrder.includes(CELL[i]));
    const found = d.filter((a) => scanned.includes(a[0])).sort((a, b) => a[1] - b[1]).slice(0, k).map((a) => a[0]);
    return { exact, found, scanned, cellOrder };
  }
  function show() {
    const c = calc(), hit = c.found.filter((i) => c.exact.includes(i)).length;
    out.innerHTML = `Compared <b>${c.scanned.length}</b> of ${PTS.length} points. ${mode === 'exact' ? 'Exact search checks everything: always right, but slow when there are millions of chunks.' : `Found <b>${hit} of ${c.exact.length}</b> true nearest neighbours (recall ${(100 * hit / c.exact.length).toFixed(0)}%). ${hit < c.exact.length ? 'A true neighbour sits in a cell that was not searched.' : ''}`}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    g.W = w - 16; g.H = h - 40; title(ctx, 'Drag the question', col); const c = calc();
    ctx.strokeStyle = col.line; ctx.strokeRect(8, g.T, g.W, g.H);
    if (mode === 'ann') cents.forEach((ce, i) => { const p = px(ce), on = c.cellOrder.includes(i); ctx.save(); ctx.globalAlpha = on ? 0.12 : 0.04; ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.arc(p[0], p[1], g.W * 0.16, 0, 7); ctx.fill(); ctx.restore(); text(ctx, '+', p[0], p[1], { color: col.s[1], size: 14, align: 'center', weight: 700, fit: false }); });
    PTS.forEach((p, i) => { const a = px(p), f = c.found.includes(i), ex = c.exact.includes(i); if (f) line(ctx, [px(q), a], col.s[0], 1.2); dot(ctx, a[0], a[1], f ? 5 : 3, f ? col.s[0] : c.scanned.includes(i) ? col.muted : col.line, ex && !f ? col.bad : null); });
    const s = px(q); ctx.fillStyle = col.s[1]; ctx.beginPath(); for (let a = 0; a < 10; a++) { const r = a % 2 ? 4 : 9, an = (a * Math.PI) / 5 - Math.PI / 2; ctx.lineTo(s[0] + r * Math.cos(an), s[1] + r * Math.sin(an)); } ctx.fill();
    text(ctx, 'blue = found · red ring = true neighbour missed', 12, h - 8, { color: col.muted, size: 10 });
  };
  show();
}
