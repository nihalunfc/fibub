// Class 10 Areas Related to Circles (step player): a combination of figures. A square tile of side 14 cm has a quarter circle
// of radius 7 cm cut from each corner. The four quarters slide together to make one full circle of radius 7 (area 154 cm²), so
// the shaded middle = square − circle = 196 − 154 = 42 cm².
import { canvas, text, title, line, loop, ease } from '../../kit.js';

export default function (host) {
  let step = 0, p = 0, tp = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A square with four corner quarter-circles that slide together into one circle' });
  loop(host, (dt) => { if (p !== tp) { p = p < tp ? Math.min(tp, p + dt * 0.8) : Math.max(tp, p - dt * 0.8); cv.redraw(); } });
  const CAP = ['A square tile of side 14 cm: area 14 × 14 = 196 cm²', 'Cut a quarter circle of radius 7 cm from each corner', 'The four quarters together make a full circle: slide them to the centre', 'Area of the circle = (22/7) × 7² = 154 cm²', 'Remaining (shaded) area = 196 − 154 = 42 cm²'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Square with corner quarter-circles', col);
    const S = Math.min(w - 60, h - 110), x0 = (w - S) / 2, y0 = 38 + (h - 110 - S) / 2 + 6, q = S / 2, e = ease(p);
    ctx.fillStyle = step >= 4 ? col.s[1] : col.soft; ctx.globalAlpha = step >= 4 ? 0.7 : 1; ctx.fillRect(x0, y0, S, S); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.strokeRect(x0, y0, S, S);
    if (step >= 1) {
      const cs = [[x0, y0, 0], [x0 + S, y0, Math.PI / 2], [x0 + S, y0 + S, Math.PI], [x0, y0 + S, 1.5 * Math.PI]];
      cs.forEach(([cx, cy, a], i) => {
        const tx = cx + ((x0 + q) - cx) * e, ty = cy + ((y0 + q) - cy) * e;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.arc(tx, ty, q, a, a + Math.PI / 2); ctx.closePath(); ctx.fillStyle = col.panel; ctx.fill();
        ctx.strokeStyle = [col.s[0], col.s[2], col.s[3], col.s[4]][i]; ctx.lineWidth = 2.5; ctx.stroke();
        if (step === 3 || step === 4) { ctx.fillStyle = [col.s[0], col.s[2], col.s[3], col.s[4]][i]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; }
      });
    }
    if (step === 0) { text(ctx, '14', w / 2, y0 + S + 14, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, '14', x0 - 8, y0 + S / 2, { color: col.ink, size: 12, weight: 700, align: 'right' }); }
    if (step === 1) text(ctx, 'r = 7', x0 + q * 0.5 + 6, y0 + q * 0.5 - 10, { color: col.ink, size: 11, weight: 700, halo: col.panel });
    if (step >= 3) text(ctx, 'circle: 154 cm²', w / 2, y0 + q, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
    if (step === 4) text(ctx, 'shaded = 42 cm²', w / 2, h - 38, { color: col.s[1], size: 14, weight: 700, align: 'center', halo: col.panel });
    text(ctx, CAP[step], w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(4, i); tp = step >= 2 ? 1 : 0; cv.redraw(); } };
}
