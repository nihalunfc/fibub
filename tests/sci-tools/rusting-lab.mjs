// #1292 Rusting lab. Checks the teaching model's pattern (no rust without both air and water; salt fastest; zinc
// protects even when scratched; paint only until scratched) and the rust mass against hand calculation with IUPAC
// atomic weights (5.6 g Fe → 8.0065 g Fe₂O₃; Fe is 69.94% of Fe₂O₃).
import { TUBES, rusted, describe, rustMass, oxygenTaken, ironPercent, M_FE2O3 } from '../../src/lib/sci/rust-l2.ts';

export default async (check) => {
  const T = Object.fromEntries(TUBES.map((t) => [t.id, t]));
  const days = Array.from({ length: 22 }, (_, i) => i);
  check('rust: dry air and no-air tubes never rust', days.every((d) => rusted(T.dry, d) === 0 && rusted(T.boiled, d) === 0));
  check('rust: air + water rusts and grows every day', days.slice(1).every((d) => rusted(T.water, d) > rusted(T.water, d - 1)));
  check('rust: salt water is always ahead of tap water', days.slice(1).every((d) => rusted(T.salt, d) > rusted(T.water, d)));
  check('rust: zinc protects, scratched or not', days.every((d) => rusted(T.zinc, d) === 0 && rusted(T.zinc, d, true) === 0));
  check('rust: paint protects until scratched, then only a little', days.every((d) => rusted(T.paint, d) === 0) && rusted(T.paint, 21, true) > 0 && rusted(T.paint, 21, true) < rusted(T.water, 21));
  check('rust: day 7 tap water ≈ 38.7%, salt ≈ 75.3%; day 21 ≈ 77.0% and 98.5%', Math.abs(rusted(T.water, 7) - 0.38737) < 1e-4 && Math.abs(rusted(T.salt, 7) - 0.75340) < 1e-4 && Math.abs(rusted(T.water, 21) - 0.77007) < 1e-4 && Math.abs(rusted(T.salt, 21) - 0.98500) < 1e-4);
  check('rust: words', describe(0) === 'none' && describe(0.05) === 'a few spots' && describe(0.387) === 'some rust' && describe(0.62) === 'a lot of rust' && describe(0.9) === 'covered in rust');
  check('mass: M(Fe₂O₃) = 159.687 g/mol', Math.abs(M_FE2O3 - 159.687) < 1e-9);
  check('mass: 5.6 g Fe → 8.0065 g rust, 2.4065 g oxygen', Math.abs(rustMass(5.6) - 8.006510878) < 1e-6 && Math.abs(oxygenTaken(5.6) - 2.406510878) < 1e-6);
  check('mass: Fe is 69.94% of Fe₂O₃; with Fe = 56, O = 16 → 70%', Math.abs(ironPercent() - 69.9431) < 1e-3 && Math.abs((112 / 160) * 100 - 70) < 1e-12);
};
