// #1460 inverse trig. Principal values and every angle in [−2π, 2π] checked against sympy 1.14 (asin, acos, atan,
// asec, acsc, solveset). cot⁻¹ uses the school range (0, π), so cot⁻¹(−1) = 3π/4 (sympy's acot gives −π/4).
import * as T from '../../src/lib/sci/school-r-invtrig.ts';
const PI = Math.PI, near = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
const same = (a, b) => a.length === b.length && a.every((x, i) => near(x, b[i], 1e-9));
export default async (check) => {
  check('inverse trig: principal values sin⁻¹(1/2) = π/6, cos⁻¹(−1/2) = 2π/3, tan⁻¹(−1) = −π/4, cot⁻¹√3 = π/6, sec⁻¹2 = π/3, cosec⁻¹(−√2) = −π/4 (sympy)',
    near(T.principal('sin', 0.5), PI / 6) && near(T.principal('cos', -0.5), 2 * PI / 3) && near(T.principal('tan', -1), -PI / 4) && near(T.principal('cot', Math.sqrt(3)), PI / 6) && near(T.principal('sec', 2), PI / 3) && near(T.principal('cosec', -Math.SQRT2), -PI / 4));
  check('inverse trig: cot⁻¹(−1) = 3π/4 and cot⁻¹ 0 = π/2 (range (0, π))', near(T.principal('cot', -1), 3 * PI / 4) && near(T.principal('cot', 0), PI / 2));
  check('inverse trig: outside the domain is undefined', Number.isNaN(T.principal('sin', 1.2)) && Number.isNaN(T.principal('sec', 0.5)) && Number.isNaN(T.principal('cosec', 0)));
  const want = { sin: [0.5, [-11, -7, 1, 5].map((k) => k * PI / 6)], cos: [-0.5, [-4, -2, 2, 4].map((k) => k * PI / 3)], tan: [-1, [-5, -1, 3, 7].map((k) => k * PI / 4)],
    cot: [Math.sqrt(3), [-11, -5, 1, 7].map((k) => k * PI / 6)], sec: [2, [-5, -1, 1, 5].map((k) => k * PI / 3)], cosec: [-Math.SQRT2, [-3, -1, 5, 7].map((k) => k * PI / 4)] };
  for (const [f, [x, a]] of Object.entries(want)) check(`inverse trig: every θ in [−2π, 2π] with ${f} θ = ${x.toFixed(3)} (sympy solveset)`, same(T.allAngles(f, x), a));
  check('inverse trig: sin⁻¹(sin 5π/6) = π/6, sin⁻¹(sin 3π/4) = π/4, cos⁻¹(cos(−π/3)) = π/3, tan⁻¹(tan 3π/4) = −π/4 (sympy)',
    near(T.undo('sin', 5 * PI / 6), PI / 6) && near(T.undo('sin', 3 * PI / 4), PI / 4) && near(T.undo('cos', -PI / 3), PI / 3) && near(T.undo('tan', 3 * PI / 4), -PI / 4));
  check('inverse trig: sin⁻¹x + cos⁻¹x = π/2 and tan⁻¹x + cot⁻¹x = π/2', [-0.9, -0.3, 0, 0.4, 1].every((x) => near(T.principal('sin', x) + T.principal('cos', x), PI / 2)) && [-5, -1, 0, 2].every((x) => near(T.principal('tan', x) + T.principal('cot', x), PI / 2)));
  check('inverse trig: angles shown as 2π/3, −π/4, π/6', T.angleText(2 * PI / 3) === '2π/3' && T.angleText(-PI / 4) === '−π/4' && T.angleText(PI / 6) === 'π/6' && T.angleText(0.3) === '0.3');
};
