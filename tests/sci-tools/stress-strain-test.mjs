// #1340 stress-strain tester: the curve is continuous and rises to the greatest stress, strainUnder inverts it,
// Hooke's law holds below the elastic limit, permanent set follows the unloading line of slope E, Searle's
// extension matches F L/(A Y) worked by hand, and Y comes back from the slope.
import { MATERIALS, material, wireStrain, mystery, stressAt, strainUnder, permanentSet, yieldStrain, area, breakingLoad, searleExtension, slopeThroughOrigin, youngFromSlope, questions } from '../../src/lib/sci/wiretest.ts';
import { seeded } from '../../src/lib/sci/h4quiz.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const st = material('steel');
  check('stress-strain-test: steel obeys Hooke below 250 MPa (σ = E ε)', near(stressAt(st, 0.001), 200e6, 1e-3) && near(yieldStrain(st), 0.00125, 1e-12));
  let cont = true, inv = true;
  for (const m of MATERIALS) {
    for (let i = 1; i < 2000; i++) { const e = (i / 2000) * m.ef, a = stressAt(m, e), b = stressAt(m, e + 1e-7); if (!Number.isFinite(a) || Math.abs(b - a) > m.su * 1e-3) cont = false; }
    for (let k = 1; k < 100; k++) { const s = (k / 100) * m.su, e = strainUnder(m, s); if (e === null || !near(stressAt(m, e), s, s * 1e-6)) inv = false; }
    if (strainUnder(m, m.su * 1.01) !== null) inv = false;
  }
  check('stress-strain-test: curves continuous up to fracture for every material', cont);
  check('stress-strain-test: strainUnder inverts the rising curve; over the greatest stress it breaks', inv);
  check('stress-strain-test: greatest stress at the right strain (steel 420 MPa at 0.15)', near(stressAt(st, 0.15), 420e6, 1) && stressAt(st, 0.149) < 420e6 && stressAt(st, 0.151) < 420e6 && Number.isNaN(stressAt(st, 0.26)));
  check('stress-strain-test: no permanent set inside the elastic limit; 0.05 strain steel leaves 0.05 − σ/E', permanentSet(st, 0.001) === 0 && near(permanentSet(st, 0.05), 0.05 - stressAt(st, 0.05) / 200e9, 1e-15));
  check('stress-strain-test: rubber returns fully and stretches 2× at about 1.17 MPa', permanentSet(material('rubber'), 3) === 0 && near(stressAt(material('rubber'), 1), (2e6 / 3) * (2 - 0.25), 1));
  // Searle: 2 m, 0.5 mm steel wire, 5 kg: ΔL = 49 × 2 / (1.9635e-7 × 2e11) = 2.4955 mm
  check('stress-strain-test: Searle 2 m, 0.5 mm, 5 kg steel: 2.496 mm', near(searleExtension(200e9, 2, 0.5, 5) * 1000, 2.4955, 0.0005) && near(area(0.5), 1.9635e-7, 1e-11));
  const loads = [1, 2, 3, 4, 5], ext = loads.map((M) => searleExtension(150e9, 2, 0.5, M));
  check('stress-strain-test: Y from the slope comes back exactly (150 GPa)', near(youngFromSlope(slopeThroughOrigin(loads, ext), 2, 0.5), 150e9, 1));
  check('stress-strain-test: 0.5 mm steel wire breaks at about 8.4 kg', near(breakingLoad(st, 0.5), 8.415, 0.01));
  { const a = wireStrain(st, 300e6, 0), b = wireStrain(st, 0, a.eMax), c = wireStrain(st, 300e6, a.eMax), d = wireStrain(st, 430e6, a.eMax);
    check('stress-strain-test: load past yield, unload leaves the permanent set, reload returns to the same point, over the top breaks', near(b.e, permanentSet(st, a.e), 1e-15) && near(c.e, a.e, 1e-12) && d === null); }
  check('stress-strain-test: mystery wire is elastic to 200 MPa', near(stressAt(mystery(1.5e11), 1e-3), 1.5e8, 1e-3));
  let ok = true; const r = seeded(5); for (let i = 0; i < 200; i++) { const q = questions(r); if (q.length !== 4 || q.some((x) => !(x.ans > 0) || !Number.isFinite(x.ans))) ok = false; }
  check('stress-strain-test: questions have positive answers', ok);
};
