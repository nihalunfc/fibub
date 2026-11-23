// Class 11 Biology, Biological Classification: how a bacteriophage multiplies. Lytic cycle: attach, inject DNA, take over the cell, make parts, assemble, burst the cell (lysis).
// Lysogenic alternative: the phage DNA joins the bacterial chromosome as a prophage and is copied with it at every cell division until something switches it on. Step player (6 steps).
import { canvas, text, title } from '../../kit.js';
import { rr, ell, note } from '../c11b-lib.js';

const T = ['1. Attachment', '2. Injection', '3. Takeover and copying', '4. Assembly of new phages', '5. Lysis: the cell bursts', '6. Alternative: lysogeny'];
const N = ['The tail fibres of the phage stick to special sites on a bacterium.', 'Only the phage DNA enters through the tail; the empty protein coat stays outside.', 'The phage DNA makes the host machinery copy it and build phage proteins. The bacterium stops its own work.', 'New heads, tails and DNA copies come together as complete new phages inside the cell.', 'The cell wall breaks (lysis). Dozens of new phages are set free to infect other bacteria.', 'In the lysogenic cycle the phage DNA joins the bacterial chromosome as a prophage and is passed on at every division, until a trigger starts the lytic cycle.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Steps of the bacteriophage life cycle in a bacterium' });
  const phage = (ctx, x, y, sc, col, dna = true) => { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.fillStyle = col.s[0]; ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-8, -10); ctx.lineTo(8, -10); ctx.lineTo(10, 0); ctx.lineTo(0, 10); ctx.lineTo(-10, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = col.s[1]; ctx.fillRect(-2, 10, 4, 14); ctx.strokeStyle = col.ink; for (const d of [-8, 8]) { ctx.beginPath(); ctx.moveTo(0, 24); ctx.lineTo(d, 32); ctx.stroke(); } if (dna) { ell(ctx, 0, -2, 3.5, 3.5, col.s[3], null, 0); } ctx.restore(); };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, T[s], col), bx = w * 0.14, by = y0 + 70, bw = w * 0.72, bh = 120;
    const burst = s === 4;
    if (!burst) { rr(ctx, bx, by, bw, bh, 40, col.soft, col.ink, 2); text(ctx, 'bacterium', bx + bw / 2, by + bh + 12, { color: col.muted, size: 10.5, align: 'center' }); }
    else { for (let k = 0; k < 9; k++) { const a = k * 0.7; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(bx + bw / 2, by + bh / 2, 62 + (k % 2) * 8, a, a + 0.5); ctx.stroke(); } }
    const cx = bx + bw / 2, cy = by + bh / 2;
    if (s === 0) { phage(ctx, cx - 30, by - 36, 1.1, col); phage(ctx, cx + 40, by - 30, 1.1, col); ell(ctx, cx, cy, 30, 20, col.s[4], col.ink, 1.2, 0.5); text(ctx, 'host DNA', cx, cy, { color: col.ink, size: 10, align: 'center' }); }
    if (s === 1) { phage(ctx, cx - 30, by - 14, 1.1, col, false); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx - 30, by + 18); ctx.lineTo(cx - 26, by + 40); ctx.stroke(); ell(ctx, cx, cy + 10, 30, 20, col.s[4], col.ink, 1.2, 0.5); text(ctx, 'phage DNA enters', cx + 30, by + 44, { color: col.s[3], size: 10.5, weight: 700 }); }
    if (s === 2) { ell(ctx, cx, cy, 8, 8, col.s[4], null, 0, 0.3); [[-50, -20], [-20, 20], [20, -25], [50, 12], [0, 0]].forEach(([dx, dy]) => ell(ctx, cx + dx, cy + dy, 7, 7, col.s[3], col.ink, 1)); [[-35, 30], [38, -35], [-60, 10]].forEach(([dx, dy]) => { ctx.fillStyle = col.s[0]; ctx.fillRect(cx + dx - 5, cy + dy - 4, 10, 8); }); text(ctx, 'DNA copies', cx, by + bh - 16, { color: col.s[3], size: 10.5, align: 'center', weight: 700 }); text(ctx, 'coat parts', cx, by + 20, { color: col.s[0], size: 10.5, align: 'center', weight: 700 }); }
    if (s === 3) { [[-50, -14], [-10, -26], [34, -12], [-30, 24], [20, 26]].forEach(([dx, dy]) => phage(ctx, cx + dx, cy + dy - 4, 0.8, col)); }
    if (s === 4) { [[-60, -20], [0, -44], [60, -20], [-50, 48], [50, 54], [0, 72], [-90, 20], [90, 20]].forEach(([dx, dy], k) => phage(ctx, cx + dx, cy + dy - 10, 0.85, col)); }
    if (s === 5) { ell(ctx, cx, cy, 36, 22, col.s[4], col.ink, 1.2, 0.5); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, 26, 0.4, 1.4); ctx.stroke(); text(ctx, 'prophage', cx + 44, cy + 22, { color: col.s[3], size: 10.5, weight: 700 }); text(ctx, 'host chromosome', cx - 38, cy - 34, { color: col.muted, size: 10, align: 'center' }); }
    note(ctx, N[s], 12, h - 62, w - 24, col, { size: 11 });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
