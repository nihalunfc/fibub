// #1421 Optical fibre: critical angle, NA, acceptance angle and the ray trace, checked against an independent Python
// calculation (math.asin; bounce count from x = a/tan r + 2k·a/tan r; a small-step marching tracer for the bend).
import { critical, numericalAperture, acceptance, traceFibre } from '../../src/lib/sci/q-fibre.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  check('fibre: n1 1.5, n2 1.3: C 60.0736°, NA 0.748331, θa 48.4461°', near(critical(1.5, 1.3), 60.07356513338576, 1e-9) && near(numericalAperture(1.5, 1.3), 0.7483314773547881, 1e-12) && near(acceptance(1.5, 1.3), 48.44605128967318, 1e-9));
  check('fibre: glass in air C 41.81°; no critical angle when n1 ≤ n2; NA ≥ 1 gives 90°', near(critical(1.5, 1), 41.810314895778596, 1e-9) && critical(1.3, 1.5) === null && acceptance(1.8, 1.0) === 90);
  const S = { a: 10, L1: 380, R: null, L2: 0 };
  check('fibre: straight, θ 10/20/30/45°: 2/4/7/10 reflections, all out', [[10, 2], [20, 4], [30, 7], [45, 10]].every(([t, n]) => { const r = traceFibre(S, 1.5, 1.3, t); return r.fate === 'out' && r.reflections === n; }));
  check('fibre: straight, θ 50° (beyond acceptance 48.4°) leaks at the first wall', traceFibre(S, 1.5, 1.3, 50).fate === 'leak' && traceFibre(S, 1.5, 1.3, 50).reflections === 0);
  const B = (R) => ({ a: 10, L1: 140, R, L2: 80 });
  check('fibre: bend R 100 θ 20° out after 4; R 60 θ 10° leaks after 1; R 100 θ 30° leaks after 3; R 160 θ 0° out after 3', (() => { const a = traceFibre(B(100), 1.5, 1.3, 20), b = traceFibre(B(60), 1.5, 1.3, 10), c = traceFibre(B(100), 1.5, 1.3, 30), d = traceFibre(B(160), 1.5, 1.3, 0); return a.fate === 'out' && a.reflections === 4 && b.fate === 'leak' && b.reflections === 1 && c.fate === 'leak' && c.reflections === 3 && d.fate === 'out' && d.reflections === 3; })());
  { const r = traceFibre(B(100), 1.5, 1.3, 20), p = r.pts.at(-1); check('fibre: exit point lies on the end face, inside the core', near(p[1], 180, 1e-6) && Math.abs(p[0] - 240) <= 10); }
};
