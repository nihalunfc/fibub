// Class 11 Chemistry, Some Basic Concepts (step player): empirical formula from percentage composition.
// Example: 40.0 % C, 6.7 % H, 53.3 % O. Take 100 g, divide each mass by its atomic mass, divide by the smallest, clear fractions.
import { canvas, text, title } from '../../kit.js';

const D = [['C', 40.0, 12.0], ['H', 6.7, 1.0], ['O', 53.3, 16.0]];
export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 300, label: 'Step by step table from percentage composition to the empirical formula' });
  const mol = D.map((d) => d[1] / d[2]), mn = Math.min(...mol), ratio = mol.map((m) => m / mn);
  const COLS = ['element', 'mass (g)', 'moles', '÷ smallest', 'whole'], HEAD = ['Start: percent composition', 'Take 100 g of compound', 'Moles = mass ÷ atomic mass', 'Divide by the smallest', 'Round to a whole-number ratio'];
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, HEAD[Math.min(st, 4)], col) + 16, cw = (w - 16) / 5, rh = 40, use = [0, 1, 2, 3, 4];
    use.forEach((c) => { if (c <= Math.max(0, st - (st >= 1 ? 0 : 0))) { /* header */ } });
    const colsShown = st === 0 ? 1 : st === 1 ? 2 : st === 2 ? 3 : st === 3 ? 4 : 5;
    for (let c = 0; c < colsShown; c++) text(ctx, st === 0 && c === 0 ? 'element, %' : COLS[c], 8 + c * cw + cw / 2, t0, { color: col.muted, size: 11, weight: 700, align: 'center' });
    D.forEach((d, r) => {
      const y = t0 + 28 + r * rh, vals = [d[0], st === 0 ? d[1].toFixed(1) + ' %' : d[1].toFixed(1), mol[r].toFixed(2), ratio[r].toFixed(2), String(Math.round(ratio[r]))];
      for (let c = 0; c < colsShown; c++) { const hot = c === colsShown - 1; if (hot) { ctx.fillStyle = col.s[r]; ctx.globalAlpha = 0.18; ctx.fillRect(8 + c * cw + 2, y - 15, cw - 4, 30); ctx.globalAlpha = 1; } text(ctx, vals[c], 8 + c * cw + cw / 2, y, { color: c === 0 ? col.s[r] : col.ink, size: c === 0 ? 16 : 13, weight: 700, align: 'center' }); }
    });
    const y = t0 + 28 + 3 * rh + 14;
    if (st === 0) text(ctx, 'percent means grams in 100 g', w / 2, y, { color: col.muted, size: 12, align: 'center' });
    if (st === 1) text(ctx, 'percent turns into grams: 40.0 g, 6.7 g, 53.3 g', w / 2, y, { color: col.muted, size: 12, align: 'center' });
    if (st === 2) text(ctx, 'moles are what atoms count in', w / 2, y, { color: col.muted, size: 12, align: 'center' });
    if (st === 3) text(ctx, 'smallest is 3.33 mol (C): C = 1.00, H = 2.00, O = 1.00', w / 2, y, { color: col.muted, size: 12, align: 'center' });
    if (st >= 4) { text(ctx, 'empirical formula', w / 2, y, { color: col.muted, size: 12, align: 'center' }); text(ctx, 'CH₂O', w / 2, y + 34, { color: col.s[2], size: 30, weight: 700, align: 'center' }); text(ctx, 'molar mass 180 g/mol ÷ 30 = 6, so C₆H₁₂O₆', w / 2, y + 62, { color: col.ink, size: 12, align: 'center' }); }
  };
  return { step(i) { st = Math.min(i, 4); cv.redraw(); } };
}
