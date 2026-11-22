// Class 12 Microbes in Human Welfare (step player): how microbes turn waste into biogas in four stages: hydrolysis of big molecules, acid formation, acetate formation, and methane formation by methanogens
// (Methanobacterium). The whole chain happens without oxygen in the digester or the rumen of cattle, where the same bacteria live.
import { canvas, text, title, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 290, label: 'Four stages of anaerobic digestion from cellulose and protein in dung to methane' });
  const T = ['1. Hydrolysis', '2. Acid formation', '3. Acetate formation', '4. Methane formation'];
  const NOTE = ['Anaerobic bacteria use enzymes to break the large molecules in dung (cellulose, protein, fat) into small ones: sugars, amino acids and fatty acids.', 'Other bacteria ferment these small molecules into organic acids (such as propionic and butyric acid), alcohols, CO₂ and H₂.', 'The acids are turned into acetic acid (acetate), more H₂ and CO₂.', 'Methanogens, such as Methanobacterium, make methane from acetate, or from CO₂ and H₂. The gas is biogas, mostly CH₄ with CO₂.'];
  const BOX = [['cellulose, protein, fat', 'big molecules'], ['sugars, amino acids', 'small molecules'], ['organic acids, H₂, CO₂', 'fermentation products'], ['acetate, H₂, CO₂', 'ready for methane'], ['CH₄ + CO₂', 'biogas']];
  const WHO = ['hydrolytic bacteria', 'acid-forming bacteria', 'acetate-forming bacteria', 'methanogens (Methanobacterium)'];
  const wrap = (ctx, s, x, y, wd, col) => { let l = '', yy = y; s.split(' ').forEach((word) => { const t = l ? l + ' ' + word : word; ctx.font = '11px system-ui'; if (ctx.measureText(t).width > wd && l) { text(ctx, l, x, yy, { color: col.ink, size: 11 }); yy += 14; l = word; } else l = t; }); text(ctx, l, x, yy, { color: col.ink, size: 11 }); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[step], col), bw = w - 120, bx = 20, bh = 30, gap = 13, y0 = t0 + 14;
    BOX.forEach(([a, b], i) => {
      const y = y0 + i * (bh + gap), on = i === step || i === step + 1, cur = i <= step + 1;
      ctx.globalAlpha = cur ? 1 : 0.35; ctx.fillStyle = i === step || i === step + 1 ? col.soft : col.panel; ctx.fillRect(bx, y, bw, bh); ctx.strokeStyle = on ? col.s[0] : col.line; ctx.lineWidth = on ? 2.5 : 1.5; ctx.strokeRect(bx, y, bw, bh);
      text(ctx, a, bx + 8, y + 11, { color: col.ink, size: 11.5, weight: 700 }); text(ctx, b, bx + 8, y + 23, { color: col.muted, size: 10 }); ctx.globalAlpha = 1;
      if (i < 4) { const act = i === step; arrow(ctx, bx + bw / 2, y + bh + 1, bx + bw / 2, y + bh + gap - 1, act ? col.s[3] : col.line, act ? 3 : 1.5, 7); if (act) text(ctx, WHO[i], bx + bw / 2 + 12, y + bh + gap / 2, { color: col.s[3], size: 10.5, weight: 700 }); }
    });
    text(ctx, 'no oxygen needed', w - 8, y0 + 8, { color: col.muted, size: 10, align: 'right' });
    wrap(ctx, NOTE[step], 12, h - 62, w - 24, col);
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 3); cv.redraw(); } };
}
