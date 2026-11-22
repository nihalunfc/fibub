// Class 9 Cell: compare a bacterium (prokaryote), an animal cell and a plant cell (both eukaryotes). Pick a cell to
// draw it and tick the features it has. Prokaryotes have no true nucleus (DNA lies free in a region called the
// nucleoid) and no membrane-bound organelles; plant cells add a cell wall, chloroplasts and a large central vacuole.
import { canvas, text, title, dot, line, row, choice } from '../../kit.js';

const F = ['Cell wall', 'True nucleus', 'Membrane-bound organelles', 'Chloroplasts', 'Large central vacuole', 'Typical size'];
const D = { bact: [1, 0, 0, 0, 0, '1-5 µm'], anim: [0, 1, 1, 0, 0, '10-30 µm'], plant: [1, 1, 1, 1, 1, '10-100 µm'] };
export default function (host) {
  let k = 'bact';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A bacterium, an animal cell and a plant cell with a tick list of the parts each one has' });
  const ctl = row(host);
  choice(ctl, 'Cell', [['bact', 'Bacterium'], ['anim', 'Animal cell'], ['plant', 'Plant cell']], k, (v) => { k = v; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, { bact: 'Bacterium: prokaryote', anim: 'Animal cell: eukaryote', plant: 'Plant cell: eukaryote' }[k], col);
    const cx = w / 2, cy = 40 + (h * 0.4) / 2 + 6, rw = Math.min(w * 0.42, 150), rh = h * 0.17;
    ctx.lineWidth = 2.5;
    if (k === 'bact') {
      ctx.strokeStyle = col.s[2]; ctx.fillStyle = col.panel; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(cx - rw * 0.8, cy - rh * 0.8, rw * 1.6, rh * 1.6, rh * 0.8); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath(); for (let a = 0; a < 22; a += 0.3) { const x = cx - rw * 0.35 + Math.sin(a * 1.3) * rw * 0.3, y = cy + Math.cos(a * 0.9) * rh * 0.45; a ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      for (let i = 0; i < 8; i++) dot(ctx, cx + rw * 0.25 + (i % 4) * 10, cy - 6 + Math.floor(i / 4) * 12, 2.5, col.s[3]);
      line(ctx, [[cx + rw * 0.8, cy], [cx + rw * 1.1, cy - 12], [cx + rw * 1.3, cy + 6], [cx + rw * 1.5, cy - 6]], col.muted, 2);
      text(ctx, 'free DNA (nucleoid)', cx - rw * 0.8, cy + rh * 1.15, { color: col.s[0], size: 10.5, weight: 700 });
    } else {
      ctx.strokeStyle = col.s[4]; ctx.fillStyle = col.panel; ctx.lineWidth = k === 'plant' ? 3 : 4;
      if (k === 'plant') { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 6; ctx.strokeRect(cx - rw, cy - rh * 1.1, rw * 2, rh * 2.2); ctx.fillRect(cx - rw, cy - rh * 1.1, rw * 2, rh * 2.2); ctx.strokeStyle = col.s[4]; ctx.lineWidth = 2; ctx.strokeRect(cx - rw + 5, cy - rh * 1.1 + 5, rw * 2 - 10, rh * 2.2 - 10); }
      else { ctx.beginPath(); for (let a = 0; a < 6.3; a += 0.1) { const r = 1 + 0.08 * Math.sin(a * 5); const x = cx + Math.cos(a) * rw * r, y = cy + Math.sin(a) * rh * 1.1 * r; a ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); ctx.fill(); ctx.stroke(); }
      dot(ctx, cx - rw * (k === 'plant' ? 0.55 : 0.2), cy - rh * (k === 'plant' ? 0.5 : 0.2), rh * 0.4, col.s[0], col.ink); dot(ctx, cx - rw * (k === 'plant' ? 0.55 : 0.2), cy - rh * (k === 'plant' ? 0.5 : 0.2), rh * 0.12, col.ink);
      if (k === 'plant') { ctx.fillStyle = col.soft; ctx.fillRect(cx - rw * 0.15, cy - rh * 0.8, rw * 0.9, rh * 1.6); for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(cx - rw * 0.7 + i * 16, cy + rh * 0.7, 8, 5, 0, 0, 7); ctx.fillStyle = col.good; ctx.fill(); } }
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(cx + rw * (k === 'plant' ? 0.55 : 0.15 + i * 0.22), cy + rh * (k === 'plant' ? 0.9 : 0.1 + i * 0.25), 9, 5, 0.5, 0, 7); ctx.fillStyle = col.s[1]; if (k === 'plant' && i > 0) continue; ctx.fill(); }
      if (k === 'anim') { dot(ctx, cx + rw * 0.5, cy - rh * 0.4, 4, col.s[5]); dot(ctx, cx - rw * 0.3, cy + rh * 0.6, 4, col.s[5]); }
    }
    const y0 = 40 + h * 0.4 + 24, rowH = (h - y0 - 8) / F.length;
    F.forEach((f, i) => { const v = D[k][i], y = y0 + i * rowH + rowH / 2; ctx.fillStyle = i % 2 ? col.panel : col.soft; ctx.fillRect(8, y - rowH / 2, w - 16, rowH);
      text(ctx, f, 14, y, { color: col.ink, size: 11 }); const yes = v === 1;
      text(ctx, typeof v === 'string' ? v : yes ? '✓ yes' : '✗ no', w - 14, y, { color: typeof v === 'string' ? col.ink : yes ? col.good : col.bad, size: 11, weight: 700, align: 'right' }); });
  };
  cv.redraw();
}
