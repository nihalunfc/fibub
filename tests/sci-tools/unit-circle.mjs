// #1183 unit circle to wave. Exact values at the special angles, radians as fractions of π and principal
// values of the inverse functions checked against sympy 1.14 (nsimplify of sin, cos, tan at k·π/180; asin,
// acos, atan of sin, cos, tan of an angle).
import * as TR from '../../src/lib/sci/school-trig.ts';
import { parse, compile } from '../../src/lib/sci/expr.ts';
const val = (s) => compile(parse(s.replace(/−/g, '-').replace(/√(\d)/g, 'sqrt($1)')), [])([]);
const near = (a, b, t = 1e-12) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
// sympy: degrees, sin, cos, tan ('u' = undefined), radians.
const SYM = [[0, '0', '1', '0', '0'], [30, '1/2', 'sqrt(3)/2', 'sqrt(3)/3', 'π/6'], [45, 'sqrt(2)/2', 'sqrt(2)/2', '1', 'π/4'], [60, 'sqrt(3)/2', '1/2', 'sqrt(3)', 'π/3'], [90, '1', '0', 'u', 'π/2'],
  [120, 'sqrt(3)/2', '-1/2', '-sqrt(3)', '2π/3'], [135, 'sqrt(2)/2', '-sqrt(2)/2', '-1', '3π/4'], [150, '1/2', '-sqrt(3)/2', '-sqrt(3)/3', '5π/6'], [180, '0', '-1', '0', 'π'], [210, '-1/2', '-sqrt(3)/2', 'sqrt(3)/3', '7π/6'],
  [225, '-sqrt(2)/2', '-sqrt(2)/2', '1', '5π/4'], [240, '-sqrt(3)/2', '-1/2', 'sqrt(3)', '4π/3'], [270, '-1', '0', 'u', '3π/2'], [300, '-sqrt(3)/2', '1/2', '-sqrt(3)', '5π/3'], [315, '-sqrt(2)/2', 'sqrt(2)/2', '-1', '7π/4'], [330, '-1/2', 'sqrt(3)/2', '-sqrt(3)/3', '11π/6']];
export default async (check) => {
  for (const [d, s, c, t, r] of SYM) {
    const e = TR.exact(d);
    check(`trig: exact sin, cos, tan at ${d}° match sympy`, e && near(val(e.sin), val(s)) && near(val(e.cos), val(c)) && (t === 'u' ? e.tan === 'undefined' : near(val(e.tan), val(t))));
    check(`trig: ${d}° = ${r} rad`, TR.piFraction(d) === r);
  }
  check('trig: exact values as written (1/√2, √3/2, −1/√3)', TR.exact(45).sin === '1/√2' && TR.exact(330).cos === '√3/2' && TR.exact(150).tan === '−1/√3' && TR.exact(390).sin === '1/2');
  check('trig: no exact value at 20°; −90° is −π/2; 400° is 20π/9', TR.exact(20) === null && TR.piFraction(-90) === '−π/2' && TR.piFraction(400) === '20π/9');
  check('trig: quadrants and ASTC', TR.quadrant(100).q === 2 && TR.quadrant(100).positive.startsWith('Sin') && TR.quadrant(200).q === 3 && TR.quadrant(-30).q === 4 && TR.quadrant(450).q === 0);
  const w = TR.waveShape(-2, 3, Math.PI / 2, 1);
  check('trig: y = −2 sin(3x + π/2) + 1: amplitude 2, period 2π/3, shift −π/6, range [−1, 3]', w.amplitude === 2 && near(w.period, 2 * Math.PI / 3) && near(w.shift, -Math.PI / 6) && w.min === -1 && w.max === 3 && w.flipped);
  const sym = { 150: [30, 150, -30], 210: [-30, 150, 30], [-30]: [-30, 30, -30], 300: [-60, 60, -60] };
  for (const [d, [a, c, t]] of Object.entries(sym)) check(`trig: sin⁻¹(sin ${d}°), cos⁻¹(cos), tan⁻¹(tan) = ${a}°, ${c}°, ${t}° (sympy)`, near(TR.backAgain('asin', +d), a, 1e-9) && near(TR.backAgain('acos', +d), c, 1e-9) && near(TR.backAgain('atan', +d), t, 1e-9));
  check('trig: principal values sin⁻¹(1/2) = 30°, cos⁻¹(−1/2) = 120°, tan⁻¹(1) = 45°, sin⁻¹(2) undefined', near(TR.principal('asin', 0.5), 30, 1e-12) && near(TR.principal('acos', -0.5), 120, 1e-12) && near(TR.principal('atan', 1), 45, 1e-12) && Number.isNaN(TR.principal('asin', 2)));
};
