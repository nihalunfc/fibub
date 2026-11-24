// #Binding curve fitter: the one-site saturation fit and the Scatchard transform, checked on exact curves and on the
// simulated short titration used in the blog article patulin-dna-aptamer-dissociation-constant-titration-range.
import { MODELS, fitBinding, scatchard } from '../../src/lib/sci/binding.ts';

export default async (check) => {
  const rel = (name, got, want, tol = 1e-9) => check(`${name}: got ${got}, want ${want}`, Math.abs(got - want) <= tol * Math.max(1e-300, Math.abs(want)));
  const one = MODELS.find((m) => m.id === 'one');
  const frac = (c, Kd) => c / (Kd + c);

  // A noiseless one-site curve over the aptamer paper's own working range must come back exactly.
  const L = [0.2, 0.5, 1, 2, 5, 8, 10, 15, 20];
  const exact = fitBinding(one, L, L.map((c) => frac(c, 18.4)));
  rel('binding: exact one-site curve over 0.2-20 µM gives Kd 18.4', exact.p[1], 18.4, 1e-3);
  rel('binding: the same curve gives Bmax 1', exact.p[0], 1, 1e-3);
  rel('binding: fraction bound at 20 µM with Kd 18.4', frac(20, 18.4), 0.5208333333333334, 1e-12);
  rel('binding: fraction bound at the 0.2 µM detection limit', frac(0.2, 18.4), 0.010752688172043012, 1e-12);

  // The nine simulated points in the article's "Check it yourself": a good-looking fit with the wrong Kd.
  const y = [0.0121, 0.0623, 0.0494, 0.1077, 0.1727, 0.3229, 0.3403, 0.4997, 0.5596];
  const f = fitBinding(one, L, y);
  rel('binding: short titration fits Kd 28.46 µM', f.p[1], 28.4645, 1e-3);
  rel('binding: its standard error on Kd is 8.93', f.se[1], 8.9307, 2e-3);
  rel('binding: its Bmax is 1.3811', f.p[0], 1.38112, 1e-3);
  rel('binding: r² is 0.9869 even so', f.r2, 0.986866, 1e-4);
  check('binding: the highest ligand is below 5 × the fitted Kd, so the page warns', 20 / f.p[1] < 5);
  const sc = scatchard(L, y);
  rel('binding: the Scatchard line on the same points gives Kd 11.42', sc.Kd, 11.4215, 2e-3);
  rel('binding: and an r² of only 0.3579', sc.line.r2, 0.357908, 1e-3);
};
