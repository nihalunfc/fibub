// Class 12 Chemistry, Solutions: the van't Hoff factor i = (observed colligative effect) / (calculated with no dissociation or association) = particles actually present / formula units dissolved.
// Dissociation (NaCl into 2 ions, K2SO4 into 3): i = 1 + (n - 1) alpha. Association (ethanoic acid pairs into dimers in benzene): i = 1 - alpha/2. Glucose does neither: i = 1.
// Twelve formula units are drawn; the slider sets the fraction that has split or paired up. The colligative effect (here the freezing-point depression of a 0.100 m water solution, Kf = 1.86) rises with i.
import { canvas, text, title, row, slider, choice, readout, loop, rng } from '../../kit.js';

const KIND = { nacl: ['NaCl', 2, 'dissociates'], k2so4: ['K₂SO₄', 3, 'dissociates'], glu: ['glucose', 1, 'none'], acid: ['CH₃COOH in benzene', 2, 'associates'] };
export default function (host) {
  let k = 'nacl', a = 0.9, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Twelve formula units splitting into ions or pairing into dimers with the van t Hoff factor shown' });
  const ctl = row(host), ro = readout(host), R = rng(11);
  choice(ctl, 'solute', [['nacl', 'NaCl'], ['k2so4', 'K₂SO₄'], ['glu', 'glucose'], ['acid', 'ethanoic acid in benzene']], k, (v) => { k = v; go(); });
  slider(ctl, { label: 'degree of dissociation or association α', min: 0, max: 1, step: 0.05, value: a, fmt: (v) => v.toFixed(2), oninput: (v) => { a = v; go(); } });
  const ph = Array.from({ length: 12 }, () => R() * 6.28);
  const iVal = () => (KIND[k][2] === 'dissociates' ? 1 + (KIND[k][1] - 1) * a : KIND[k][2] === 'associates' ? 1 - a / 2 : 1);
  const go = () => { const i = iVal(); ro.textContent = `${KIND[k][0]}: i = ${i.toFixed(2)}. For 12 units dissolved there are ${(12 * i).toFixed(1)} particles. A 0.100 m aqueous solution would freeze ${(i * 0.186).toFixed(3)} K below 0 °C (instead of ${(0.186).toFixed(3)} K if i were 1).`; };
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `${KIND[k][0]}: ${KIND[k][2] === 'none' ? 'stays whole' : KIND[k][2]}`, col) + 14, cols = 4, cw = (w - 40) / cols, rh = 62, nsp = Math.round(a * 12);
    for (let u = 0; u < 12; u++) {
      const cx = 20 + cw * (u % cols + 0.5), cy = t0 + 30 + rh * Math.floor(u / cols), wob = Math.sin(t * 2 + ph[u]) * 2, split = u < nsp;
      const c = (x, y, r, f) => { ctx.beginPath(); ctx.arc(x + wob, y, r, 0, 7); ctx.fillStyle = f; ctx.fill(); };
      const kind = KIND[k][2];
      if (kind === 'none') { c(cx - 7, cy, 10, col.s[0]); c(cx + 8, cy, 7, col.s[2]); }
      else if (kind === 'dissociates' && !split) { c(cx - 8, cy, 11, col.s[0]); c(cx + 8, cy, 8, col.s[2]); if (KIND[k][1] === 3) c(cx + 20, cy, 8, col.s[0]); }
      else if (kind === 'dissociates') { const sp = 12 + (1 - 0) * 0; c(cx - sp - 4, cy - 9, 11, col.s[0]); c(cx + sp - 4, cy + 9, 8, col.s[2]); if (KIND[k][1] === 3) c(cx + sp + 12, cy - 9, 8, col.s[0]); }
      else if (kind === 'associates') { if (!split) { c(cx - 6, cy, 11, col.s[3]); } else if (u % 2 === 0) { c(cx - 8, cy, 11, col.s[3]); c(cx + 9, cy, 11, col.s[3]); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - 1 + wob, cy); ctx.lineTo(cx + 1 + wob, cy); ctx.stroke(); } }
    }
    const i = iVal(), by = t0 + 30 + rh * 3 + 4;
    text(ctx, `i = ${i.toFixed(2)}`, w / 2, by + 6, { color: col.s[3], size: 18, weight: 700, align: 'center' });
    const f = KIND[k][2] === 'dissociates' ? `i = 1 + (n − 1)α = 1 + ${KIND[k][1] - 1} × ${a.toFixed(2)}` : KIND[k][2] === 'associates' ? `i = 1 − α/2 = 1 − ${a.toFixed(2)}/2` : 'i = 1 (no change in particle number)';
    text(ctx, f, w / 2, by + 28, { color: col.muted, size: 11.5, align: 'center' });
  };
  go();
}
