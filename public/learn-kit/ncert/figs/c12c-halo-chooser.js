// Class 12 Chemistry, Haloalkanes: which path will it take, SN2, SN1 or elimination (E)? Rough guide for a haloalkane with a reagent. Substitution is favoured by a good nucleophile that is a weak base,
// in water or acetone; elimination by a strong, bulky or concentrated base (alcoholic KOH, heat). Primary: SN2. Tertiary: SN1 (SN2 is blocked) or E. Secondary: a mixture.
// The bars are relative likelihoods (rule of thumb, not exact yields).
import { canvas, text, title, row, choice, readout } from '../../kit.js';

// scores [SN2, SN1, E]
const T = {
  me: { aq: [90, 0, 0], alc: [85, 0, 0], nai: [100, 0, 0], h2o: [30, 0, 0] },
  p: { aq: [85, 0, 15], alc: [25, 0, 75], nai: [100, 0, 0], h2o: [25, 0, 5] },
  s: { aq: [45, 30, 25], alc: [10, 5, 85], nai: [90, 5, 5], h2o: [5, 55, 10] },
  t: { aq: [0, 55, 45], alc: [0, 5, 95], nai: [0, 20, 10], h2o: [0, 85, 15] },
};
const NOTE = {
  me: 'No branching: the nucleophile reaches the carbon easily, and a methyl cation would be unstable, so SN2.',
  p: 'Primary: SN2 unless a strong base and heat force elimination.',
  s: 'Secondary: crowding slows SN2 and the cation is only moderately stable, so the result depends on the conditions.',
  t: 'Tertiary: the three alkyl groups block back-side attack, but stabilise the carbocation. Strong base gives elimination.',
};
const RG = { aq: 'aqueous KOH', alc: 'alcoholic KOH, heat', nai: 'NaI in dry acetone', h2o: 'water (weak nucleophile)' };
const PR = { aq: 'alcohol', alc: 'alkene', nai: 'iodide (Finkelstein)', h2o: 'alcohol (slowly)' };
export default function (host) {
  let sub = 'p', rg = 'aq';
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'Likelihood of SN2, SN1 and elimination for a chosen haloalkane and reagent' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'haloalkane', [['me', 'CH₃X'], ['p', '1°'], ['s', '2°'], ['t', '3°']], sub, (v) => { sub = v; go(); });
  choice(ctl, 'reagent', [['aq', 'aq. KOH'], ['alc', 'alc. KOH'], ['nai', 'NaI/acetone'], ['h2o', 'H₂O']], rg, (v) => { rg = v; go(); });
  const go = () => { const s = T[sub][rg], mx = s.indexOf(Math.max(...s)); ro.textContent = `Mostly ${['SN2', 'SN1', 'E (elimination)'][mx]} with ${RG[rg]}. ${NOTE[sub]}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const s = T[sub][rg], top = title(ctx, RG[rg], col), bx = 70, bw = w - bx - 18, bh = 30, gap = 18, y0 = top + 22;
    ['SN2', 'SN1', 'E'].forEach((n, i) => { const y = y0 + i * (bh + gap), c = col.s[[2, 3, 0][i]]; text(ctx, n, 16, y + bh / 2, { color: col.ink, size: 14, weight: 700 }); ctx.fillStyle = col.line; ctx.fillRect(bx, y, bw, bh); ctx.fillStyle = c; ctx.fillRect(bx, y, bw * s[i] / 100, bh); text(ctx, s[i] ? s[i] + '' : '–', bx + 6 + bw * s[i] / 100 * 0 + (s[i] > 10 ? 0 : bw * s[i] / 100), y + bh / 2, { color: s[i] > 14 ? col.panel : col.ink, size: 12, weight: 700 }); });
    text(ctx, `likely product: ${PR[rg]}${rg === 'alc' ? ' (E wins)' : ''}`, w / 2, y0 + 3 * (bh + gap) + 14, { color: col.ink, size: 13, weight: 700, align: 'center' });
    text(ctx, 'SN2: one step, inversion   SN1: carbocation   E: alkene', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
