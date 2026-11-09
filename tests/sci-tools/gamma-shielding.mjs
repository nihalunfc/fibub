// #946 gamma shielding. Checked against NumPy log-log interpolation and SciPy brentq root finding (written for
// these tests), and the rounded coefficients against the Klein-Nishina Compton cross-section (they must never fall
// below it, and must approach it for light materials around 1 MeV).
import { massAtten, transmission, hvl, tvl, thicknessFor, buildup, MATERIALS, ENERGIES, LINES } from '../../src/lib/sci/phgamma.ts';
export default async (check) => {
  const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b);
  const mPb = massAtten('lead', 0.662), mu = mPb * 11.35;
  check('gamma: lead at 0.662 MeV, μ/ρ by log-log interpolation (NumPy)', near(mPb, 0.11116888999532097));
  check('gamma: lead HVL 0.549 cm and TVL 1.825 cm for Cs-137', near(hvl(mu), 0.5493464599246499) && near(tvl(mu), 1.8248894390506092));
  check('gamma: narrow-beam transmission through 2 cm of lead', near(transmission(mu, 2), 0.08017578014736529));
  check('gamma: linear buildup B = 1 + μx through 2 cm', near(transmission(mu, 2, { kind: 'linear' }), 0.28250207152262213));
  check('gamma: thickness for 0.1 % with linear buildup (SciPy brentq)', near(thicknessFor(mu, 1e-3, { kind: 'linear' }), 7.317844100890473, 1e-9));
  check('gamma: thickness for 0.1 % with Berger buildup a = 1.2, b = 0.05 (SciPy brentq)', near(thicknessFor(mu, 1e-3, { kind: 'berger', a: 1.2, b: 0.05 }), 7.871724703297999, 1e-9));
  check('gamma: thickness without buildup is 3 TVL for 0.1 %', near(thicknessFor(mu, 1e-3), 3 * tvl(mu), 1e-12));
  check('gamma: concrete at 1.25 MeV, HVL 5.30 cm', near(Math.LN2 / (massAtten('concrete', 1.25) * 2.3), 5.296455876518265));
  check('gamma: grid points come back exactly', Object.values(MATERIALS).every((m) => ENERGIES.every((e, i) => near(massAtten(Object.keys(MATERIALS).find((k) => MATERIALS[k] === m), e), m.mu[i], 1e-12))));
  check('gamma: outside 0.1 to 2 MeV is refused', Number.isNaN(massAtten('lead', 0.05)) && Number.isNaN(massAtten('lead', 3)));
  // Klein-Nishina per electron (barns) times electrons per gram: a floor for every coefficient.
  const kn = (E) => { const k = E / 0.51099895, r2 = 2.8179403262e-13 ** 2; return 2 * Math.PI * r2 * ((1 + k) / k ** 2 * (2 * (1 + k) / (1 + 2 * k) - Math.log(1 + 2 * k) / k) + Math.log(1 + 2 * k) / (2 * k) - (1 + 3 * k) / (1 + 2 * k) ** 2) / 1e-24; };
  const za = { lead: 82 / 207.2, tungsten: 74 / 183.84, iron: 26 / 55.845, aluminium: 13 / 26.98, water: 10 / 18.015, concrete: 0.5 };
  check('gamma: every coefficient is at or above the Compton floor, water and aluminium within 2 % of it at 0.5 to 1.5 MeV', Object.entries(MATERIALS).every(([k, m]) => m.mu.every((v, i) => v / (0.602214076 * za[k] * kn(ENERGIES[i])) > 0.995)) && ['water', 'aluminium'].every((k) => [5, 6, 7, 8, 9, 10].every((i) => Math.abs(MATERIALS[k].mu[i] / (0.602214076 * za[k] * kn(ENERGIES[i])) - 1) < 0.02)));
  check('gamma: buildup forms', buildup(2, { kind: 'none' }) === 1 && buildup(2, { kind: 'linear' }) === 3 && near(buildup(2, { kind: 'berger', a: 1, b: 0.1 }), 1 + 2 * Math.exp(0.2)));
  check('gamma: impossible transmissions give null', thicknessFor(mu, 1.5) === null && thicknessFor(mu, 0) === null && thicknessFor(mu, 1e-3, { kind: 'berger', a: 1, b: 1.2 }) === null);
  check('gamma: six materials and six lines', Object.keys(MATERIALS).length === 6 && Object.keys(LINES).length === 6);
};
