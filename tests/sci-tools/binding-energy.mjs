// #1070 binding-energy: checked against Python (same masses and liquid drop formula) and well-known results
// (helium-4 about 28.3 MeV, D–T fusion 17.6 MeV, U-235 fission about 200 MeV, the peak near iron).
import { massDefect, bindingMeV, semf, stableZ, qValue, NUCLEI, M_N, U_MEV } from '../../src/lib/sci/learnbinding.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const by = (id) => NUCLEI.find((n) => n.id === id);
  const he = by('he4');
  check('bind: He-4 mass defect 0.030377 u', near(massDefect(2, 4, he.M), 0.03037690000000003));
  check('bind: He-4 B = 28.296 MeV, 7.074 MeV per nucleon', near(bindingMeV(2, 4, he.M), 28.295903199802343, 1e-9) && near(bindingMeV(2, 4, he.M) / 4, 7.073975799950586, 1e-9));
  const fe = by('fe56'), feB = bindingMeV(26, 56, fe.M) / 56;
  check(`bind: Fe-56 B/A = 8.79 MeV (got ${feB.toFixed(3)})`, near(feB, 8.790349827157813, 1e-9));
  check('bind: D–T fusion releases 17.59 MeV', near(qValue([by('h2').M, by('h3').M], [he.M, M_N]), 17.58947765552541, 1e-9));
  check('bind: U-235 + n → Ba-141 + Kr-92 + 3n releases about 173 MeV', near(qValue([by('u235').M, M_N], [by('ba141').M, by('kr92').M, 3 * M_N]), 173.27854495942657, 1e-9));
  const s = semf(26, 56);
  check(`bind: liquid drop Fe-56 B/A = 8.846 MeV (Python; got ${s.perNucleon.toFixed(3)})`, near(s.perNucleon, 8.846137498920985, 1e-9));
  check('bind: liquid drop terms add up', near(s.vol + s.surf + s.coul + s.asym + s.pair, s.B));
  const u = semf(92, 235);
  check(`bind: liquid drop U-235 B/A = 7.6 MeV (got ${u.perNucleon.toFixed(3)})`, Math.abs(u.perNucleon - 7.6) < 0.05);
  let peakA = 0, peak = 0; for (let A = 10; A <= 250; A++) { const v = semf(stableZ(A), A).perNucleon; if (A % 2 === 1 && v > peak) { peak = v; peakA = A; } }
  check(`bind: liquid drop curve peaks near iron (A = ${peakA})`, peakA >= 50 && peakA <= 70);
  check('bind: liquid drop stable Z for A = 56 is 25 or 26, for A = 238 is 92 or 93', [25, 26].includes(stableZ(56)) && [92, 93].includes(stableZ(238)));
  check('bind: 1 u = 931.494 MeV', near(U_MEV, 931.49410242, 1e-12));
};
