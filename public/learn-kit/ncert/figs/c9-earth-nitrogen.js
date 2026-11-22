// Class 9 Earth as a system (step player): the nitrogen cycle. Air is 78% N2, but plants cannot use N2. Fixation
// (lightning, Rhizobium bacteria in root nodules, and the fertiliser factory) makes nitrates and ammonia; plants take
// them up and build proteins; animals eat plants; dead matter and waste are broken down by decomposers into ammonia;
// soil bacteria turn it to nitrate (nitrification); denitrifying bacteria return N2 to the air.
// Steps: N2 in air, fixation, plants take up, animals eat, decomposers, back to the air.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 300, label: 'The nitrogen cycle between air, soil bacteria, plants, animals and decomposers' });
  const TT = ['Air is 78% nitrogen, but plants cannot use it', 'Fixing: nitrogen gas becomes nitrate', 'Plants take nitrate and build proteins', 'Animals get nitrogen by eating', 'Decomposers return it to the soil', 'Denitrifying bacteria send N₂ back to the air'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col) + 6;
    const bw = Math.min(112, w * 0.3);
    const box = (x, y, s, c, on) => { ctx.save(); ctx.globalAlpha = on ? 1 : 0.35; const bh = 28; ctx.fillStyle = col.panel; ctx.strokeStyle = c; ctx.lineWidth = on ? 3 : 1.5; ctx.fillRect(x - bw / 2, y - bh / 2, bw, bh); ctx.strokeRect(x - bw / 2, y - bh / 2, bw, bh); ctx.restore(); text(ctx, s, x, y, { color: col.ink, size: 10, weight: 700, align: 'center' }); return [x, y]; };
    const yA = top + 24, yM = top + (h - top) * 0.45, yB = h - 26;
    const air = box(w * 0.5, yA, 'Air: N₂ gas', col.s[0], step === 0 || step === 5);
    const soil = box(w * 0.16, yM, 'Nitrate in soil', col.s[2], step === 1 || step === 2 || step === 4);
    const plant = box(w * 0.5, yM, 'Plants: protein', col.s[3], step === 2 || step === 3);
    const animal = box(w * 0.5, yB, 'Animals', col.s[4], step === 3 || step === 4);
    const dec = box(w * 0.16, yB, 'Decomposers', col.s[5], step === 4);
    const bac = box(w * 0.84, yB, 'Denitrifying bacteria', col.s[1], step === 5);
    const flow = (a, b, c, on, lab, off = [0, 0]) => {
      if (!on) return;
      const x0 = a[0], y0 = a[1], x1 = b[0], y1 = b[1];
      line(ctx, [[x0, y0], [x1, y1]], c, 1.5, [4, 4]);
      for (let k = 0; k < 4; k++) { const p = ((t * 0.3 + k / 4) % 1); dot(ctx, x0 + (x1 - x0) * p, y0 + (y1 - y0) * p, 3.4, c); }
      text(ctx, lab, (x0 + x1) / 2 + off[0], (y0 + y1) / 2 + off[1], { color: c, size: 10, weight: 700, halo: col.panel, align: 'center' });
    };
    flow([air[0] - bw / 2, air[1]], [soil[0] + 6, soil[1] - 14], col.s[2], step === 1, 'lightning, root bacteria, factory', [30, -16]);
    flow([soil[0] + bw / 2, soil[1]], [plant[0] - bw / 2, plant[1]], col.s[3], step === 2, 'roots absorb', [0, -10]);
    flow([plant[0], plant[1] + 14], [animal[0], animal[1] - 14], col.s[4], step === 3, 'eaten', [24, 0]);
    flow([animal[0] - bw / 2, animal[1]], [dec[0] + bw / 2, dec[1]], col.s[5], step === 4, 'waste, dead bodies', [0, -10]);
    flow([dec[0], dec[1] - 14], [soil[0], soil[1] + 14], col.s[2], step === 4, 'ammonia, then nitrate', [-4, 0]);
    flow([soil[0] + bw / 2, soil[1] + 8], [bac[0] - bw / 2 + 6, bac[1] - 14], col.s[1], step === 5, 'nitrate', [0, 14]);
    flow([bac[0], bac[1] - 14], [air[0] + bw / 2, air[1]], col.s[0], step === 5, 'N₂ gas released', [28, 0]);
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
