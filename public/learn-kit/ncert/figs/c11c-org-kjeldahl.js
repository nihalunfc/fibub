// Class 11 Chemistry, Organic Chemistry basics (step player): the Kjeldahl method for nitrogen. Digest with hot conc. H2SO4 (N -> (NH4)2SO4); make alkaline with NaOH and distil the NH3 into a measured
// excess of standard H2SO4; titrate the unused acid. % N = 1.4 x (normality x mL of acid used up) / mass of sample. Does not work for nitro, azo compounds or N in a ring (pyridine).
import { canvas, text, title } from '../../kit.js';

const S = [
  ['1. Digest the sample with hot concentrated H₂SO₄', ['N in the compound → (NH₄)₂SO₄', 'K₂SO₄ raises the boiling point; CuSO₄ is the catalyst'], 'digest'],
  ['2. Add excess NaOH and distil', ['(NH₄)₂SO₄ + 2NaOH → Na₂SO₄ + 2NH₃ + 2H₂O', 'ammonia gas is driven over by heating'], 'distil'],
  ['3. Pass the NH₃ into a measured volume of standard H₂SO₄', ['2NH₃ + H₂SO₄ → (NH₄)₂SO₄', 'only part of the acid is used up'], 'trap'],
  ['4. Titrate the unused acid with standard NaOH', ['acid used up by NH₃ = acid taken − acid left', 'each mol of NH₃ held one N atom'], 'titrate'],
  ['5. Work out % N', ['% N = 1.4 × N × V ÷ m', 'N = normality of acid, V = mL used up, m = g of sample'], 'calc'],
];
export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'The four stages of the Kjeldahl method for nitrogen' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, S[st][0], col) + 14, cy = top + 66, bx = (x, y, bw, bh, fill, lab) => { ctx.fillStyle = fill; ctx.globalAlpha = 0.35; ctx.fillRect(x, y + bh * 0.4, bw, bh * 0.6); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x, y, bw, bh); text(ctx, lab, x + bw / 2, y + bh + 14, { color: col.muted, size: 10, align: 'center' }); };
    const k = S[st][2];
    if (k === 'digest') { bx(w * 0.3, cy - 20, w * 0.4, 70, col.s[3], 'Kjeldahl flask'); text(ctx, '🔥', w / 2, cy + 70, { size: 18, align: 'center', color: col.ink }); }
    if (k === 'distil') { bx(w * 0.12, cy - 20, w * 0.3, 70, col.s[3], 'flask + NaOH'); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(w * 0.42, cy - 8); ctx.lineTo(w * 0.58, cy - 8); ctx.stroke(); bx(w * 0.58, cy - 20, w * 0.3, 70, col.s[0], 'standard H₂SO₄'); text(ctx, 'NH₃ →', w / 2, cy - 22, { color: col.s[2], size: 11, weight: 700, align: 'center' }); }
    if (k === 'trap') { bx(w * 0.3, cy - 20, w * 0.4, 70, col.s[0], 'acid + NH₃ absorbed'); text(ctx, 'NH₃', w / 2, cy - 30, { color: col.s[2], size: 12, weight: 700, align: 'center' }); }
    if (k === 'titrate') { bx(w * 0.34, cy, w * 0.32, 56, col.s[4], 'unused acid'); ctx.strokeStyle = col.ink; ctx.strokeRect(w * 0.48, cy - 52, 18, 46); text(ctx, 'NaOH', w * 0.57, cy - 28, { color: col.ink, size: 10, weight: 700 }); }
    if (k === 'calc') { text(ctx, '% N = 1.4 N V / m', w / 2, cy, { color: col.ink, size: 20, weight: 700, align: 'center' }); }
    S[st][1].forEach((l, i) => text(ctx, l, 14, cy + 90 + i * 22, { color: col.ink, size: 11.5, weight: i ? 400 : 700 }));
    text(ctx, `step ${st + 1} of ${S.length}`, w - 12, h - 12, { color: col.muted, size: 10.5, align: 'right' });
  };
  return { step(i) { st = Math.min(i, S.length - 1); cv.redraw(); } };
}
