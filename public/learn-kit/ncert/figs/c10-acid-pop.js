// Class 10 Acids, Bases and Salts (step player): plaster of Paris. Gypsum CaSO4.2H2O heated at 373 K (100 degC) loses
// three-quarters of its water: CaSO4.1/2H2O (POP). Mixed with water it sets back into hard gypsum.
// Each calcium sulphate unit is a box; blue drops are water of crystallisation. Overheating drives all water off.
import { canvas, text, title, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 300, label: 'Calcium sulphate crystals with water molecules being lost and regained' });
  const TITLES = ['Gypsum: CaSO₄·2H₂O', 'Heat gently at 373 K (100 °C)', 'Plaster of Paris: CaSO₄·½H₂O', 'Mix with water: a paste', 'It sets: gypsum again', 'Do not overheat'];
  // water per CaSO4 unit (4 units shown): shown as an array per step
  const W = [[2, 2, 2, 2], [2, 2, 2, 2], [0.5, 0.5, 0.5, 0.5], [0.5, 0.5, 0.5, 0.5], [2, 2, 2, 2], [0, 0, 0, 0]];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 8;
    const cw = Math.min(70, w / 5.4), gap = (w - 4 * cw) / 5, y0 = top + 34;
    W[step].forEach((n, i) => {
      const x = gap + i * (cw + gap), warm = step === 1 ? 0.5 + 0.5 * Math.sin(t * 6 + i) : 0;
      ctx.fillStyle = col.soft; ctx.fillRect(x, y0, cw, 52); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x, y0, cw, 52);
      text(ctx, 'CaSO₄', x + cw / 2, y0 + 16, { color: col.ink, size: 12, weight: 700, align: 'center' });
      const k = step === 1 ? (2 - 1.5 * Math.min(1, t / 3)) : n;
      const nd = Math.round(k * 2) / 2;
      for (let d = 0; d < Math.ceil(nd); d++) { const half = nd - d < 1; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(x + cw * (0.3 + 0.4 * d), y0 + 38 + Math.sin(t * 3 + d) * 1.5, half ? 4 : 7, 0, 7); ctx.fill(); }
      if (step === 1 && t % 1.2 < 0.6) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(x + cw * 0.5, y0 - 8 - ((t % 1.2) / 0.6) * 22, 3, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
      if (warm > 0.8) { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.strokeRect(x - 2, y0 - 2, cw + 4, 56); }
    });
    const lab = ['2 water molecules for each CaSO₄ (shown as blue drops): the water of crystallisation.', 'At 100 °C, 1½ water molecules per unit are driven off as steam.', 'Two units share one water: (CaSO₄)₂·H₂O, written CaSO₄·½H₂O. A fine white powder.', 'Add water and stir: a thick paste that you can pour into a mould.', 'The paste takes up 1½ water per unit again and the crystals interlock into a hard solid.', 'Above about 200 °C all water is lost: anhydrous CaSO₄ will not set properly.'][step];
    text(ctx, lab, w / 2, y0 + 82, { color: col.ink, size: 11, align: 'center' });
    const use = ['Gypsum is a natural mineral, mined in Rajasthan.', 'Furnace or kiln, kept near 373 K.', 'Keep it dry in sealed bags: damp air sets it.', 'Pour it into a mould or on a broken limb.', 'Used for plaster casts, toys, statues, smooth ceilings, fireproofing.', 'This is why kilns for POP are carefully controlled.'][step];
    text(ctx, use, w / 2, h - 18, { color: col.muted, size: 10.5, align: 'center' });
    const eq = ['CaSO₄·2H₂O', 'CaSO₄·2H₂O → CaSO₄·½H₂O + 1½H₂O', 'CaSO₄·½H₂O', 'CaSO₄·½H₂O + 1½H₂O → paste', 'CaSO₄·½H₂O + 1½H₂O → CaSO₄·2H₂O', 'CaSO₄·½H₂O → CaSO₄ + ½H₂O'][step];
    text(ctx, eq, w / 2, y0 + 120, { color: col.s[2], size: 12.5, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
