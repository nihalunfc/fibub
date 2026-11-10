// #1435 Henry's law. KH(T), mole fractions, mol/L, g/L, gas volume and pressures checked against an independent
// Python version (math.exp).
import * as H from '../../src/lib/sci/henry.ts';
const rel = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.abs(b);
export default async (check) => {
  const { CO2, N2 } = H.GASES;
  const d = H.dissolved(CO2, 2.5, 298.15);
  check('henry: CO2 at 2.5 bar, 25 °C equals Python', rel(d.x, 0.0014705882352941176) && rel(d.mol, 0.08175257731958763) && rel(d.grams, 3.5979309278350513, 1e-9));
  check('henry: KH rises with temperature', rel(H.kh(CO2, 278.15), 952.9715785332993, 1e-9) && rel(H.kh(N2, 310.15), 89966.23859453859, 1e-9) && H.kh(CO2, 310) > H.kh(CO2, 298.15));
  check('henry: diver N2 at 30 m', rel(H.dissolved(N2, 0.78 * H.depthPressure(30), 310.15).mol, 0.0019251355745076842, 1e-9));
  check('henry: gas volume', rel(H.gasVolume(d.mol, 298.15), 2.026610624182474, 1e-9));
  check('henry: pressures', H.depthPressure(20) === 3 && rel(H.altitudePressure(8848), 0.3351812747898219, 1e-12));
  check('henry: x proportional to p', rel(H.moleFraction(CO2, 4, 300) / H.moleFraction(CO2, 1, 300), 4));
  let bad = 0; for (const f of [() => H.kh(CO2, 0), () => H.moleFraction(CO2, -1, 300)]) { try { f(); } catch { bad++; } }
  check('henry: bad input refused', bad === 2);
};
