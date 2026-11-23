// Class 11 Chemistry, Some Basic Concepts (step player): a stoichiometry calculation in four hops,
// grams of A -> moles of A -> moles of B (mole ratio from the balanced equation) -> grams of B.
// Example: 2 H2 + O2 -> 2 H2O; how much water comes from 8.0 g of hydrogen?
import { canvas, text, title, arrow } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 300, label: 'Four hops from grams of hydrogen to grams of water' });
  const B = [['8.0 g H₂', 'given'], ['4.0 mol H₂', '÷ 2.0 g/mol'], ['4.0 mol H₂O', '× 2/2 from 2H₂ + O₂ → 2H₂O'], ['72 g H₂O', '× 18 g/mol']];
  const HEAD = ['What we know', 'Hop 1: grams to moles', 'Hop 2: use the mole ratio', 'Hop 3: moles to grams'];
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, HEAD[Math.min(st, 3)], col) + 12, bw = w * 0.42, bh = 38, xs = [8, w - bw - 8], ys = [t0 + 6, t0 + 6 + (h - t0 - 60) / 1, ];
    const pos = [[8, t0 + 6], [w - bw - 8, t0 + 6], [w - bw - 8, t0 + 96], [8, t0 + 96]];
    for (let i = 0; i < 4; i++) {
      const [x, y] = pos[i], on = i <= st, hot = i === st; ctx.strokeStyle = on ? col.s[i] : col.line; ctx.lineWidth = hot ? 3 : 1.5; ctx.fillStyle = on ? col.soft : col.panel; ctx.fillRect(x, y, bw, bh); ctx.strokeRect(x, y, bw, bh);
      text(ctx, on ? B[i][0] : '?', x + bw / 2, y + bh / 2, { color: on ? col.ink : col.muted, size: 14, weight: 700, align: 'center' });
      if (i > 0 && on) { const [px, py] = pos[i - 1]; const fx = px + (i === 1 ? bw : bw / 2), fy = py + (i === 1 ? bh / 2 : bh), tx = x + (i === 1 ? 0 : bw / 2), ty = y + (i === 1 ? bh / 2 : (i === 2 ? 0 : bh / 2)); if (i === 3) arrow(ctx, px, py + bh / 2, x + bw, y + bh / 2, col.s[i], 2.5, 8); else arrow(ctx, fx, fy, tx, ty, col.s[i], 2.5, 8); text(ctx, B[i][1], w / 2, i === 1 ? t0 + 6 + bh + 14 : i === 2 ? t0 + 6 + bh + 40 : t0 + 96 + bh + 14, { color: col.s[i], size: 11, weight: 700, align: 'center' }); }
    }
    text(ctx, st < 3 ? 'balanced equation: 2 H₂ + O₂ → 2 H₂O' : 'check: 8 g H₂ + 64 g O₂ = 72 g H₂O (mass kept)', w / 2, h - 14, { color: col.muted, size: 11.5, align: 'center' });
  };
  return { step(i) { st = Math.min(i, 3); cv.redraw(); } };
}
