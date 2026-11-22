// Class 12 Human Health and Disease: cancer as growth without control. Normal cells in a dish divide only while they have a free space beside them and stop when they touch (contact inhibition), forming a single layer.
// Cancer cells have lost this brake: they keep dividing and pile up in lumps (a tumour). Choose the cell type and run it. A benign tumour stays in one place; a malignant one can spread (metastasis).
import { canvas, text, title, dot, row, button, choice, readout, loop, rng } from '../../kit.js';

export default function (host) {
  const N = 12;
  let kind = 'normal', grid, tick = 0, acc = 0, rnd;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A dish of cells dividing: normal cells stop when they touch, cancer cells pile up' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Cells', [['normal', 'Normal cells'], ['cancer', 'Cancer cells']], kind, (v) => { kind = v; reset(); });
  const anim = loop(host, (dt) => { acc += dt; if (acc > 0.45 && tick < 60) { acc = 0; step(); } });
  anim.button(ctl); button(ctl, 'Restart', () => reset());
  const reset = () => { rnd = rng(9); grid = Array.from({ length: N * N }, () => 0); grid[5 * N + 6] = 1; tick = 0; acc = 0; go(); };
  const nb = (i) => { const x = i % N, y = Math.floor(i / N), o = []; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = x + dx, b = y + dy; if (a >= 0 && a < N && b >= 0 && b < N) o.push(b * N + a); } return o; };
  const step = () => {
    const g = grid.slice();
    grid.forEach((v, i) => { if (!v) return; const free = nb(i).filter((j) => grid[j] === 0 && g[j] === 0); if (kind === 'normal') { if (free.length) { const j = free[Math.floor(rnd() * free.length)]; g[j] = 1; } } else { if (free.length && rnd() < 0.7) { const j = free[Math.floor(rnd() * free.length)]; g[j] = 1; } else if (rnd() < 0.6) g[i] = Math.min(4, g[i] + 1); } });
    grid = g; tick++; go();
  };
  const go = () => { const total = grid.reduce((a, v) => a + v, 0), covered = grid.filter(Boolean).length; ro.textContent = `Round ${tick}: ${total} cells on ${covered} of ${N * N} spots. ` + (kind === 'normal' ? (covered === N * N ? 'The dish is one full layer and division has stopped: contact inhibition.' : 'Normal cells divide only while there is free space next to them.') : 'Cancer cells ignore contact inhibition and keep dividing; darker spots are cells piled up in several layers (a tumour). Normal cells stop; cancer cells do not.'); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, kind === 'normal' ? 'Normal cells: a single layer' : 'Cancer cells: a growing lump', col), s = Math.min(w - 40, h - t0 - 20) / N, x0 = (w - s * N) / 2, y0 = t0 + 10;
    ctx.fillStyle = col.soft; ctx.fillRect(x0 - 4, y0 - 4, s * N + 8, s * N + 8);
    grid.forEach((v, i) => { if (!v) return; const x = x0 + (i % N + 0.5) * s, y = y0 + (Math.floor(i / N) + 0.5) * s; for (let k = 0; k < v; k++) dot(ctx, x + k * 1.5, y - k * 1.5, s * 0.42, kind === 'normal' ? col.s[0] : col.s[3], col.bg); });
  };
  reset();
}
