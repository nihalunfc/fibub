// Class 11 Biology, Neural control: how the eye focuses (accommodation). The cornea and lens bend light to a sharp image on the retina. For a distant object the ciliary muscle relaxes,
// the suspensory ligaments pull tight and the lens is thin; for a near object the ciliary muscle contracts, the ligaments slacken and the lens bulges, bending light more.
import { canvas, text, title, line, row, choice, readout } from '../../kit.js';

export default function (host) {
  let obj = 'far', acc = true;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'An eye with light rays from a far or near object; the lens thickness changes so rays meet on the retina' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Look at', [['far', 'Far object'], ['near', 'Near object']], obj, (v) => { obj = v; go(); });
  choice(ctl, 'Lens adjusts', [[true, 'On'], [false, 'Off']], acc, (v) => { acc = v; go(); });
  const go = () => { ro.textContent = obj === 'far' ? 'Far object: the ciliary muscle is relaxed, the ligaments tight, the lens thin. Rays arrive almost parallel and meet on the retina.' : acc ? 'Near object: the ciliary muscle contracts, the ligaments loosen, the lens bulges. The rays, which spread out as they arrive, are bent more and meet on the retina.' : 'Near object with the lens unable to bulge (as with age, a condition called presbyopia): the rays would meet behind the retina, so the image is blurred.'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, obj === 'far' ? 'Looking far: thin lens' : acc ? 'Looking near: thick lens' : 'Near, lens fixed: blurred', col), cy = t0 + (h - t0) * 0.45, ex = w * 0.34, ew = w * 0.54, eh = Math.min(86, (h - t0) * 0.32), retX = ex + ew;
    ctx.beginPath(); ctx.ellipse(ex + ew / 2, cy, ew / 2, eh, 0, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(ex + ew / 2, cy, ew / 2, eh, 0, -1.0, 1.0); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 4; ctx.stroke(); text(ctx, 'retina', retX + 2, cy - eh - 10, { color: col.s[3], size: 10, weight: 700, align: 'right' });
    const lx = ex + ew * 0.22, thick = obj === 'near' && acc ? 20 : 9; ctx.beginPath(); ctx.ellipse(lx, cy, thick, eh * 0.55, 0, 0, 7); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.65; ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(ex + 4, cy, 6, 0, 7); ctx.strokeStyle = col.muted; ctx.stroke(); text(ctx, 'cornea', ex - 4, cy + eh + 14, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'lens', lx, cy + eh * 0.6 + 14, { color: col.s[0], size: 10, weight: 700, align: 'center' });
    line(ctx, [[lx, cy - eh * 0.55], [lx + 6, cy - eh * 0.95]], col.muted, 2); line(ctx, [[lx, cy + eh * 0.55], [lx + 6, cy + eh * 0.95]], col.muted, 2); text(ctx, 'ciliary muscle', lx + 6, cy - eh - 10, { color: col.muted, size: 9.5, align: 'left' });
    const fx = obj === 'far' || acc ? retX : retX + 30;
    [-1, -0.45, 0.45, 1].forEach((u) => { const ys = obj === 'far' ? cy + u * 30 : cy + u * 12, xs = obj === 'far' ? 8 : 20, yl = cy + u * eh * 0.42; line(ctx, [[xs, ys], [lx, yl], [fx, cy]], col.s[2], 1.8); });
    text(ctx, obj === 'far' ? 'distant tree' : 'book', 8, cy - 46, { color: col.ink, size: 10.5, weight: 700 });
    if (fx > retX) text(ctx, "focus behind retina", w - 8, cy + eh + 14, { color: col.bad ?? col.s[3], size: 10, weight: 700, align: 'right' });
  };
  go();
}
