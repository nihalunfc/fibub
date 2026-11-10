// #1455 antibiotic zones. Zone diameters from the Cooper relation checked against scipy.optimize.brentq
// solving c(x) = MIC on the same diffusion profile, for five made-up cases.
import * as Z from '../../src/lib/sci/zones-r.ts';
const near = (a, b, t = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  const PY = [[[10, 0.5, 10, 4, 1], 17.16644133523988], [[30, 0.5, 10, 4, 1], 19.559542203479154], [[10, 0.5, 10, 4, 8], 11.328344308937867], [[10, 0.5, 10, 2, 1], 18.711987669967808], [[10, 1, 8, 4, 0.5], 22.362046139702457]];
  for (const [a, d] of PY) check(`zones: M ${a[0]}, D ${a[1]}, Tc ${a[2]}, h ${a[3]}, MIC ${a[4]} gives ${d.toFixed(3)} mm (brentq)`, near(Z.zoneDiameter(...a), d, 1e-9));
  check('zones: concentration at the edge equals the MIC', near(Z.conc(17.16644133523988 / 2, 10, 0.5, 10, 4), 1, 1e-9));
  check('zones: no zone when the MIC is above the disc concentration', Z.zoneDiameter(10, 0.5, 10, 4, 50) === Z.DISC_MM);
  check('zones: teaching verdicts', Z.verdict(20) === 'sensitive' && Z.verdict(15) === 'intermediate' && Z.verdict(10) === 'resistant');
};
