// The Calvin cycle as a step player, counting carbon atoms for three turns: 3 CO₂ are fixed by RuBisCO onto 3 RuBP,
// the 6 PGA are reduced with ATP and NADPH to 6 G3P, one G3P leaves as the net gain, and 5 G3P rebuild 3 RuBP.
// Each dot is one carbon atom, so you can check that nothing is lost.
import { text, title } from '../kit.js';
import { stepper, wrap } from './_bio-kit.js';

const STAGES = [
  { n: '1. Carbon fixation (RuBisCO)', mol: [[3, 5, 'RuBP'], [3, 1, 'CO₂']], tot: '18 C', use: 'RuBisCO', cap: '3 RuBP (5 C) + 3 CO₂ (1 C). RuBisCO adds CO₂ to RuBP; the 6-carbon product splits at once.' },
  { n: '1. Carbon fixation (RuBisCO)', mol: [[6, 3, 'PGA']], tot: '18 C', use: 'RuBisCO, then the 6 C product splits', cap: 'Result: 6 molecules of 3-phosphoglycerate (PGA, 3 C). This is the first stable product, so plants using it are called C3 plants.' },
  { n: '2. Reduction', mol: [[6, 3, 'G3P']], tot: '18 C', use: 'uses 6 ATP + 6 NADPH', cap: '6 ATP and 6 NADPH (from the light reactions) turn 6 PGA into 6 glyceraldehyde-3-phosphate (G3P, 3 C).' },
  { n: '2. Reduction: one G3P leaves', mol: [[5, 3, 'G3P stay'], [1, 3, 'G3P leaves']], tot: '15 C stay, 3 C leave', use: 'net gain: 1 G3P', cap: 'One G3P is the net gain; it goes on to make glucose, sucrose and starch. 5 G3P remain in the cycle.' },
  { n: '3. Regeneration of RuBP', mol: [[3, 5, 'RuBP']], tot: '15 C', use: 'uses 3 ATP', cap: '3 more ATP rearrange 5 G3P (15 C) into 3 RuBP (15 C). The cycle is ready for the next three CO₂.' },
];
const TAL = [['CO₂ fixed', '3', '3', '3', '3'], ['ATP used', '0', '0', '6', '9'], ['NADPH used', '0', '0', '6', '6']];

export default function (host) {
  return stepper(host, { aspect: 1.05, max: 430, min: 340, stages: 5, label: 'The Calvin cycle with carbon atoms counted for three turns' }, (ctx, w, h, col, st, k) => {
    const S = STAGES[st]; title(ctx, S.n, col);
    ctx.globalAlpha = 0.3 + 0.7 * k;
    let y = 60;
    const R = 3.6;
    S.mol.forEach(([n, c, name], gi) => {
      const per = Math.max(1, Math.floor((w - 24) / (c * 2 * R + 22))), rows = Math.ceil(n / per);
      text(ctx, `${n} × ${name}`, 12, y, { color: col.ink, size: 12, weight: 700 });
      y += 14;
      for (let i = 0; i < n; i++) {
        const cx = 14 + (i % per) * (c * 2 * R + 22), cy = y + Math.floor(i / per) * 26 + 8;
        ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(cx - 4, cy - 10, c * 2 * R + 8, 20, 10); ctx.stroke();
        for (let j = 0; j < c; j++) { ctx.beginPath(); ctx.arc(cx + R + j * 2 * R, cy, R, 0, 7); ctx.fillStyle = name === 'CO₂' ? col.s[5] : name.includes('leaves') ? col.s[2] : col.s[0]; ctx.fill(); }
      }
      y += rows * 26 + 14;
    });
    ctx.globalAlpha = 1;
    text(ctx, `Carbon atoms in the cycle: ${S.tot}`, 12, y + 4, { color: col.s[0], size: 12, weight: 700 });
    text(ctx, '↓ ' + S.use, 12, y + 30, { color: col.s[1], size: 13, weight: 700 });
    // tally
    const ty = h - 92;
    text(ctx, 'Running total after this step', 12, ty - 12, { color: col.muted, size: 10.5, weight: 700 });
    TAL.forEach((r, i) => { const v = r[Math.min(4, Math.max(1, st === 0 ? 1 : st === 1 ? 2 : st === 2 ? 3 : 4))]; text(ctx, `${r[0]}: ${v}`, 12 + i * (w - 24) / 3, ty + 6, { color: col.ink, size: 11.5, weight: 600, fit: false }); });
    wrap(ctx, S.cap, w / 2, h - 52, w - 24, { color: col.ink, size: 10.5, lh: 13 });
  });
}
