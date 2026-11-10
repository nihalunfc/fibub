// #1344 capillary rise: Jurin's law by hand (water, 0.5 mm: 2.98 cm), weight of the column = upward surface pull,
// mercury falls, hr constant, and the short-tube meniscus radius gives ρgL = 2T/R'.
import { rise, tube, LIQUIDS, questions } from '../../src/lib/sci/capillary.ts';
import { seeded } from '../../src/lib/sci/h4quiz.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  check('capillary-rise: water in a 0.5 mm tube rises 2.98 cm', near(rise(0.073, 0, 5e-4, 1000) * 100, 2.9796, 1e-4));
  const t = tube(0.073, 0, 5e-4, 1000, 0.1);
  check('capillary-rise: weight of the column equals the surface pull 2πrT cos θ', near(t.weight, t.pull, 1e-15) && !t.short && near(t.dp, 292, 1e-9));
  check('capillary-rise: mercury is pushed down (negative h)', rise(0.48, 140, 5e-4, 13600) < 0 && near(rise(0.48, 140, 5e-4, 13600) * 100, -1.1035, 1e-3));
  check('capillary-rise: h × r constant', near(rise(0.073, 0, 1e-4, 1000) * 1e-4, rise(0.073, 0, 1e-3, 1000) * 1e-3, 1e-15));
  const s = tube(0.073, 0, 5e-4, 1000, 0.02);
  check('capillary-rise: short tube: column stops at the top, flatter meniscus, no overflow', s.short && s.hShown === 0.02 && s.Rtop > s.R && near((2 * 0.073) / s.Rtop, 1000 * 9.8 * 0.02, 1e-9));
  let ok = true; const r = seeded(19); for (let i = 0; i < 200; i++) { const q = questions(r); if (q.length !== 4 || q.some((x) => !(x.ans > 0))) ok = false; }
  check('capillary-rise: questions', ok && LIQUIDS.length === 4);
};
