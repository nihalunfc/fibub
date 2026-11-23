// Class 11 Chemistry, Classification of Elements (step player): Mendeleev's gaps and predictions. He ordered elements by atomic mass, put similar ones in the same column
// and left gaps. For "eka-aluminium" and "eka-silicon" he predicted atomic mass and density; gallium (1875) and germanium (1886) matched.
// Predicted vs found: eka-Al 68, 5.9 g/cm3 vs Ga 69.7, 5.91; eka-Si 72, 5.5 vs Ge 72.6, 5.32.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 260, label: 'Mendeleev left gaps in his table and predicted the properties of the missing elements' });
  const HEAD = ['Sort by atomic mass', 'Put similar elements in a column', 'A gap: the next mass does not fit', 'Predict the missing element', 'Gallium and germanium are found'];
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, HEAD[st], col) + 14, cw = (w - 24) / 4, ch = 40, x0 = 12, ys = t0 + 8;
    const cells = [['Zn 65', 0, 0], ['Al 27', 1, 1], ['Si 28', 2, 1], ['P 31', 3, 1], ['?', 1, 2], ['?', 2, 2], ['As 75', 3, 2], ['Se 79', 4, 2]];
    if (st === 0) { ['Al 27', 'Si 28', 'P 31', 'Zn 65', 'As 75', 'Se 79'].forEach((s, i) => { const x = x0 + (i % 4) * cw, y = ys + Math.floor(i / 4) * (ch + 8); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.strokeRect(x, y, cw - 6, ch); text(ctx, s, x + (cw - 6) / 2, y + ch / 2, { color: col.ink, size: 13, weight: 700, align: 'center' }); }); text(ctx, 'ordered by atomic mass, one after the other', w / 2, ys + 2 * (ch + 8) + 12, { color: col.muted, size: 11.5, align: 'center' }); return; }
    const rows = [['B', 'Al 27', 'Si 28', 'P 31'], ['(gap)', '?', '?', 'As 75'], ['', 'Ga? (next in line is Zn 65)', 'Ge?', '']];
    const colx = (i) => x0 + 30 + i * ((w - 50) / 3), gx = (w - 50) / 3;
    ['group III', 'group IV', 'group V'].forEach((g, i) => text(ctx, g, colx(i) + gx / 2 - 6, ys + 4, { color: col.muted, size: 11, weight: 700, align: 'center' }));
    const R = [['Al 27', 'Si 28', 'P 31'], [st >= 2 ? '? (gap)' : 'Zn 65', st >= 2 ? '? (gap)' : 'As 75', 'As 75']];
    const rowsT = [['Al 27', 'Si 28', 'P 31'], [st >= 4 ? 'Ga 69.7' : '? (gap)', st >= 4 ? 'Ge 72.6' : '? (gap)', 'As 75']];
    rowsT.forEach((r, ri) => r.forEach((s, ci) => { const x = colx(ci), y = ys + 16 + ri * (ch + 10), gap = s.startsWith('?'); ctx.strokeStyle = gap ? col.s[3] : col.s[0]; ctx.setLineDash(gap ? [4, 3] : []); ctx.lineWidth = 2; ctx.strokeRect(x, y, gx - 8, ch); ctx.setLineDash([]); text(ctx, s, x + (gx - 8) / 2, y + ch / 2, { color: gap ? col.s[3] : col.ink, size: 12.5, weight: 700, align: 'center' }); }));
    if (st >= 3) { const y = ys + 16 + 2 * (ch + 10) + 20; text(ctx, 'predicted (1871)', 12, y, { color: col.muted, size: 11, weight: 700 }); text(ctx, 'eka-aluminium: mass 68, density 5.9', 12, y + 18, { color: col.s[0], size: 12 }); text(ctx, 'eka-silicon: mass 72, density 5.5', 12, y + 36, { color: col.s[1], size: 12 }); if (st >= 4) { text(ctx, 'found: gallium 69.7, 5.91 (1875)', 12, y + 62, { color: col.s[0], size: 12, weight: 700 }); text(ctx, 'found: germanium 72.6, 5.32 (1886)', 12, y + 80, { color: col.s[1], size: 12, weight: 700 }); } }
    if (st === 1) text(ctx, 'Al, Si, P in a row: same valence pattern as the elements below', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
    if (st === 2) text(ctx, 'He left the boxes empty instead of forcing a fit', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  return { step(i) { st = Math.min(i, 4); cv.redraw(); } };
}
