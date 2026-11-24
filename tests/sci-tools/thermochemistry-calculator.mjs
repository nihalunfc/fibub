// #95 Thermochemistry calculator: reaction values from standard formation data, ΔG at any temperature, ln K and the
// sign-change temperature. The general checks live in tests/sci.mjs; this file pins the research-article cases.
import * as T from '../../src/lib/sci/thermo.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const put = (nu, f, phase) => { const x = T.lookup(f, phase); return { nu, H: x.H, S: x.S, G: x.G }; };

  // Blog article carbon-monoxide-oxidation-reaction-enthalpy-entropy-lnk-recomputed:
  // Wang et al. (2026), Molecules 31(10): 1729, report -565.968 kJ/mol, -173.006 J/(mol K), -514.38 kJ/mol,
  // ln K = 207.6 at 298.15 K and 180.48 at 338.15 K for 2CO + O2 -> 2CO2.
  const r = T.reaction([put(-2, 'CO', 'g'), put(-1, 'O2', 'g'), put(2, 'CO2', 'g')]);
  check('thermo: 2CO + O₂ → 2CO₂ gives ΔH −565.96, ΔS −172.89, ΔG −514.40 (paper: −565.968, −173.006, −514.38)', near(r.dH, -565.96, 0.005) && near(r.dS, -172.89, 0.005) && near(r.dG, -514.4, 0.005) && r.fromG);
  check('thermo: ln K is 207.51 at 298.15 K and 180.51 at 338.15 K (paper: 207.6 and 180.48)', near(T.lnK(r.dG, 298.15), 207.507, 0.002) && near(T.lnK(T.dGat(r.dH, r.dS, 338.15), 338.15), 180.505, 0.002));
  check('thermo: ΔG at 338.15 K is −507.50 kJ/mol', near(T.dGat(r.dH, r.dS, 338.15), -507.497, 0.002));
  check('thermo: CO oxidation turns over at 3273.5 K', near(T.crossover(r.dH, r.dS), 3273.5, 0.5) && T.dGat(r.dH, r.dS, 3300) > 0);
  // Kirchhoff with the paper's ΔCp = −13.42 J/(mol·K): the constant-ΔH, constant-ΔS shortcut costs 0.02 in ln K.
  const dCp = -13.42, dH338 = r.dH + (dCp * (338.15 - 298.15)) / 1000, dS338 = r.dS + dCp * Math.log(338.15 / 298.15);
  check('thermo: a ΔCp correction moves ln K at 65 °C by only 0.02', near(T.lnK(dH338 - (338.15 * dS338) / 1000, 338.15), 180.493, 0.002));
  const half = T.reaction([put(-1, 'CO', 'g'), put(-0.5, 'O2', 'g'), put(1, 'CO2', 'g')]);
  check('thermo: written per mole of CO, every reaction value halves', near(half.dH, r.dH / 2, 1e-9) && near(half.dS, r.dS / 2, 1e-9) && near(half.dH, -282.98, 0.005) && near(T.lnK(half.dG, 298.15), T.lnK(r.dG, 298.15) / 2, 1e-9));
};
