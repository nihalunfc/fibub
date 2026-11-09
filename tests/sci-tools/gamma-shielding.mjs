// #946 gamma shielding. No data table is used: the coefficients are computed from formulas, so these checks test
// the model itself (Klein-Nishina against a numerical integration of the differential cross-section with SciPy
// quad, the Thomson limit, and the shape: photoelectric at low energy, Compton in the middle, pair above 1.022 MeV)
// and the attenuation maths against SciPy brentq, written for these tests.
import { massAtten, parts, kleinNishina, photoelectric, pairProduction, zOverA, fromFormula, mix, transmission, hvl, tvl, thicknessFor, buildup, MATERIALS, LINES, ACCURACY, RANGE, NA, ME } from '../../src/lib/sci/phgamma.ts';
export default async (check) => {
  const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b);
  // ---- the Compton part is exact ----
  const KN = [[0.05, 5.61506945866107e-25], [0.1, 4.927484894781201e-25], [0.511, 2.865396717968155e-25], [0.662, 2.561403530648053e-25], [1.25, 1.888194151847917e-25], [2.0, 1.463589978789626e-25], [10, 5.098841697740695e-26], [100, 8.19851685158151e-27]];
  check('gamma: Klein-Nishina matches an angular integration of dσ/dΩ (SciPy quad)', KN.every(([E, s]) => near(kleinNishina(E), s, 1e-12)));
  const sTh = (8 / 3) * Math.PI * 2.8179403262e-13 ** 2;
  check('gamma: Klein-Nishina goes to the Thomson cross-section at low energy (series, no cancellation) and falls like ln(E)/E at high energy', near(kleinNishina(1e-6), sTh, 1e-5) && near(kleinNishina(0.0199), kleinNishina(0.0201), 2e-3) && kleinNishina(1e-4) < sTh && near((kleinNishina(100) * 100) / (kleinNishina(1000) * 1000), Math.log(2 * 100 / ME) / Math.log(2 * 1000 / ME), 0.02));
  // ---- compositions from the periodic table ----
  check('gamma: water is 11.19 % hydrogen by weight and Z/A = 0.5551', near(fromFormula([[1, 2], [8, 1]])[0][1], 0.1119, 1e-3) && near(zOverA(MATERIALS.water.comp), 0.5550929780738274, 1e-12) && near(zOverA(MATERIALS.lead.comp), 82 / 207.2, 1e-3));
  check('gamma: a mixture keeps its weight fractions and they add to 1', (() => { const m = mix([[0.5, [[1, 1]]], [0.5, [[8, 1]]]]); return near(m[0][1], 0.5) && m.reduce((s, [, w]) => s + w, 0) === 1 && Object.values(MATERIALS).every((x) => near(x.comp.reduce((s, [, w]) => s + w, 0), 1, 1e-12)); })());
  // ---- the model's shape ----
  const pbLo = parts(MATERIALS.lead.comp, 0.1), pbMid = parts(MATERIALS.lead.comp, 1), w2 = parts(MATERIALS.water.comp, 2);
  check('gamma: photoelectric dominates for lead at 0.1 MeV (95 % of μ/ρ) and has faded to a fifth by 1 MeV', pbLo.photo / pbLo.total > 0.9 && pbLo.photo > 10 * pbLo.compton && pbMid.photo / pbMid.total < 0.25 && pbMid.photo < 0.3 * pbMid.compton);
  check('gamma: at 2 MeV water is Compton: within 1 % of the pure Klein-Nishina value', near(w2.total, zOverA(MATERIALS.water.comp) * NA * kleinNishina(2), 0.01) && w2.photo / w2.total < 1e-4);
  check('gamma: pair production is zero below 1.022 MeV and rises above it', pairProduction(82, 1.021) === 0 && pairProduction(82, 1.03) > 0 && pairProduction(82, 2) > 3 * pairProduction(82, 1.5) && parts(MATERIALS.lead.comp, 2).pair > parts(MATERIALS.lead.comp, 1.5).pair);
  check('gamma: photoelectric scales steeply with Z and falls steeply with energy', photoelectric(82, 0.1) / photoelectric(41, 0.1) > 20 && photoelectric(82, 0.2) / photoelectric(82, 0.1) < 0.25);
  check('gamma: μ/ρ falls with energy for every material over 0.1 to 2 MeV', Object.keys(MATERIALS).every((k) => { for (let E = 0.1; E < 2; E += 0.05) if (!(massAtten(k, E + 0.05) < massAtten(k, E))) return false; return true; }));
  check('gamma: heavy materials attenuate more per gram at 0.1 MeV, and all are within 20 % of each other at 2 MeV', massAtten('lead', 0.1) > 10 * massAtten('water', 0.1) && (() => { const v = Object.keys(MATERIALS).map((k) => massAtten(k, 2)); return Math.max(...v) / Math.min(...v) < 1.25; })());
  check('gamma: outside the model range, and unknown materials, give NaN', Number.isNaN(massAtten('lead', RANGE[1] + 1)) && Number.isNaN(massAtten('lead', RANGE[0] / 2)) && Number.isNaN(massAtten('unobtainium', 1)));
  // ---- attenuation maths (SciPy brentq), with a μ/ρ typed in rather than from the model ----
  const mu = 1.261766901446893; // as if typed: 0.11117 cm²/g × 11.35 g/cm³
  check('gamma: HVL 0.549 cm and TVL 1.825 cm for μ = 1.26 /cm', near(hvl(mu), 0.5493464599246499) && near(tvl(mu), 1.8248894390506092));
  check('gamma: narrow-beam transmission through 2 cm', near(transmission(mu, 2), 0.08017578014736529));
  check('gamma: linear buildup B = 1 + μx through 2 cm', near(transmission(mu, 2, { kind: 'linear' }), 0.28250207152262213));
  check('gamma: thickness for 0.1 % with linear buildup (SciPy brentq)', near(thicknessFor(mu, 1e-3, { kind: 'linear' }), 7.317844100890473, 1e-9));
  check('gamma: thickness for 0.1 % with Berger buildup a = 1.2, b = 0.05 (SciPy brentq)', near(thicknessFor(mu, 1e-3, { kind: 'berger', a: 1.2, b: 0.05 }), 7.871724703297999, 1e-9));
  check('gamma: thickness without buildup is 3 TVL for 0.1 %', near(thicknessFor(mu, 1e-3), 3 * tvl(mu), 1e-12));
  check('gamma: buildup forms', buildup(2, { kind: 'none' }) === 1 && buildup(2, { kind: 'linear' }) === 3 && near(buildup(2, { kind: 'berger', a: 1, b: 0.1 }), 1 + 2 * Math.exp(0.2)));
  check('gamma: impossible transmissions give null', thicknessFor(mu, 1.5) === null && thicknessFor(mu, 0) === null && thicknessFor(mu, 1e-3, { kind: 'berger', a: 1, b: 1.2 }) === null);
  check('gamma: six materials, six lines, and the accuracy note says the values are approximate', Object.keys(MATERIALS).length === 6 && Object.keys(LINES).length === 6 && /approximate/.test(ACCURACY) && /XCOM/.test(ACCURACY));
};
