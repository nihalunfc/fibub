// Class 12 Electric Charges and Fields (step player): Gauss's law for an infinite plane sheet with charge sigma per unit area, using a
// cylindrical "pillbox" through the sheet. By symmetry E is perpendicular to the sheet and equal at equal distances. No flux through the curved wall,
// E.A through each flat end: 2EA = sigma A / eps0, so E = sigma / (2 eps0). The last step puts two opposite sheets together: the fields add between them (sigma/eps0) and cancel outside.
import { canvas, text, title, line, arrow, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'A cylinder-shaped Gaussian surface through a charged sheet' });
  const TITLES = ['A large flat sheet of charge, seen edge-on', 'Symmetry: E is perpendicular, same on both sides', 'Draw a cylinder (pillbox) through the sheet', 'The curved wall has no flux', 'Both flat ends have flux E·A each', 'Charge inside = σA, so E = σ/2ε₀', 'Two opposite sheets: fields add between them'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 6, cx = w / 2, half = (h - top - 110) / 2, cy = top + 32 + half;
    const two = step === 6, sx = two ? [cx - 60, cx + 60] : [cx];
    sx.forEach((x, i) => { line(ctx, [[x, cy - half], [x, cy + half]], col.ink, 4); const sg = two ? (i === 0 ? '+' : '−') : '+'; for (let k = -4; k <= 4; k++) text(ctx, sg, x + (two && i === 1 ? 0 : 0), cy + k * half / 4.6, { color: two && i === 1 ? col.s[0] : col.s[2], size: 13, weight: 700, align: 'center', halo: col.panel }); });
    const ahead = (x, y, dir, c, wd = 2) => arrow(ctx, x, y, x + dir * 46, y, c, wd, 7);
    if (step >= 1 && !two) for (const y of [cy - half * 0.8, cy + half * 0.8]) { ahead(cx + 4, y, 1, col.muted, 1.5); ahead(cx - 4, y, -1, col.muted, 1.5); }
    if (step >= 2 && !two) {
      const pw = Math.min(100, w * 0.26), ph = 56; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.setLineDash([6, 3]); ctx.strokeRect(cx - pw, cy - ph / 2, pw * 2, ph); ctx.setLineDash([]);
      text(ctx, 'area A', cx + pw - 4, cy - ph / 2 - 8, { color: col.s[3], size: 11.5, weight: 700, align: 'right' }); text(ctx, 'area A', cx - pw + 4, cy - ph / 2 - 8, { color: col.s[3], size: 11.5, weight: 700 });
      if (step >= 3) { text(ctx, 'curved wall: E ∥ wall', cx + 8, top + 4, { color: col.s[5], size: 11.5, weight: 700, align: 'center' }); text(ctx, 'flux = 0', cx + 8, top + 18, { color: col.s[5], size: 11.5, align: 'center' }); }
      if (step >= 4) { for (const [x, s] of [[cx + pw, 1], [cx - pw, -1]]) { arrow(ctx, x - s * 20, cy, x + s * 38, cy, col.s[2], 3.5, 8); } text(ctx, 'E·A', cx + pw - 8, cy + 20, { color: col.s[2], size: 12, weight: 700, align: 'right' }); text(ctx, 'E·A', cx - pw + 8, cy + 20, { color: col.s[2], size: 12, weight: 700 }); }
      if (step >= 5) { text(ctx, 'inside: charge σA', cx + 8, h - 30, { color: col.s[7], size: 12, weight: 700, align: 'center' }); text(ctx, '2EA = σA/ε₀  →  E = σ/2ε₀', cx + 8, h - 12, { color: col.s[7], size: 13, weight: 700, align: 'center' }); }
    }
    if (two) {
      for (const y of [cy - half * 0.6, cy - half * 0.2, cy + half * 0.2, cy + half * 0.6]) { arrow(ctx, sx[0] + 8, y, sx[1] - 8, y, col.s[2], 3.5, 8) }
      text(ctx, 'E = σ/ε₀ between', cx, cy, { color: col.s[2], size: 12, weight: 700, align: 'center', halo: col.panel });
      text(ctx, 'outside: E = 0', cx, h - 12, { color: col.muted, size: 12, weight: 700, align: 'center' });
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 6); cv.redraw(); } };
}
