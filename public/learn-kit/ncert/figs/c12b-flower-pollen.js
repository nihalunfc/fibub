// Class 12 Biology, Sexual Reproduction in Flowering Plants (step player): making pollen. A cross-section of one pollen sac (microsporangium):
// wall layers around sporogenous tissue; each cell is a pollen mother cell (2n). Meiosis turns one into a tetrad of four microspores (n); each
// becomes a pollen grain (vegetative cell + generative cell); the generative cell divides to give two male gametes (n). Example 2n = 24.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Steps from a pollen sac to a pollen grain with two male gametes' });
  const T = ['A pollen sac (microsporangium)', 'Every inner cell is a pollen mother cell: 2n = 24', 'Meiosis: one cell, four pollen grains', 'A pollen grain has two cells', 'Two male gametes'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col) + 6, cx = w / 2, cy = top + (h - top) / 2 - 8, S = Math.min(w, (h - top) * 1.1) / 400;
    const circ = (x, y, r, fill, stroke, lw = 1.5) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); } };
    const lab = (s, x, y, al = 'center', c = col.ink, sz = 11.5, wt = 600) => text(ctx, s, x, y, { color: c, size: sz, weight: wt, align: al, halo: col.panel });
    if (step === 0) {
      const R = 112 * S, rs = [R, R * 0.86, R * 0.72, R * 0.58, R * 0.42], cols = [col.s[2], col.s[4], col.soft, col.s[3], col.s[5]];
      rs.forEach((r, i) => circ(cx - 40 * S, cy, r, cols[i], col.ink, 1));
      for (let i = 0; i < 14; i++) { const a = i * 0.9, d = (i % 3) * 8 * S + 4; dot(ctx, cx - 40 * S + Math.cos(a) * d, cy + Math.sin(a) * d, 5 * S, col.panel, col.ink); }
      [['epidermis', R, 0], ['endothecium', R * 0.86, 1], ['middle layers', R * 0.72, 2], ['tapetum (feeds the pollen)', R * 0.58, 3], ['sporogenous tissue', R * 0.2, 4]].forEach(([s, r, i]) => {
        const ly = cy - 56 * S + i * 28 * S, tx = cx - 40 * S + (i === 4 ? 0 : r * 0.7), ty = cy + (i === 4 ? 0 : -r * 0.7);
        const lx = cx + 82 * S; line(ctx, [[tx, ty], [lx - 4, ly]], col.muted, 1); lab(s, lx, ly, 'left', col.ink, 10.5);
      });
      lab('anther lobe in cross-section: 4 such sacs per anther', cx, h - 14, 'center', col.muted, 10.5, 400);
    }
    if (step === 1) {
      const pts = [[-70, -50], [0, -62], [70, -50], [-85, 5], [-30, 0], [30, 0], [85, 5], [-70, 55], [0, 62], [70, 55]];
      pts.forEach(([x, y], i) => { circ(cx + x * S, cy + y * S, 24 * S, i === 4 ? col.s[3] : col.s[5], col.ink); circ(cx + x * S, cy + y * S, 8 * S, col.panel, col.ink, 1); });
      lab('2n', cx - 30 * S, cy, 'center', col.ink, 12, 700);
      arrow(ctx, cx + 20 * S, top + 26, cx - 22 * S, cy - 12 * S, col.s[3], 2, 7);
      lab('pollen mother cell (PMC), 2n = 24', cx + 28 * S, top + 24, 'left', col.s[3], 11.5, 700);
      lab('Many PMCs, each ready for meiosis', cx, h - 14, 'center', col.muted, 10.5, 400);
    }
    if (step === 2) {
      circ(cx - 105 * S, cy, 34 * S, col.s[3], col.ink); circ(cx - 105 * S, cy, 11 * S, col.panel, col.ink, 1);
      lab('PMC', cx - 105 * S, cy + 52 * S); lab('2n = 24', cx - 105 * S, cy + 66 * S, 'center', col.muted, 10.5, 400);
      arrow(ctx, cx - 62 * S, cy, cx - 8 * S, cy, col.ink, 2.5, 9); lab('meiosis', cx - 35 * S, cy - 14 * S, 'center', col.muted, 10.5, 400);
      [[0, -26], [0, 26], [48, -26], [48, 26]].forEach(([x, y]) => { circ(cx + (46 + x) * S, cy + y * S, 22 * S, col.s[0], col.ink); circ(cx + (46 + x) * S, cy + y * S, 7 * S, col.panel, col.ink, 1); });
      lab('tetrad: 4 microspores', cx + 70 * S, cy - 70 * S); lab('each n = 12', cx + 70 * S, cy - 56 * S, 'center', col.muted, 10.5, 400);
      lab('Each microspore becomes one pollen grain: 4 grains per PMC.', cx, h - 14, 'center', col.s[3], 10.5, 700);
    }
    if (step >= 3) {
      const gx = step === 3 ? cx : cx - 60 * S, gy = cy, r = 78 * S;
      circ(gx, gy, r, col.s[4], col.ink, 4 * S); for (let i = 0; i < 28; i++) { const a = i / 28 * 6.283; dot(ctx, gx + Math.cos(a) * (r + 3), gy + Math.sin(a) * (r + 3), 2.2, col.ink); }
      circ(gx, gy, r - 8 * S, col.soft, col.ink, 1);
      if (step === 3) {
        circ(gx - 16 * S, gy + 18 * S, 30 * S, col.panel, col.muted, 1); circ(gx - 16 * S, gy + 18 * S, 10 * S, col.s[1], col.ink, 1);
        ctx.beginPath(); ctx.ellipse(gx + 30 * S, gy - 20 * S, 25 * S, 11 * S, -0.5, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.stroke();
        lab('vegetative cell (big: food store, tube nucleus)', gx, gy + r + 16, 'center', col.ink, 10.5); line(ctx, [[gx + 30 * S, gy - 28 * S], [gx + 30 * S, gy - r - 20]], col.muted, 1); lab('generative cell (small, n)', gx + 30 * S, gy - r - 28, 'center', col.s[3], 10.5, 700);
        lab('outer wall exine (hard), inner wall intine (thin)', gx, gy - r - 12, 'center', col.muted, 10, 400);
      } else {
        ctx.beginPath(); ctx.moveTo(gx + r * 0.8, gy - 8 * S); ctx.quadraticCurveTo(cx + 60 * S, gy - 30 * S, w - 20, gy - 10 * S); ctx.lineTo(w - 20, gy + 16 * S); ctx.quadraticCurveTo(cx + 60 * S, gy + 0, gx + r * 0.8, gy + 18 * S); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
        circ(gx, gy + 14 * S, 12 * S, col.s[1], col.ink, 1); lab('tube nucleus', gx, gy + 40 * S, 'center', col.muted, 10.5, 400);
        circ(cx + 70 * S, gy + 3 * S, 8 * S, col.s[3], col.ink, 1); circ(cx + 104 * S, gy + 3 * S, 8 * S, col.s[3], col.ink, 1);
        lab('2 male gametes (n)', cx + 90 * S, gy - 46 * S, 'center', col.s[3], 11, 700);
        lab('The generative cell divides by mitosis, in the grain or in the pollen tube.', cx, h - 14, 'center', col.muted, 10.5, 400);
      }
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
