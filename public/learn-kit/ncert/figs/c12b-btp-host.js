// Class 12 Biology, Biotechnology: Principles and Processes: ways to put recombinant DNA into a host cell.
// Bacteria are made competent with CaCl2 and a heat shock (pores open at 42 C). Animal cells can be microinjected. Plant cells can be hit with
// gold or tungsten particles coated with DNA (a gene gun) or infected with a disarmed Agrobacterium (Ti plasmid); disarmed retroviruses
// carry genes into animal cells.
import { canvas, text, title, line, dot, row, choice, readout, loop, rng } from '../../kit.js';

export default function (host) {
  let m = 'heat', t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'An animated host cell receiving DNA by heat shock, microinjection, gene gun or a disarmed vector' });
  const ctl = row(host), ro = readout(host);
  const INFO = { heat: 'Heat shock (bacteria): treat with calcium chloride so the cell wall and membrane become leaky, chill with the DNA, warm to 42 °C for a moment, chill again. The pores open and the plasmid slips in.', inj: 'Micro-injection (animal cells): a glass needle thinner than a hair puts DNA straight into the nucleus of one cell.', gun: 'Gene gun (plant cells): microscopic gold or tungsten particles coated with DNA are shot at high speed through the cell wall.', vec: 'Disarmed vector: a pathogen that normally inserts its own DNA (Agrobacterium for plants, a retrovirus for animal cells) has its disease genes removed and carries the new gene in instead.' };
  choice(ctl, 'Method', [['heat', 'Heat shock'], ['inj', 'Needle'], ['gun', 'Gene gun'], ['vec', 'Disarmed vector']], 'heat', (v) => { m = v; t = 0; ro.textContent = INFO[v]; cv.redraw(); });
  ro.textContent = INFO.heat;
  loop(host, (dt) => { t = (t + dt * 0.22) % 1; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Getting DNA into a cell', col) + 8, cx = w * 0.55, cy = top + (h - top) * 0.5, R = Math.min(w * 0.26, (h - top) * 0.36), r = rng(3);
    const memb = (leaky) => { ctx.lineWidth = 4; ctx.strokeStyle = col.ink; ctx.setLineDash(leaky ? [7, 8] : []); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.setLineDash([]); };
    ctx.fillStyle = col.soft; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 4, cy, R * 0.34, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = col.muted; ctx.stroke();
    const plas = (x, y, c = col.s[2]) => { ctx.lineWidth = 2; ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.stroke(); };
    if (m === 'heat') {
      const T = t < 0.3 ? 0 + t / 0.3 * 0 : t < 0.6 ? 42 : 0, hot = t >= 0.3 && t < 0.6; memb(hot);
      for (let k = 0; k < 6; k++) { const a = r() * 6.28, d0 = R + 30 + r() * 40, prog = hot ? Math.min(1, (t - 0.3) / 0.3) : t >= 0.6 ? 1 : 0, d = d0 - prog * (d0 - R * 0.45); plas(cx + Math.cos(a) * d, cy + Math.sin(a) * d); }
      text(ctx, `${T} °C ${t < 0.3 ? '(ice, DNA added)' : hot ? '(42 °C shock)' : '(ice again)'}`, w / 2, h - 12, { color: hot ? col.bad : col.s[0], size: 11, weight: 700, align: 'center' });
      text(ctx, 'bacterium + CaCl₂', cx, cy - R - 10, { color: col.muted, size: 10, align: 'center' });
    } else if (m === 'inj') {
      memb(false); const k = Math.min(1, t / 0.5), nx = cx - R - 70 + k * (R * 0.8 + 70);
      line(ctx, [[nx - 70, cy - 24], [nx, cy]], col.ink, 5); line(ctx, [[nx - 70, cy - 24], [nx - 130, cy - 44]], col.muted, 9);
      if (t > 0.5) for (let j = 0; j < 4; j++) plas(cx + 5 + (j - 1.5) * 7, cy + (j % 2) * 6 - 3);
      text(ctx, 'glass micro-needle', Math.max(10, nx - 120), cy - 54, { color: col.muted, size: 10 }); text(ctx, 'animal cell', cx, cy + R + 14, { color: col.muted, size: 10, align: 'center' });
    } else if (m === 'gun') {
      memb(false); ctx.lineWidth = 6; ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.arc(cx, cy, R + 5, 0, 7); ctx.stroke(); ctx.lineWidth = 3; ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
      for (let k = 0; k < 7; k++) { const yy = cy + (k - 3) * 11, stop = cx - R * 0.55 + (k % 3) * 14, x = 8 + Math.min(1, t * 1.6) * (stop - 8); dot(ctx, x, yy, 3.2, col.warn); }
      text(ctx, 'gold / tungsten particles coated with DNA', 10, cy - R - 12, { color: col.muted, size: 10 }); text(ctx, 'plant cell (cell wall in grey)', cx, cy + R + 16, { color: col.muted, size: 10, align: 'center' });
    } else {
      memb(false); const k = Math.min(1, t / 0.55), bx = cx - R - 60 + k * 40;
      ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx - 28, cy - 9, 56, 18, 9) : ctx.rect(bx - 28, cy - 9, 56, 18); ctx.fill();
      text(ctx, 'disarmed vector', bx, cy - 20, { color: col.s[3], size: 10, weight: 700, align: 'center' }); plas(bx, cy, col.panel);
      if (t > 0.55) { const q = (t - 0.55) / 0.45; for (let j = 0; j < 2; j++) plas(bx + 30 + q * (R * 0.9), cy + (j - 0.5) * 8); }
      text(ctx, 'host cell', cx, cy + R + 14, { color: col.muted, size: 10, align: 'center' });
    }
  };
  cv.redraw();
}
