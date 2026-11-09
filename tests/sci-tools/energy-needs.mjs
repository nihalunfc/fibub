// #484 energy needs: equations checked against an independent Python implementation (and by hand for case 1).
import { mifflin, harrisBenedict, rozaShizgal, katchMcArdle, results, kgPerWeek, gapFor, lbToKg, inToCm, leanMass } from '../../src/lib/sci/energy.ts';
export default async (check) => {
  const near = (a, b) => Math.abs(a - b) < 1e-6;
  const cases = [
    [{ sex: 'female', kg: 65, cm: 165, age: 35, bodyFat: 30 }, 1345.25, 1418.2545, 1408.268, 1352.8],
    [{ sex: 'male', kg: 80, cm: 180, age: 40, bodyFat: 20 }, 1730, 1796.995, 1796.862, 1752.4],
    [{ sex: 'male', kg: 55.3, cm: 171.2, age: 19, bodyFat: 12 }, 1533, 1555.15644, 1542.9419, 1421.1424],
    [{ sex: 'female', kg: 102, cm: 158, age: 67, bodyFat: 45 }, 1511.5, 1609.5339, 1590.161, 1581.76],
  ];
  cases.forEach(([p, m, hb, rs, km], i) => {
    check(`energy: case ${i + 1} Mifflin-St Jeor ${m}`, near(mifflin(p), m));
    check(`energy: case ${i + 1} Harris-Benedict 1919 ${hb}`, near(harrisBenedict(p), hb));
    check(`energy: case ${i + 1} Roza-Shizgal 1984 ${rs}`, near(rozaShizgal(p), rs));
    check(`energy: case ${i + 1} Katch-McArdle ${km}`, near(katchMcArdle(p), km));
  });
  const r = results(cases[0][0], 1.55);
  check('energy: total = resting × factor (Mifflin 1345.25 × 1.55 = 2085.1375)', near(r[0].total, 2085.1375) && r.length === 4);
  check('energy: Katch-McArdle needs body fat', Number.isNaN(katchMcArdle({ sex: 'male', kg: 80, cm: 180, age: 40 })));
  check('energy: lean mass 65 kg at 30 % = 45.5 kg', near(leanMass(65, 30), 45.5));
  check('energy: 500 kcal/day deficit ≈ 0.4545 kg/week by 7700 kcal/kg', near(kgPerWeek(-500), -0.45454545454545453));
  check('energy: 0.5 kg/week ↔ 550 kcal/day', near(gapFor(0.5), 550));
  check('energy: lb and inch conversions', near(lbToKg(150), 68.0388555) && near(inToCm(65), 165.1));
  let threw = 0; for (const [p, f] of [[{ sex: 'male', kg: 1, cm: 170, age: 30 }, 1.2], [{ sex: 'male', kg: 70, cm: 300, age: 30 }, 1.2], [{ sex: 'male', kg: 70, cm: 170, age: 0 }, 1.2], [{ sex: 'male', kg: 70, cm: 170, age: 30 }, 0.5]]) { try { results(p, f); } catch { threw++; } }
  check('energy: bad input refused', threw === 4);
};
