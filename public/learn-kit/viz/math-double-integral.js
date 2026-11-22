// A double integral as a volume. The solid under z = f(x, y) over a region is built from thin columns, each of
// height f and base area Δx Δy. Slide the number of columns per side: the column total approaches the exact integral.
// Pick the region (square, triangle, quarter disc) and drag the picture to turn it. A slab at a chosen x shows the other
// way to do the sum: first add up along y for each x (area of the slab), then add the slabs.
import { canvas, row, slider, choice, readout, text, line } from '../kit.js';
import { orbit } from './_3d.js';
import { f2 } from './_math.js';

const FN = { quad: ['x² + y²', (x, y) => x * x + y * y], lin: ['x + y + 1', (x, y) => x + y + 1], bump: ['4 − x² − y²', (x, y) => 4 - x * x - y * y], sinx: ['2 sin(xπ/2)·y', (x, y) => 2 * Math.sin((x * Math.PI) / 2) * y] };
const REG = { sq: ['Square 0..2', (x, y) => true], tri: ['Triangle y ≤ x', (x, y) => y <= x], disc: ['Quarter disc', (x, y) => x * x + y * y <= 4] };
export default function (host) {
  let f = 'quad', rg = 'sq', n = 6, sl = 0.5;
  const cv = canvas(host, { aspect: 0.85, max: 400, min: 280, label: 'Columns under a surface over a region' });
  const cam = orbit(cv, { yaw: 0.8, pitch: 0.5 });
  const c = row(host), c2 = row(host);
  choice(c, 'Surface', Object.entries(FN).map(([id, v]) => [id, v[0]]), f, (v) => { f = v; re(); }); choice(c, 'Region', Object.entries(REG).map(([id, v]) => [id, v[0]]), rg, (v) => { rg = v; re(); });
  slider(c2, { label: 'columns per side', min: 1, max: 16, step: 1, value: n, fmt: (v) => v, oninput: (v) => { n = v; re(); } });
  slider(c2, { label: 'slab at x', min: 0.05, max: 1.95, step: 0.05, value: sl, fmt: (v) => f2(v), oninput: (v) => { sl = v; re(); } });
  const out = readout(host);
  const inside = REG[rg][1];
  const colSum = () => { const F = FN[f][1], h = 2 / n; let s = 0; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const x = (i + 0.5) * h, y = (j + 0.5) * h; if (REG[rg][1](x, y)) s += F(x, y) * h * h; } return s; };
  const exact = () => { const F = FN[f][1], M = 400, h = 2 / M; let s = 0; for (let i = 0; i < M; i++) for (let j = 0; j < M; j++) { const x = (i + 0.5) * h, y = (j + 0.5) * h; if (REG[rg][1](x, y)) s += F(x, y) * h * h; } return s; };
  const slab = (x) => { const F = FN[f][1], M = 400, h = 2 / M; let s = 0; for (let j = 0; j < M; j++) { const y = (j + 0.5) * h; if (REG[rg][1](x, y)) s += F(x, y) * h; } return s; };
  function re() { cv.redraw(); const s = colSum(), e = exact(); out.innerHTML = `${n}×${n} columns: V ≈ <b>${f2(s, 4)}</b>. Exact ∬ f dA ≈ <b>${f2(e, 4)}</b> (error ${f2(Math.abs(s - e) / e * 100, 1)}%). Slab at x = ${f2(sl)}: its cross-section area (∫ f dy over the allowed y) = ${f2(slab(sl), 3)}. Adding all such slabs over x gives the same volume (Fubini); for the triangle the y limits are 0 to x.`; }
  cv.draw = (ctx, w, h, col) => {
    const F = FN[f][1], sc = Math.min(w, h) * 0.3, P = cam.proj(w, h, sc, w / 2, h / 2 + 30), hh = 2 / n, zmax = Math.max(1, ...[0, 1, 2].flatMap((a) => [0, 1, 2].map((b) => F(a, b)))), zs = 2 / zmax;
    const M = (x, y, z) => P([x - 1, z * zs * 0.9, y - 1]);
    const base = [[0, 0], [2, 0], [2, 2], [0, 2]].map(([x, y]) => M(x, y, 0)); ctx.beginPath(); base.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.stroke();
    const cells = []; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const xc = (i + 0.5) * hh, yc = (j + 0.5) * hh; if (inside(xc, yc)) cells.push([i, j, xc, yc]); }
    cells.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1])).sort((a, b) => P([a[2] - 1, 0, a[3] - 1])[2] - P([b[2] - 1, 0, b[3] - 1])[2]).forEach(([i, j, xc, yc]) => {
      const z = F(xc, yc), x0 = i * hh, x1 = x0 + hh, y0 = j * hh, y1 = y0 + hh, sl_ = Math.abs(xc - sl) < hh / 2 + 1e-9;
      const top = [M(x0, y0, z), M(x1, y0, z), M(x1, y1, z), M(x0, y1, z)], sx = [M(x1, y0, 0), M(x1, y1, 0), M(x1, y1, z), M(x1, y0, z)], sy = [M(x0, y1, 0), M(x1, y1, 0), M(x1, y1, z), M(x0, y1, z)];
      const poly = (pts, a2) => { ctx.beginPath(); pts.forEach((p, q) => (q ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.globalAlpha = a2; ctx.fillStyle = sl_ ? col.s[1] : col.s[0]; ctx.fill(); ctx.globalAlpha = 0.9; ctx.strokeStyle = col.bg; ctx.lineWidth = 0.7; ctx.stroke(); ctx.globalAlpha = 1; };
      poly(sx, 0.45); poly(sy, 0.6); poly(top, 0.85);
    });
    text(ctx, 'orange columns = the slab at x', 10, h - 12, { color: col.s[1], size: 10.5, weight: 600 }); text(ctx, 'Drag to turn', w - 8, h - 12, { color: col.muted, size: 10, align: 'right' });
  };
  re();
}
