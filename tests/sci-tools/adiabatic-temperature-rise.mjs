// #666 heat of reaction and adiabatic temperature rise. Checked against an independent SciPy script that integrates
// cp numerically (quad), takes a different path (reaction at the feed temperature) and solves with brentq.
import { readSpecies, adiabatic, quickRise, energyRelease, dHr0, dHrAt, dCp, limiting, cpInt, EXAMPLE } from '../../src/lib/sci/eng-adiabatic.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const sp = readSpecies(EXAMPLE).species;
  check('adiabatic: example reads 5 species, CH4 limiting', sp.length === 5 && limiting(sp) === 0);
  check('adiabatic: Hess ΔrH° = −802.5 kJ/mol', near(dHr0(sp), -802.5, 1e-9));
  check('adiabatic: Kirchhoff ΔrH(400 K), ΔrH(1000 K), ΔrH(1273.15 K) (SciPy quad)', near(dHrAt(sp, 400), -801.78997564125, 1e-9) && near(dHrAt(sp, 1000), -802.44997564125, 1e-9) && near(dHrAt(sp, 1273.15), -805.49320125, 1e-9));
  check('adiabatic: Δcp at 298.15 K', near(dCp(sp, 298.15), 8.14255, 1e-9));
  const py = [[298.15, 1, 2209.6891582472226], [500, 1, 2354.3196726751785], [298.15, 0.5, 1326.3428562132267], [400, 0.8, 1940.9146874116298]];
  for (const [T, X, want] of py) check(`adiabatic: outlet at ${T} K feed, ${X * 100} % conversion = ${want.toFixed(3)} K (SciPy)`, near(adiabatic(sp, T, X).T, want, 1e-7));
  check('adiabatic: 20 mol N2 diluent cools the flame to 1358.867 K (SciPy)', near(adiabatic(sp.map((s) => (s.name === 'N2' ? { ...s, feed: 20 } : s)), 298.15, 1).T, 1358.8666342898005, 1e-7));
  const e = energyRelease(sp, 298.15, 1);
  check('adiabatic: 2520.71 kJ/kg feed, 50031.2 kJ/kg CH4', near(e.perKgFeed, 2520.7090778193933, 1e-8) && near(e.perKgKey, 50031.17206982544, 1e-6));
  check('adiabatic: quick estimate 2334.87 K', near(quickRise(sp, 298.15, 1), 2334.872316292668, 1e-8));
  check('adiabatic: zero conversion keeps the feed temperature', near(adiabatic(sp, 350, 0).T, 350, 1e-8));
  check('adiabatic: polynomial cp integral', near(cpInt({ cp: [10, 0.1, 1e-4, 1e-7] }, 300, 600), 10 * 300 + 0.05 * (600 ** 2 - 300 ** 2) + (1e-4 / 3) * (600 ** 3 - 300 ** 3) + (1e-7 / 4) * (600 ** 4 - 300 ** 4), 1e-8));
  check('adiabatic: reader errors', !!readSpecies('A, -1, 1, 0, 10, 20').error && !!readSpecies('A, -1, 1, 0, 0, 20\nB, 1, 0, -5, 10, 20').error && !readSpecies('A, -1, 1, 0, 10, 20\nB, 1, 0, -5, 10, 20').error);
  // New with the nitration thermal-risk article (Sheng et al. 2025, Molecules 30: 2939): a lumped batch of mass m (g)
  // and cp (kJ/kg/K) releasing Q (kJ) warms by Q / (m cp) (closed form).
  const lump = (m, cp, Q) => readSpecies(`batch, -1, 1, 0, ${m}, ${m * cp}\nreleased, 1, 0, ${-Q}, ${m}, ${m * cp}`).species;
  for (const [m, cp, Q, Tp] of [[891.33, 1.25, 91.2, 27.5], [1000, 1.31, 258.25, 30], [1400, 1.6, 9.94, 55], [321.8, 1.99, 0.78, 55]]) {
    const want = Q / ((m / 1000) * cp), s2 = lump(m, cp, Q);
    check(`adiabatic: lumped batch ${m} g, cp ${cp}, ${Q} kJ rises ${want.toFixed(3)} K (Q / m cp)`, near(adiabatic(s2, Tp + 273.15, 1).T - Tp - 273.15, want, 1e-6) && near(quickRise(s2, Tp + 273.15, 1), want, 1e-6));
  }
};
