// Class 9 Cell: the cell as a factory. Tap an organelle (or pick from the list) to see what it does and the factory
// part it matches: nucleus = manager's office, mitochondria = power house, ER = assembly lines and roads, ribosomes
// = workers, Golgi = packing and dispatch, lysosomes = waste disposal, vacuole = store room, membrane = security
// gate, plastids (chloroplast) = solar plant. The analogy is a memory aid, not exact.
import { canvas, text, title, dot, line, row, choice } from '../../kit.js';

const P = [
  ['nucleus', 'Nucleus', 'Manager’s office', 'Holds the DNA, the instructions for the whole cell, and controls what the cell does.', 0.5, 0.42, 0.13],
  ['mito', 'Mitochondria', 'Power house', 'Break down food with oxygen and release energy (ATP) for the cell’s work.', 0.8, 0.28, 0.09],
  ['er', 'Endoplasmic reticulum', 'Assembly lines and roads', 'Network of tubes. Rough ER (with ribosomes) makes proteins; smooth ER makes fats and removes poisons.', 0.28, 0.3, 0.09],
  ['ribo', 'Ribosomes', 'Workers', 'Tiny granules that join amino acids into proteins using the instructions from DNA.', 0.22, 0.58, 0.05],
  ['golgi', 'Golgi apparatus', 'Packing and dispatch', 'Packs, labels and sends out the cell’s products in small bags (vesicles).', 0.74, 0.62, 0.09],
  ['lyso', 'Lysosomes', 'Waste disposal', 'Bags of enzymes that digest worn-out parts and germs the cell swallows.', 0.46, 0.7, 0.06],
  ['vac', 'Vacuole', 'Store room', 'Stores water, sugar, salts and waste. In a plant cell it is one large central sac.', 0.52, 0.2, 0.06],
  ['mem', 'Cell membrane', 'Security gate', 'Thin skin that decides what goes in and out of the cell.', 0.08, 0.5, 0.05],
];
export default function (host) {
  let sel = 0;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 300, label: 'A cell drawn as a factory with each organelle matched to a part of the factory' });
  const ctl = row(host);
  choice(ctl, 'Part', P.map((p, i) => [i, p[1].split(' ')[0]]), 0, (v) => { sel = v; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'The cell is a factory', col);
    const X = 10, Y = 40, W = w - 20, H = h * 0.62;
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.s[4]; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(X, Y, W, H, 22); ctx.fill(); ctx.stroke();
    P.forEach((p, i) => {
      const x = X + p[4] * W, y = Y + (p[5] - 0.1) * H / 0.7 * 0.8 + 6, r = Math.max(9, p[6] * W * 0.6), on = i === sel;
      const c = col.s[[0, 2, 1, 3, 5, 6, 4, 7][i]];
      if (p[0] === 'er') { for (let k = 0; k < 4; k++) line(ctx, [[x - r, y - r * 0.5 + k * 7], [x, y - r * 0.2 + k * 7 + 4], [x + r, y - r * 0.5 + k * 7]], c, on ? 3 : 2); }
      else if (p[0] === 'mem') { ctx.strokeStyle = c; ctx.lineWidth = on ? 6 : 3; ctx.beginPath(); ctx.roundRect(X, Y, W, H, 22); ctx.stroke(); }
      else if (p[0] === 'ribo') { for (let k = 0; k < 4; k++) dot(ctx, x + k * 9 - 12, y + (k % 2) * 7, on ? 4.5 : 3.5, c); }
      else if (p[0] === 'golgi') { for (let k = 0; k < 3; k++) line(ctx, [[x - r, y - r * 0.4 + k * 7], [x + r, y - r * 0.4 + k * 7]], c, on ? 6 : 4); }
      else if (p[0] === 'mito') { ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.6, 0.4, 0, 7); ctx.fillStyle = c; ctx.fill(); }
      else { dot(ctx, x, y, r, c); if (p[0] === 'nucleus') dot(ctx, x, y, r * 0.35, col.panel); }
      if (on) { ctx.beginPath(); ctx.arc(x, y, Math.max(r, 14) + 6, 0, 7); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]); }
    });
    const p = P[sel];
    text(ctx, p[1] + '  =  ' + p[2], 10, Y + H + 20, { color: col.ink, size: 12.5, weight: 700 });
    const words = p[3].split(' '); const Ls = []; let cur = ''; ctx.font = '11px system-ui';
    words.forEach((wd) => { if (ctx.measureText((cur + ' ' + wd).trim()).width > w - 20 && cur) { Ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); Ls.push(cur);
    Ls.forEach((l, i) => text(ctx, l, 10, Y + H + 40 + i * 15, { color: col.ink, size: 11 }));
  };
  cv.redraw();
}
