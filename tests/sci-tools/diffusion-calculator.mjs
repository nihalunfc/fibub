// #851 diffusion calculator: checked against SciPy (scipy.special.erf, erfc, erfinv; brentq for depths and times) and
// an independent vectorised NumPy FTCS finite-difference solver on the same grid.
import { erf, erfc, erfinv, arrhenius, conc, depthFor, timeFor, diffLength, finiteDiff, R_GAS } from '../../src/lib/sci/diffusion.ts';

export default async (check) => {
  const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
  check('diffusion: erf and erfc match scipy.special', near(erf(0.5), 0.5204998778130465, 1e-15) && near(erfc(3), 2.2090496998585445e-05, 1e-14) && near(erfc(5.5), 7.357847917974398e-15, 1e-14) && near(erf(2.2), 0.9981371537020182, 1e-15) && erf(-0.5) === -erf(0.5) && erf(0) === 0);
  check('diffusion: erfinv matches scipy.special', near(erfinv(0.5), 0.4769362762044699, 1e-15) && near(erfinv(0.995), 1.984872612615532, 1e-14) && near(erfinv(-0.7), -0.7328690779592169, 1e-14));
  check('diffusion: erf(erfinv(y)) = y across the range', [-0.999999, -0.9, -0.2, 1e-8, 0.4, 0.93, 0.99999].every((y) => near(erf(erfinv(y)), y, 1e-13)));
  const D = arrhenius(2e-5, 140000, 1273.15), t = 4 * 3600;
  check('diffusion: Arrhenius D = D0 exp(−Q/RT)', near(D, 3.607775801339348e-11, 1e-14) && R_GAS === 8.314462618);
  check('diffusion: diffusion length √(Dt)', near(diffLength(D, t), 0.0007207771607042402, 1e-14));
  const S = { kind: 'surface', C0: 0.2, Cs: 1.0 };
  check('diffusion: carburising case depth to 0.4 matches brentq', near(depthFor(S, D, t, 0.4), 0.0011725888964237746, 1e-12));
  check('diffusion: time to reach 0.4 at 0.5 mm matches brentq', near(timeFor(S, D, 5e-4, 0.4), 2618.2489976595593, 1e-12));
  check('diffusion: surface stays at Cs, half-way at x = 2√(Dt) erfinv(1/2)', conc(S, D, 0, t) === 1 && near(conc(S, D, 2 * Math.sqrt(D * t) * erfinv(0.5), t), 0.6, 1e-13));
  const F = { kind: 'film', C0: 0, M: 5e-6, sides: 1 };
  check('diffusion: thin film depth and first time match brentq', near(depthFor(F, D, t, 0.001), 0.001683904666478984, 1e-12) && near(timeFor(F, D, 5e-4, 0.001), 583.8452570022675, 1e-10));
  { // Mass is conserved: ∫ C dx = M for a one-sided film (Simpson).
    let s = 0; const L = 20 * Math.sqrt(D * t), n = 2000, h = L / n;
    for (let i = 0; i <= n; i++) s += (i === 0 || i === n ? 1 : i % 2 ? 4 : 2) * conc(F, D, i * h, t);
    check('diffusion: thin film keeps its amount M', near((s * h) / 3, 5e-6, 1e-9));
  }
  check('diffusion: film peak at t = x²/(2D) is not passed', typeof timeFor(F, D, 5e-4, 0.01) === 'string' && typeof depthFor(F, D, t, 1) === 'string');
  const C = { kind: 'couple', C1: 0, C2: 1 };
  check('diffusion: couple position and time match brentq', near(depthFor(C, D, t, 0.3), -0.0005345386618797433, 1e-12) && near(timeFor(C, D, -3e-4, 0.3), 4535.725435962831, 1e-12));
  check('diffusion: couple interface stays at the mean', conc(C, D, 0, t) === 0.5 && typeof timeFor(C, D, 3e-4, 0.3) === 'string');
  // Finite differences against the exact solutions (and against NumPy's FTCS, which gives the same grid values).
  for (const c of [S, F, { kind: 'film', C0: 0.1, M: 5e-6, sides: 2 }, C]) {
    const xm = 8 * Math.sqrt(D * t), fd = finiteDiff(c, D, t, xm), ex = fd.x.map((x) => conc(c, D, x, t));
    const rng = Math.max(...ex) - Math.min(...ex), err = Math.max(...fd.c.map((v, i) => Math.abs(v - ex[i]))) / rng;
    check(`diffusion: ${c.kind}${c.sides ? c.sides : ''} finite differences agree with the erf solution within 0.02 %`, err < 2e-4 && fd.r <= 0.5);
  }
  check('diffusion: bad targets give reasons', typeof depthFor(S, D, t, 1.2) === 'string' && typeof depthFor(C, D, t, 2) === 'string' && typeof timeFor(S, D, 1e-3, 0.1) === 'string');
};
