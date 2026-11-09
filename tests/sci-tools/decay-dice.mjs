// #1071 decay-dice: decay constant and half-life of a die, checked against Python; the dice simulation averages to
// N₀(1 − p)ᵗ over many runs, and the half-life measured from an exact exponential comes back exactly.
import { lambdaOf, halfLife, expected, expectedExp, rng, throwAll, measuredHalfLife } from '../../src/lib/sci/learndecay.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('dice: λ for a six = −ln(5/6) = 0.18232', near(lambdaOf(1 / 6), 0.1823215567939546));
  check('dice: half-life of a die = 3.8018 throws', near(halfLife(1 / 6), 3.8017840169239308));
  check('dice: coin half-life = 1 throw', near(halfLife(0.5), 1));
  check('dice: N₀(1 − p)ᵗ = N₀ e^(−λt)', near(expected(600, 1 / 6, 7), expectedExp(600, lambdaOf(1 / 6), 7)));
  const rand = rng(5); let sum = 0; const runs = 400, t = 4;
  for (let k = 0; k < runs; k++) { let a = new Array(600).fill(true); for (let i = 0; i < t; i++) a = throwAll(a, 1 / 6, rand); sum += a.filter(Boolean).length; }
  const mean = sum / runs, exp = expected(600, 1 / 6, t);
  check(`dice: mean left after 4 throws ${mean.toFixed(1)} ≈ ${exp.toFixed(1)}`, Math.abs(mean - exp) < 3);
  const series = Array.from({ length: 12 }, (_, i) => expected(1000, 1 / 6, i));
  check('dice: half-life read from an exact curve = 3.8018', near(measuredHalfLife(series), halfLife(1 / 6), 1e-9));
  check('dice: never reaching half gives NaN', Number.isNaN(measuredHalfLife([100, 90, 80])));
};
