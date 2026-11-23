// Class 11 Biology, Respiration in Plants: the respiratory quotient RQ = volume of CO2 released / volume of O2 used. Carbohydrates give 1; fats, which have little oxygen, need more O2 so RQ about 0.7;
// proteins about 0.9; organic acids (little carbon-bound H) give RQ above 1; anaerobic respiration releases CO2 without using O2 (RQ infinite).
import { canvas, text, title, axes, row, choice, readout } from '../../kit.js';

export default function (host) {
  let k = 'carb';
  const D = { carb: ['Carbohydrate (glucose)', 'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O', 6, 6, 'RQ = 6 ÷ 6 = 1'], fat: ['Fat (tripalmitin)', '2 C₅₁H₉₈O₆ + 145 O₂ → 102 CO₂ + 98 H₂O', 145, 102, 'RQ = 102 ÷ 145 ≈ 0.7'], prot: ['Protein', 'about 0.9 (a mixture)', 10, 9, 'RQ ≈ 0.9'], acid: ['Oxalic acid', '2 C₂H₂O₄ + O₂ → 4 CO₂ + 2 H₂O', 1, 4, 'RQ = 4 ÷ 1 = 4'], an: ['Anaerobic (yeast)', 'C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂', 0, 2, 'O₂ used = 0: RQ is infinite'] };
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Bars of oxygen used and carbon dioxide released for different respiratory substrates, giving the respiratory quotient' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Substrate', [['carb', 'Sugar'], ['fat', 'Fat'], ['prot', 'Protein'], ['acid', 'Organic acid'], ['an', 'No O₂']], k, (v) => { k = v; go(); });
  const go = () => { const d = D[k]; ro.textContent = `${d[0]}: ${d[1]}. ${d[4]}. ${{ carb: 'Equal volumes of CO₂ and O₂.', fat: 'Fat has little oxygen in it, so more O₂ is needed to burn it: the CO₂ bar is shorter than the O₂ bar.', prot: 'Between sugar and fat.', acid: 'Organic acids already hold a lot of oxygen, so little O₂ is needed.', an: 'CO₂ without O₂: seeds soaked in water or fruits in a closed jar can show this.' }[k]}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const d = D[k], t0 = title(ctx, `RQ for ${d[0]}`, col), sc = 10 / Math.max(d[2], d[3], 1) , mx = 10;
    const A = axes(ctx, w, h, col, { x: [0, 2], y: [0, mx], xlabel: '', ylabel: 'relative volume (scaled)', l: 50, t: t0 + 10, b: 40, xt: [], yt: [0, 5, 10] });
    const bw = (A.R - A.L) * 0.28, xs = [A.L + (A.R - A.L) * 0.17, A.L + (A.R - A.L) * 0.55];
    [['O₂ used', d[2], col.s[0]], ['CO₂ released', d[3], col.s[3]]].forEach(([n, v, c], i) => { const y = A.Y(v * sc); ctx.fillStyle = c; ctx.fillRect(xs[i], y, bw, A.B - y); text(ctx, n, xs[i] + bw / 2, A.B + 14, { color: col.ink, size: 11, weight: 600, align: 'center' }); text(ctx, String(v), xs[i] + bw / 2, y - 9, { color: col.ink, size: 11, weight: 700, align: 'center' }); });
    text(ctx, d[2] ? 'RQ = ' + +(d[3] / d[2]).toFixed(2) : 'RQ = ∞', A.R - 8, A.T + 12, { color: col.ink, size: 14, weight: 700, align: 'right' });
  };
  go();
}
