// Class 11 Cell (step player): the endomembrane system follows one secreted protein (such as a digestive enzyme or insulin). A ribosome on the rough ER makes it into the ER space; a vesicle
// carries it to the Golgi; the Golgi modifies and sorts it; a secretory vesicle fuses with the plasma membrane and releases it (exocytosis). Lysosomes come from the Golgi too.
import { canvas, text, title } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

const NOTE = [
  'The gene is copied into mRNA in the nucleus. The mRNA leaves through a nuclear pore and meets ribosomes on the rough ER.',
  'The ribosome builds the protein and pushes it into the space (lumen) of the rough ER, where it folds. Proteins for export are made here.',
  'The ER buds off a small transport vesicle that carries the protein to the cis face (the receiving side) of the Golgi body.',
  'Inside the Golgi the protein moves through the flat sacs, gets sugar groups or other changes (modification), and is sorted by destination.',
  'From the trans face (the shipping side), a secretory vesicle carries it to the plasma membrane. Some vesicles become lysosomes instead.',
  'The vesicle fuses with the membrane and releases the protein outside: exocytosis. The membrane of the vesicle becomes part of the plasma membrane.',
];
const T = ['1. Message leaves the nucleus', '2. Protein made on rough ER', '3. Transport vesicle', '4. Golgi modifies and sorts', '5. Secretory vesicle', '6. Exocytosis'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'Six steps of a protein travelling from the nucleus and rough ER through the Golgi to the outside of the cell' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[s], col), fy = footer(ctx, w, h, col, NOTE[s]);
    const x0 = 12, y0 = t0 + 8, W = w - 24, H = fy - y0 - 6, cx = x0 + W * 0.3, cy = y0 + H * 0.4;
    ctx.beginPath(); ctx.roundRect(x0, y0, W, H, 26); ctx.fillStyle = col.soft; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = col.s[3]; ctx.stroke();
    text(ctx, 'outside', x0 + W - 8, y0 + H + 0, { color: col.muted, size: 10, align: 'right', base: 'bottom', fit: false });
    const nr = Math.min(W, H) * 0.17, nx = x0 + W * 0.2, ny = y0 + H * 0.27;
    ellipse(ctx, nx, ny, nr, nr, col.s[0] + '44', col.s[0], 3); text(ctx, 'nucleus', nx, ny - 6, { color: col.ink, size: 10.5, weight: 700, align: 'center', fit: false }); text(ctx, 'DNA', nx, ny + 8, { color: col.muted, size: 10, align: 'center', fit: false });
    const erx = nx + nr + 8, ery = ny + nr * 0.1;
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 4; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(nx, ny, nr + 8 + i * 8, -0.1, 1.5); ctx.stroke(); }
    const gx = x0 + W * 0.52, gy = y0 + H * 0.66; ctx.strokeStyle = col.s[5]; ctx.lineWidth = 4; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(gx, gy + 14 - i * 9, 34 - i * 3, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
    text(ctx, 'rough ER', nx + nr * 0.9, ny + nr + 28, { color: col.s[2], size: 10.5, weight: 700, fit: false }); text(ctx, 'Golgi body', gx, gy + 36, { color: col.s[5], size: 10.5, weight: 700, align: 'center', fit: false });
    text(ctx, 'cis', gx - 40, gy + 14, { color: col.muted, size: 9.5, fit: false }); text(ctx, 'trans', gx + 28, gy - 20, { color: col.muted, size: 9.5, fit: false });
    const mx = x0 + W * 0.95, my = y0 + H * 0.42;
    const pt = (x, y, r = 4.5, c = col.s[4]) => ellipse(ctx, x, y, r, r, c, col.panel, 1.5);
    const arr = (x1, y1, x2, y2) => { ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]); };
    const erp = [nx + nr + 12, ny + nr * 0.55], gcis = [gx - 34, gy + 12], gtr = [gx + 30, gy - 24];
    if (s === 0) { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(nx + nr * 0.4, ny + 4); ctx.bezierCurveTo(nx + nr + 4, ny + 4, nx + nr + 6, ny + nr * 0.5, erp[0], erp[1]); ctx.stroke(); text(ctx, 'mRNA', nx + nr + 16, ny + 6, { color: col.s[1], size: 10.5, weight: 700, fit: false }); ellipse(ctx, erp[0], erp[1], 4, 4, col.ink); }
    if (s >= 1 && s <= 1) { ellipse(ctx, erp[0], erp[1], 4, 4, col.ink); for (let i = 0; i < 5; i++) pt(erp[0] + 6 + i * 6, erp[1] + 12 + i * 3, 3.2); text(ctx, 'protein chain enters the ER', erp[0] + 24, erp[1] - 8, { color: col.s[4], size: 10, weight: 700, fit: false }); }
    if (s === 2) { arr(erp[0] + 12, erp[1] + 14, gcis[0], gcis[1]); const px = erp[0] + (gcis[0] - erp[0]) * 0.5, py = erp[1] + (gcis[1] - erp[1]) * 0.5 + 8; ellipse(ctx, px, py, 8, 8, col.panel, col.s[4], 2); pt(px, py, 3.5); text(ctx, 'vesicle', px + 12, py - 4, { color: col.s[4], size: 10, weight: 700, fit: false }); }
    if (s === 3) { for (let i = 0; i < 4; i++) { const f = i / 3; pt(gcis[0] + 14 + f * 18, gcis[1] - 2 - f * 28, 3.5, [col.s[4], col.s[4], col.s[1], col.s[1]][i]); } text(ctx, 'sugar added', gx + 40, gy - 4, { color: col.s[1], size: 10, weight: 700, fit: false }); }
    if (s === 4) { arr(gtr[0] + 6, gtr[1] - 4, mx - 14, my); ellipse(ctx, gtr[0] + (mx - gtr[0]) * 0.55, gtr[1] + (my - gtr[1]) * 0.55 - 6, 9, 9, col.panel, col.s[1], 2); pt(gtr[0] + (mx - gtr[0]) * 0.55, gtr[1] + (my - gtr[1]) * 0.55 - 6, 3.5, col.s[1]); text(ctx, 'secretory vesicle', gtr[0] + (mx - gtr[0]) * 0.55 - 40, gtr[1] + (my - gtr[1]) * 0.55 + 12, { color: col.s[1], size: 10, weight: 700, fit: false }); ellipse(ctx, gtr[0] + 8, gtr[1] + 24, 7, 7, col.s[6] + '99', col.s[6], 1.5); text(ctx, 'lysosome', gtr[0] + 18, gtr[1] + 30, { color: col.s[6], size: 10, weight: 700, fit: false }); }
    if (s === 5) { ellipse(ctx, mx - 4, my, 11, 11, col.panel, col.s[1], 2); ctx.strokeStyle = col.soft; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(mx + 6, my - 8); ctx.lineTo(mx + 6, my + 8); ctx.stroke(); for (let i = 0; i < 4; i++) pt(mx + 16 + i * 4, my - 10 + i * 7, 3.5, col.s[1]); text(ctx, 'released', mx - 8, my - 22, { color: col.s[1], size: 10.5, weight: 700, align: 'right', fit: false }); }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
