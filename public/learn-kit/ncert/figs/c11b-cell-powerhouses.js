// Class 11 Cell: the two energy organelles, both with a double membrane and their own circular DNA and 70S ribosomes (they were once free bacteria: endosymbiosis).
// Mitochondrion: outer membrane, folded inner membrane (cristae) with the ATP-making machinery, and the matrix. Chloroplast: outer and inner membranes, stacks of thylakoids (grana), and the stroma.
import { canvas, text, title, row, choice } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

const T = {
  mi: ['Mitochondrion', 'Size about 1 to 10 µm. The cristae multiply the inner surface where ATP is made; the matrix holds Krebs-cycle enzymes, DNA and ribosomes. More active cells (heart muscle) have more of them.'],
  ch: ['Chloroplast', 'Size about 5 to 10 µm. Light reactions take place in the thylakoid membranes of the grana (chlorophyll); the Calvin cycle runs in the stroma. It also has DNA and ribosomes.'],
};
export default function (host) {
  let k = 'mi';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Cut-away drawings of a mitochondrion and a chloroplast with their membranes and inner parts' });
  const ctl = row(host);
  choice(ctl, 'Organelle', [['mi', 'Mitochondrion'], ['ch', 'Chloroplast']], k, (v) => { k = v; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[k][0], col), fy = footer(ctx, w, h, col, T[k][1]);
    const cx = w / 2, cy = (t0 + fy) / 2 + 2, rx = Math.min(w / 2 - 24, 150), ry = Math.min((fy - t0) / 2 - 22, rx * 0.55);
    const lab = (s, x, y, al = 'left', c) => text(ctx, s, x, y, { color: c ?? col.ink, size: 10.5, weight: 700, align: al, fit: false, halo: col.panel });
    if (k === 'mi') {
      ellipse(ctx, cx, cy, rx, ry, col.s[4] + '22', col.s[4], 3.5); ellipse(ctx, cx, cy, rx - 8, ry - 8, col.s[4] + '33', col.s[4], 2);
      ctx.strokeStyle = col.s[4]; ctx.lineWidth = 2.2; for (let i = -4; i <= 4; i++) { const x = cx + i * rx * 0.2, up = i % 2; ctx.beginPath(); ctx.moveTo(x, up ? cy - ry + 8 : cy + ry - 8); ctx.lineTo(x, up ? cy + ry * 0.35 : cy - ry * 0.35); ctx.stroke(); }
      ellipse(ctx, cx - rx * 0.62, cy + 2, 6, 3, col.s[0]); [0.1, 0.25].forEach((f) => ellipse(ctx, cx + rx * f, cy + ry * 0.05, 2.5, 2.5, col.ink));
      lab('outer membrane', cx - rx + 4, cy - ry - 8); lab('inner membrane (cristae)', cx + rx, cy - ry * 0.5 - 22, 'right', col.s[4]); lab('matrix (enzymes, DNA)', cx + rx * 0.15, cy + ry * 0.62, 'center'); lab('ATP made here', cx + rx, cy + ry + 10, 'right', col.s[3]);
    } else {
      ellipse(ctx, cx, cy, rx, ry, col.s[2] + '22', col.s[2], 3.5); ellipse(ctx, cx, cy, rx - 7, ry - 7, col.s[2] + '22', col.s[2], 2);
      for (let g = 0; g < 3; g++) { const gx = cx - rx * 0.5 + g * rx * 0.5, gy = cy + (g === 1 ? ry * 0.1 : -ry * 0.1); for (let i = 0; i < 5; i++) { ctx.fillStyle = col.s[5]; ctx.strokeStyle = col.ink; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.roundRect(gx - 17, gy - 22 + i * 9, 34, 7, 3); ctx.fill(); ctx.stroke(); } if (g < 2) { ctx.strokeStyle = col.s[5]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx + 17, gy - 5); ctx.lineTo(gx + rx * 0.5 - 17, (g === 0 ? cy + ry * 0.1 : cy - ry * 0.1) - 5); ctx.stroke(); } }
      ellipse(ctx, cx + rx * 0.72, cy + ry * 0.45, 5, 5, col.s[0]); ellipse(ctx, cx - rx * 0.7, cy + ry * 0.55, 8, 4, col.s[1]);
      lab('outer + inner membrane', cx - rx + 4, cy - ry - 8); lab('granum (stack of thylakoids)', cx - rx * 0.5 - 20, cy + ry * 0.55, 'left', col.s[5]); lab('stroma (Calvin cycle)', cx + rx - 4, cy - ry * 0.55, 'right'); lab('sugar made here', cx + rx, cy + ry + 10, 'right', col.s[3]);
    }
  };
}
