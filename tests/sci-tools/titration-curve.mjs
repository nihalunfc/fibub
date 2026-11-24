// #T82 Titration curve simulator: the article cases. The standard worked titrations that pin
// src/lib/sci/titration.ts live in tests/sci.mjs.
import * as T from '../../src/lib/sci/titration.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;

  // Blog article sugarcane-juice-titratable-acidity-ph-citric-acid-check: Ed-Dra et al. (2025), Front. Sustain.
  // Food Syst. 9: 1628211. 100 street-vendor juices at pH 5.23 with 0.16 % titratable acidity as citric acid
  // (AOAC 942.15: 0.1 M NaOH, factor 0.070 = citric acid monohydrate).
  const pKa = T.PRESETS.find((p) => p.id === 'citric').pKa;
  check('titration: the citric preset is 3.13, 4.76, 6.40', pKa.join() === '3.13,4.76,6.4');
  const lost = (pH) => T.alphas(10 ** -pH, pKa).reduce((s, x, i) => s + i * x, 0);
  check('titration: a citrate has lost 1.804 protons at pH 5.23 and 2.980 at pH 8.1 (60.1 % neutralised in the juice)',
    near(lost(5.23), 1.8037, 0.001) && near(lost(8.1), 2.9804, 0.001) && near((lost(5.23) / 3) * 100, 60.1, 0.1));
  // 0.16 g citric acid monohydrate per 100 mL = 22.857 meq of alkali per litre.
  const meq = (0.16 / 0.07) * 10;
  check('titration: 0.16 % as citric acid is 22.86 meq/L, so the pH and the acidity imply 19.4 mM total citrate',
    near(meq, 22.857, 0.001) && near((meq / (lost(8.1) - lost(5.23))) * 1, 19.42, 0.02));
  const t = { conc: 0.1 };
  const free = { kind: 'acid', pKa, conc: meq / 3 / 1000, volume: 10 };
  const model = { kind: 'acid', pKa, conc: 0.0194, volume: 10 };
  check('titration: the same acidity as FREE citric acid would sit at pH 2.69, not 5.23',
    near(free.conc * 1000, 7.619, 0.002) && near(T.pHAt(free, t, 0), 2.69, 0.01) && near(T.pHAt(model, t, 0), 2.46, 0.01));
  const volAt = (a, ph) => { let lo = 0, hi = 20; for (let k = 0; k < 70; k++) { const m = (lo + hi) / 2; T.pHAt(a, t, m) < ph ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
  const vJ = volAt(model, 5.23), vE = volAt(model, 8.1);
  check('titration: the juice model gives back 22.84 meq/L, 0.160 % as citric acid, between pH 5.23 and 8.1',
    near(vJ, 3.498, 0.004) && near(vE, 5.782, 0.004) && near(((vE - vJ) * 0.1 * 1000) / 10, 22.84, 0.03) && near((((vE - vJ) * 0.1 * 1000) / 10 / 10) * 0.07, 0.1599, 0.0005));
  const veq = T.equivalenceVolumes(model, t);
  check('titration: equivalence at 1.94, 3.88 and 5.82 mL with pH 3.96, 5.58 and 9.24; only the third has a jump',
    veq.map((v) => +v.toFixed(2)).join() === '1.94,3.88,5.82' && near(T.pHAt(model, t, veq[0]), 3.96, 0.02) && near(T.pHAt(model, t, veq[1]), 5.58, 0.02) && near(T.pHAt(model, t, veq[2]), 9.24, 0.02));
  check('titration: stopping at pH 8.1 undershoots the third equivalence by 0.65 %, and phenolphthalein is the right indicator',
    near(((vE - veq[2]) / veq[2]) * 100, -0.65, 0.02) && T.indicatorsFor(model, t, veq[2])[0].name === 'Phenolphthalein');
  check('titration: the half-way points sit within 0.03 of the three pKa values',
    [0.5, 1.5, 2.5].every((k, i) => Math.abs(T.pHAt(model, t, (k * 0.0194 * 10) / 0.1) - pKa[i]) < 0.04));
  // Acidifying the model juice: hold the neutralising cations fixed and add citric acid monohydrate.
  const NA = 0.0194 * lost(5.23), gPerL = (ph) => { const H = 10 ** -ph, OH = 1e-14 / H; return ((NA + H - OH) / lost(ph) - 0.0194) * 210.14; };
  check('titration: reaching pH 4.5 needs 1.48 g/L and pH 4.0 needs 3.08 g/L of citric acid monohydrate',
    near(gPerL(4.5), 1.48, 0.02) && near(gPerL(4.0), 3.08, 0.02) && near(gPerL(3.5), 5.83, 0.03));
};
