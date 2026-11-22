// Class 12 Biology, Principles of Inheritance and Variation: sickle-cell anaemia, an autosomal recessive disorder caused by one base change in the beta-globin gene
// (GAG -> GTG) which swaps glutamic acid for valine at position 6. Genotypes: HbA/HbA normal; HbA/HbS carrier (sickle-cell trait, mostly healthy);
// HbS/HbS disease. In low oxygen HbS red cells bend into sickles. Carriers are also partly protected against severe malaria. Cell pictures are schematic.
import { canvas, text, title, row, choice, slider, readout } from '../../kit.js';

export default function (host) {
  let gt = 'AA', o2 = 100;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Red blood cells drawn as discs or sickles depending on genotype and oxygen level, with the DNA change shown' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Genotype', [['AA', 'HbA/HbA'], ['AS', 'HbA/HbS'], ['SS', 'HbS/HbS']], 'AA', (v) => { gt = v; go(); });
  slider(ctl, { label: 'oxygen level', min: 20, max: 100, step: 5, value: 100, fmt: (v) => `${Math.round(v)} %`, oninput: (v) => { o2 = Math.round(v); go(); } });
  const frac = () => (gt === 'AA' ? 0 : gt === 'AS' ? Math.max(0, (35 - o2) / 15) * 0.4 : Math.min(1, Math.max(0, (100 - o2) / 55)));
  const go = () => { const f = Math.round(frac() * 100); ro.textContent = { AA: 'Normal haemoglobin: round, flexible discs that squeeze through capillaries at any oxygen level.', AS: 'Carrier (sickle-cell trait): half the haemoglobin is HbS. Cells sickle only in very low oxygen, so people are usually healthy, and the trait gives some protection against severe malaria.', SS: 'Sickle-cell anaemia: HbS haemoglobin clumps when oxygen is low, bending cells into sickles that block small vessels and break down early, causing anaemia and pain.' }[gt] + ` At ${o2} % oxygen about ${f} % of cells are sickled in this picture.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Sickle-cell: one letter of DNA', col) + 4, ink = col.ink;
    text(ctx, 'normal gene  …GAG… → glutamic acid (Glu)', 10, top + 10, { color: col.s[2], size: 11, weight: 700 });
    text(ctx, 'sickle gene  …GTG… → valine (Val)', 10, top + 28, { color: col.bad, size: 11, weight: 700 });
    text(ctx, '6th amino acid of the β-globin chain changes', 10, top + 44, { color: col.muted, size: 10.5 });
    const cols = 6, rows = 4, gy = top + 62, cw = (w - 20) / cols, ch = (h - gy - 12) / rows, f = frac(), n = cols * rows, nS = Math.round(f * n);
    for (let i = 0; i < n; i++) {
      const x = 10 + (i % cols) * cw + cw / 2, y = gy + Math.floor(i / cols) * ch + ch / 2, order = (i * 7) % n, sick = order < nS;
      ctx.save(); ctx.translate(x, y); ctx.rotate(((i * 37) % 60) / 60 * 3.14);
      if (sick) { ctx.beginPath(); ctx.moveTo(-cw * 0.34, 0); ctx.quadraticCurveTo(0, -ch * 0.5, cw * 0.34, 0); ctx.quadraticCurveTo(0, -ch * 0.1, -cw * 0.34, 0); ctx.fillStyle = col.bad; ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.stroke(); }
      else { ctx.beginPath(); ctx.ellipse(0, 0, Math.min(cw, ch) * 0.34, Math.min(cw, ch) * 0.34, 0, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 0, Math.min(cw, ch) * 0.13, Math.min(cw, ch) * 0.13, 0, 0, 7); ctx.fillStyle = col.panel; ctx.globalAlpha = 0.6; ctx.fill(); ctx.globalAlpha = 1; }
      ctx.restore();
    }
  };
  go();
}
